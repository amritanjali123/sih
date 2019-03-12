const Joi = require("joi");
const bcrypt = require("bcryptjs");

module.exports = {
  validateUser: (register = data => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .trim()
        .required(),
      mobile: Joi.string()
        .regex(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[3456789]\d{9}$/)
        .required()
        .trim()
        .error(error => {
          return { message: "Mobile Number Not valid" };
        }),
      password: Joi.string()
        .min(6)
        .required(),
      user_type: Joi.string()
        .valid(["DOC", "MR", "COMP"])
        .required()
    });
    const result = Joi.validate(data, schema, {
      stripUnknown: true,
      abortEarly: false
    });
    let errors = {};
    if (result.error) {
      result.error.details.forEach(
        error => (errors[error.path] = error.message)
      );
      return { userErrors: errors, userData: null };
    }
    const salt = bcrypt.genSaltSync(10);
    result.value.password = bcrypt.hashSync(data.password, salt);
    return { userErrors: null, userData: result.value };
  }),
  validateDOC: (DOC = data => {
    const schema = Joi.object({
      specialization: Joi.string(),
      qualification: Joi.string().required(),
      current_location: Joi.string()
      // contacts: Joi.object({
      //   email: Joi.string()
      //     .email({ minDomainAtoms: 2 })
      //     .trim()
      //     .required(),
      //   mobile: Joi.string()
      //     .regex(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[3456789]\d{9}$/)
      //     .required()
      //     .trim()
      //     .error(error => {
      //       return { message: "Mobile Number Not valid" };
      //     })
      // }).required()
    });
    const result = Joi.validate(data, schema, {
      stripUnknown: true,
      abortEarly: false
    });
    let errors = {};
    if (result.error) {
      result.error.details.forEach(
        error => (errors[error.path] = error.message)
      );
      return { docErrors: errors, docData: null };
    }
    return { docErrors: null, docData: result.value };
  }),
  validateMR: (MR = data => {
    const schema = Joi.object({
      emp_id: Joi.string().required()
    });
    const result = Joi.validate(data, schema, {
      stripUnknown: true,
      abortEarly: false
    });
    let errors = {};
    if (result.error) {
      result.error.details.forEach(
        error => (errors[error.path] = error.message)
      );
      return { mrErrors: errors, mrData: null };
    }
    return { mrErrors: null, mrData: result.value };
  }),
  validateCOMP: (COMP = data => {
    const schema = Joi.object({
      comp_id: Joi.string().required(),
      comp_doc: Joi.string(),
      din: Joi.string().required(),
      location: Joi.object()
      // contacts: Joi.object().keys({
      //   email: Joi.string()
      //     .email({ minDomainAtoms: 2 })
      //     .trim()
      //     .required(),
      //   mobile: Joi.string()
      //     .regex(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/)
      //     .required()
      //     .trim()
      //     .error(error => {
      //       return { message: "Mobile Number Not valid" };
      //     })
      // })
    });
    const result = Joi.validate(data, schema, {
      stripUnknown: true,
      abortEarly: false
    });
    let errors = {};
    if (result.error) {
      result.error.details.forEach(
        error => (errors[error.path] = error.message)
      );
      return { compErrors: errors, compData: null };
    }
    return { compErrors: null, compData: result.value };
  }),
  validateLogin: (login = data => {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required()
    });
    const result = Joi.validate(data, schema, {
      stripUnknown: true,
      abortEarly: false
    });
    let errors = {};
    if (result.error) {
      result.error.details.forEach(
        error => (errors[error.path] = error.message)
      );
      return { loginErrors: errors, loginData: null };
    }
    return { loginErrors: null, loginData: result.value };
  }),
  validatePOST: (validatepost = data => {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      composition: Joi.array().items(Joi.string()),
      therapeutic_indication: Joi.string(),
      warning: Joi.string(),
      side_effects: Joi.array().items(Joi.string()),
      overdose: Joi.string(),
      precaution: Joi.string().required(),
      available: Joi.boolean(),
      MRS: Joi.array()
        .items(Joi.number())
        .required()
    });
    const result = Joi.validate(data, schema, {
      stripUnknown: true,
      abortEarly: false
    });
    let errors = {};
    if (result.error) {
      result.error.details.forEach(
        error => (errors[error.path] = error.message)
      );
      return { postErrors: errors, postData: null };
    }
    return { postErrors: null, postData: result.value };
  })
};
