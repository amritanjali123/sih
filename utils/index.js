module.exports = {
  SaveImage: (saveImage = image_file => {
    const file_type = image_file.mimetype.split("/")[1];
    if (file_type === "png" || file_type === "jpg" || file_type === "jpeg") {
      const image_name = Date.now() + image_file.name;
      image_file.mv(__dirname + "/../res/img/" + image_name);
      return {
        imageError: null,
        image_name: image_name
      };
    } else
      return {
        imageError: "Only png, jpg, jpeg format allowed",
        image_name: null
      };
  }),
  SaveFile: (saveFile = file => {
    const fileName = Date.now() + file.name;
    file.mv(__dirname + "/../res/doc/" + fileName);
    return fileName;
  }),
  ResizeImage: (resizeImage = () => {})
};
