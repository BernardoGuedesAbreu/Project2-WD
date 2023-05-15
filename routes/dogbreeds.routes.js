//Requiring Packages
const express = require("express");
const router = express.Router();
const axios = require("axios");
const session = require("express-session")

const DogBreed = require("../models/Dogbreed.model");

// Fetch dog breeds, save them to the database, and display them
router.get("/dogs", async (req, res) => {
  try {
    const createdBreeds = await DogBreed.find();

    if (!createdBreeds.length) {
      const apiCall = await axios.get("https://api.thedogapi.com/v1/breeds");
      apiCall.data.forEach(async (breed) => {
        const { name, image } = breed;
        const imageUrl = image.url; // Extract the image URL from the API response
        console.log("image url", imageUrl)
        await DogBreed.create({ name, image: imageUrl });
      });
    }

    const savedBreeds = await DogBreed.find();

    res.render("breeds", { breeds: savedBreeds });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

//user sess
router.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));



// signup form
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  
  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Save the user in your data store (e.g., database)
  // ...
  
  res.redirect('/login');
});

//login 
router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Retrieve the user from your data store based on the username
  // ...
  
  // Compare the provided password with the stored hashed password using bcrypt
  const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
  
  if (passwordMatch) {
    // Store user information in the session
    req.session.user = {
      username: user.username
    };
    
    res.redirect('/dashboard');
  } else {
    res.render('/auth/login', { error: 'Invalid username or password' });
  }
});


//logout
router.get('/logout', (req, res) => {
  // Destroy the session to log out the user
  req.session.destroy();
  res.redirect('/login');
});

//authenticated area
router.get('/dashboard', (req, res) => {
  // Check if the user is authenticated
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  res.render('/auth/dashboard', { username: req.session.user.username });
});



module.exports = router;
