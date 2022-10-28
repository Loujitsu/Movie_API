const Models = require('../models.js/models.js');
const Movies = Models.Movies;
const topMovies = require ("../index.js");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config()
console.log ("connection", process.env.CONNECTION_URI)
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

function seedDb () {
    Movies.deleteMany()
        .then(()=> {
            Movies.insertMany (topMovies)
            .then(()=> {
                console.log("movies inserted")
                process.exit();
            });
        })
}

seedDb()