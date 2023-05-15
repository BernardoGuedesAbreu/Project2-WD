//Requiring Packages
const express = require("express");
const router = express.Router();
const axios = require("axios");
const session = require("express-session");

const DogBreed = require("../models/Dogbreed.model");

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
    

    await DogBreed.create({
      name,
      image: {
        id: image.id,
        width: image.width,
        height: image.height,
        url: image.url,
      },
      weight,
      height,
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


//user sess
router.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// signup form
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the user in your data store

  res.redirect("/login");
});

//login
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Retrieve the user from your data store based on the username

  // Compare the provided password with the stored hashed password using bcrypt
  const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

  if (passwordMatch) {
    // Store user information in the session
    req.session.user = {
      username: user.username,
    };

    res.redirect("/dashboard");
  } else {
    res.render("/auth/login", { error: "Invalid username or password" });
  }
});

//logout
router.get("/logout", (req, res) => {
  // Destroy the session to log out the user
  req.session.destroy();
  res.redirect("/login");
});

//authenticated area
router.get("/dashboard", (req, res) => {
  // Check if the user is authenticated
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("/auth/dashboard", { username: req.session.user.username });
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

//create route
router.get("/dogs/create", (req, res) => {
  res.render("create-breed");
});




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
module.exports = router;
