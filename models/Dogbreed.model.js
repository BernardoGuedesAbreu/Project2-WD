const { Schema, model } = require("mongoose");

const dogSchema = new Schema(
  {
    name: {
      type: String,
    },
    image: {
      id: {
        type: String,
      },
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
      url: {
        type: String,
      },
    },
    weight: {
      imperial: {
        type: String,
      },
      metric: {
        type: String,
      },
    },
    height: {
      imperial: {
        type: String,
      },
      metric: {
        type: String,
      },
    },
    breed_group: {
      type: String,
    },
    life_span: {
      type: String,
    },
    bred_for: {
      type: String,
    },
    temperament: {
      type: String,
    },
    origin: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const DogBreed = model("DogBreed", dogSchema);

module.exports = DogBreed;
