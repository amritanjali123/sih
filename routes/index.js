const fs = require("fs");
const router = {};

fs.readdirSync(__dirname + "/./public")
  .filter(file => {
    return file.indexOf("js") > 0;
  })
  .forEach(file => {
    const name = file.split(".")[0];
    router[name] = require("./public/" + name);
  });

fs.readdirSync(__dirname + "/./")
  .filter(file => {
    return file.indexOf("js") > 0;
  })
  .forEach(file => {
    const name = file.split(".")[0];
    router[name] = require("./" + name);
  });

module.exports = router;
