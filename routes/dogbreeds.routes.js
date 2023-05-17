//Requiring Packages
const express = require("express");
const router = express.Router();
const axios = require("axios");
const session = require("express-session");
const isLoggedIn = require("../middleware/isLoggedIn")
const isLoggedOut = require("../middleware/isLoggedOut")

const DogBreed = require("../models/Dogbreed.model");
const User = require("../models/User.model")

// Fetch dog breeds, save them to the database, and display them
router.get("/dogs", async (req, res) => {
  try {
    const createdBreeds = await DogBreed.find();

    if (!createdBreeds.length) {
      const apiCall = await axios.get("https://api.thedogapi.com/v1/breeds");
      apiCall.data.forEach(async (breed) => {
        const {
          name,
          image,
          weight,
          height,
          breed_group,
          life_span,
          bred_for,
          temperament,
          origin,
        } = breed;
        const imageUrl = image.url; // Extract the image URL from the API response

        await DogBreed.create({
          name,
          image: {
            id: image.id,
            width: image.width,
            height: image.height,
            url: imageUrl,
          },
          weight,
          height,
          breed_group,
          life_span,
          bred_for,
          temperament,
          origin,
        });
      });
    }

    const savedBreeds = await DogBreed.find();

    res.render("breeds", { breeds: savedBreeds });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Filter dog breeds based on criteria
router.get("/dogs/filter", async (req, res) => {
  try {
    const temperamentsArray = await DogBreed.aggregate([
      { $project: { _id: 0, temperament: 1 } },
      { $unwind: "$temperament" },
      { $project: { _id: 0, temperament: { $split: ["$temperament", ", "] } } },
      { $unwind: "$temperament" },
      { $group: { _id: null, temperaments: { $addToSet: "$temperament" } } },
      { $project: { _id: 0, temperaments: 1 } },
      { $unwind: "$temperaments" },
      { $sort: { "temperaments": 1 } },
      { $group: { _id: null, temperaments: { $push: "$temperaments" } } },
      { $project: { _id: 0, temperaments: 1 } },
    ]);

    const temperaments = temperamentsArray.length > 0 ? temperamentsArray[0].temperaments : [];

    res.render("filter-form", { temperaments });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});




// Handle filtering and render filtered results
router.post("/dogs/filter/results", async (req, res) => {
  try {
    const { temperament, minWeight, maxWeight, minHeight, maxHeight } = req.body;

    // Prepare filter conditions based on the provided criteria
    const filter = {};

    if (temperament) {
      const selectedTemperaments = Array.isArray(temperament)
        ? temperament
        : [temperament];

      // Perform case-insensitive search for temperaments
      const temperamentRegex = selectedTemperaments.map((temp) =>
        new RegExp(temp, "i")
      );

      filter.temperament = { $in: temperamentRegex };
    }

    if (minWeight || maxWeight) {
      filter.$and = [];

      if (minWeight) {
        filter.$and.push({ "weight.metric": { $gte: minWeight } });
      }

      if (maxWeight) {
        filter.$and.push({ "weight.metric": { $lte: maxWeight } });
      }
    }

    if (minHeight || maxHeight) {
      filter.$and = filter.$and || [];

      if (minHeight) {
        filter.$and.push({ "height.metric": { $gte: minHeight } });
      }

      if (maxHeight) {
        filter.$and.push({ "height.metric": { $lte: maxHeight } });
      }
    }

    const filteredBreeds = await DogBreed.find(filter);
    res.render("filtered-breeds", { breeds: filteredBreeds });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});





//create route
router.get("/dogs/create", (req, res) => {
  res.render("create-breed");
});


// View breed details
router.get("/dogs/:id", async (req, res) => {
  try {
    const breed = await DogBreed.findById(req.params.id);
    if (!breed) {
      return res.sendStatus(404);
    }
    res.render("breed-details", { breed });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Edit breed form
router.get("/dogs/:id/edit", async (req, res) => {
  try {
    const breed = await DogBreed.findById(req.params.id);
    if (!breed) {
      return res.sendStatus(404);
    }
    res.render("edit-breed", { breed });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Update breed
router.post("/dogs/:id/edit", async (req, res) => {
  try {
    const breed = await DogBreed.findById(req.params.id);
    if (!breed) {
      return res.sendStatus(404);
    }

    breed.name = req.body.name;
    breed.image.url = req.body.image;
    breed.weight.metric = req.body.weight;
    breed.height.metric = req.body.height;
    breed.breed_group = req.body.breed_group;
    breed.life_span = req.body.life_span;
    breed.bred_for = req.body.bred_for;
    breed.temperament = req.body.temperament;
    breed.origin = req.body.origin;

    await breed.save();
    res.redirect("/dogs");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

//create a new dog

router.post("/dogs/create", async (req, res) => {
  try {
    const {
      name,
      image,
      weight,
      height,
      breed_group,
      life_span,
      bred_for,
      temperament,
      origin,
    } = req.body;

    console.log("test");

    await DogBreed.create({
      name,
      image: {
        url: image
      },
      weight: {
        metric: weight
      },

      height:{
        metric: height
      },
      breed_group,
      life_span,
      bred_for,
      temperament,
      origin,
    });

    res.redirect("/dogs");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

//user session
router.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// deleting a dog
router.delete("/dogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await DogBreed.findByIdAndDelete(id);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});





// POST route to add a breed to user's favorites
router.post("/dogs/:id/favorite", isLoggedIn, async (req, res) => {
  try {
    const breed = await DogBreed.findById(req.params.id);
    if (!breed) {
      return res.sendStatus(404);
    }

    const currentUser = req.session.currentUser;

    // Update the favorites array of the current user
    await User.findByIdAndUpdate(currentUser._id, {
      $addToSet: { favorites: breed._id },
    });

    res.redirect("/dogs");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});




// View favorite breeds
router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    const currentUser = req.session.currentUser;
    const userWithFavorites = await User.findById(currentUser._id).populate("favorites");

    res.render("auth/dashboard", { userWithFavorites });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Delete a breed from user's favorites
router.post("/favorites/delete/:id", isLoggedIn, async (req, res) => {
  try {
    const breedId = req.params.id;
    const currentUser = req.session.currentUser;

    // Update the favorites array of the current user
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { favorites: breedId },
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});





module.exports = router;
