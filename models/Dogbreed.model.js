const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const dogSchema = new Schema(
  {
    name: {
      type: String,
    },

    imageURL: {
      type:String,
      
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const DogBreed = model("DogBreed", dogSchema);

module.exports = DogBreed;
