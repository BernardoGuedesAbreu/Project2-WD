const { Schema, model } = require("mongoose");

const dogSchema = new Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const DogBreed = model("DogBreed", dogSchema);

module.exports = DogBreed;
