const mongoose = require("mongoose");

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require("./models/Recipe.model");

// Import of the data from './data.json'
const data = require("./data.json");
const { findOneAndUpdate } = require("./models/Recipe.model");

const MONGODB_URI = "mongodb://localhost:27017/Recipe-app";

const recipeObj = {
  title: "Tiramisu",
  level: "Easy Peasy",
  ingredients: ["flour", "sugar", "coffee", "cashew"],
  cuisine: "Italian",
  dishType: "dessert",
  duration: 50,
  creator: "Hsinju",
};

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then((x) => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany();
  })
  .then(() => {
    Recipe.create(recipeObj).then((results) =>
      console.log(`Saved new recipe: ${results}`)
    );
    // Run your code here, after you have insured that the connection was made
  })

  .then(() => {
    Recipe.insertMany(data).then((results) => {
      for (const value of results) {
        console.log(value.title);
      }
    });
  })
  .then(() =>
    Recipe.findOneAndUpdate(
      { title: "Rigatoni alla Genovese" },
      { duration: 100 }
    )
  )

  .then(() => Recipe.deleteOne({ title: "Carrot Cake" }))

  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log(`Mongo connection disconnected`);
    process.exit(0);
  });
});
