const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const mongoose = require('mongoose');
const Models = require('./models.js/models.js');

const Movies = Models.Movies;
const Users = Models.Users;
const Genres = Models.Genre;
const Directors = Models.Director;
// Change this to your connection string from MonngoAtlas the remote one
// mongoose.connect('mongodb://localhost:27017/CineAPI', { useNewUrlParser: true, useUnifiedTopology: true });
// Change <password> to your password
// Redeploy to heroku
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

const passport = require('passport');
require('./passport');

const { check, validationResult } = require('express-validator');

const cors = require('cors');
const { request } = require('express');

let allowedOrigins = ['http://localhost:8888', 'http://localhost:1234'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ //If a specific origin isn't found on found on the of allowed origins
      let message = 'The CORS policy for this application does not allow access from origin' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth')(app);

let topMovies = [
    {
      "Title": 'The Martian',
      "Description": "An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive and can survive until a potential rescue.",
      "Genre": {
          "Name": "Sci-Fi",
          "Description" : "A film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies."
      },
      "Director": {
          "Name": 'Ridley Scott',
          "Bio": "Director Ridley Scott was born on November 30, 1937 in South Shields.",
      },
      "ImageURL": "https://www.imdb.com/title/tt3659388/mediaviewer/rm1391324160/",
      "Featured": false
    },
    {
      "Title": 'Predator',
      "Description": "A team of commandos on a mission in a Central American jungle find themselves hunted by an extraterrestrial warrior.",
      "Genre": {
          "Name": "Action",
          "Description" : "A film genre where action sequences, such as fighting, stunts, car chases or explosions, take precedence over elements like characterization or complex plotting. The action typically involves individual efforts on the part of the hero, in contrast with most war films."
      },
      "Director": {
          "Name": 'John McTiernan',
          "Bio": "John McTiernan was born on January 8, 1951 in Albany, New York, USA.",
      },
      "ImageURL": "https://www.imdb.com/title/tt0093773/mediaviewer/rm35588864/",
      "Featured": false
    },
    {
      "Title": 'Dune',
      "Description": "A noble family becomes embroiled in a war for control over the galaxys most valuable asset while its heir becomes troubled by visions of a dark future.",
      "Genre": {
          "Name": "Drama",
          "Description" : "The drama genre features stories with high stakes and a lot of conflicts. They're plot-driven and demand that every character and scene move the story forward."
      },
      "Director": {
          "Name": 'Denis Villeneuve',
          "Bio": "Denis Villeneuve is a French Canadian film director and writer. He was born in 1967, in Trois-Rivières, Québec, Canada. He started his career as a filmmaker at the National Film Board of Canada",
      },
      "ImageURL": "https://www.imdb.com/title/tt1160419/mediaviewer/rm2910452737/",
      "Featured": false
    },
    {
      "Title": 'The Gentlemen',
      "Description": "An American expat tries to sell off his highly profitable marijuana empire in London, triggering plots, schemes, bribery and blackmail in an attempt to steal his domain out from under him.",
      "Genre": {
          "Name": "Action",
          "Description" : "A film genre where action sequences, such as fighting, stunts, car chases or explosions, take precedence over elements like characterization or complex plotting. The action typically involves individual efforts on the part of the hero, in contrast with most war films."
      },
      "Director": {
          "Name": 'Guy Ritchie',
          "Bio": "Guy Ritchie was born in Hatfield, Hertfordshire, UK on September 10, 1968. After watching Butch Cassidy and the Sundance Kid (1969) as a child, Guy realized that what he wanted to do was make films. He never attended film school, saying that the work of film school graduates was boring and unwatchable. At 15 years old, he dropped out of school and in 1995, got a job as a runner, ultimately starting his film career. He quickly progressed and was directing music promos for bands and commercials by 1995.",
      },
      "ImageURL": "https://www.imdb.com/title/tt8367814/mediaviewer/rm1937148929/",
      "Featured": false   
    },
    {
      "Title": 'The Dark Knight',
      "Description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      "Genre": {
          "Name": "Action",
          "Description" : "A film genre where action sequences, such as fighting, stunts, car chases or explosions, take precedence over elements like characterization or complex plotting. The action typically involves individual efforts on the part of the hero, in contrast with most war films."
      },
      "Director": {
          "Name": 'Christopher Nolan',
          "Bio": "Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made."
      },
      "ImageURL": "https://www.imdb.com/title/tt0468569/mediaviewer/rm4023877632/",
      "Featured": false
    },
    {
      "Title": 'Deadpool',
      "Description": "A wisecracking mercenary gets experimented on and becomes immortal but ugly, and sets out to track down the man who ruined his looks.",
      "Genre": {
          "Name": "Comedy",
          "Description" : "Comedies are light-hearted dramas, crafted to amuse, entertain, and provoke enjoyment. The comedy genre humorously exaggerates the situation, the language, action, and characters."
      },
      "Director": {
          "Name": 'Tim Miller',
          "Bio": "Tim Miller is an American animator, film director, creative director and visual effects artist. He was nominated for the Academy Award for Best Animated Short Film for the work on his short animated film Gopher Broke. He made his directing debut with Deadpool. Miller is also famous for creating opening sequences of The Girl with the Dragon Tattoo and Thor: The Dark World."
      },
      "ImageURL": "https://www.imdb.com/title/tt1431045/mediaviewer/rm351021568/",
      "Featured": false
    },
    {
      "Title": 'No Country For Old Men',
        "Description": "Violence and mayhem ensue after a hunter stumbles upon a drug deal gone wrong and more than two million dollars in cash near the Rio Grande.",
        "Genre": {
            "Name": "Thriller",
            "Description" : "Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety."
        },
        "Director": {
            "Name":'Coen\'s',
            "Bio": "The younger brother of Joel, Ethan Coen is an Academy Award and Golden Globe winning writer, producer and director coming from small independent films to big profile Hollywood films. He was born on September 21, 1957 in Minneapolis, Minnesota. In some films of the brothers- Ethan & Joel wrote, Joel directed and Ethan produced - with both editing under the name of Roderick Jaynes; but in 2004 they started to share the three main duties plus editing. Each film bring its own quality, creativity, art and with one project more daring the other. Joel Daniel Coen is an American filmmaker who regularly collaborates with his younger brother Ethan. They made Raising Arizona, Barton Fink, Fargo, The Big Lebowski, True Grit, O Brother Where Art Thou?, Burn After Reading, A Serious Man, Inside Llewyn Davis, Hail Caesar and other projects. Joel married actress Frances McDormand in 1984 and had an adopted son."
        },
        "ImageURL": "https://www.imdb.com/title/tt0477348/mediaviewer/rm1263244032/",
        "Featured": false
    },
    {
      "Title": 'Knives Out',
      "Description": "A detective investigates the death of the patriarch of an eccentric, combative family.",
      "Genre": {
          "Name": "Crime",
          "Description" : "A film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection."
      },
      "Director": {
          "Name": 'Rian Johnson',
          "Bio": "Rian Johnson was born in Maryland and at a young age his family moved to San Clemente, California, where he was raised. After graduating from high school, he went on to attend the University of Southern California School of Cinematic Arts. His first feature film, Brick (2005), was released in 2005 and was the metaphorical building block that launched his career. He is a director, writer, and musician, among other areas of expertise."
      },
      "ImageURL": "https://www.imdb.com/title/tt8946378/mediaviewer/rm2569376769/",
      "Featured": false
    },
    {
      "Title": 'Matrix',
        "Description": "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
        "Genre": {
            "Name": "Sci-Fi",
            "Description" : "A film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies."
        },
        "Director": {
            "Name": 'Wachowski\'s',
            "Bio": "Lana Wachowski and her sister Lilly Wachowski, also known as the Wachowskis, are the duo behind such ground-breaking movies as The Matrix (1999) and Cloud Atlas (2012). Born to mother Lynne, a nurse, and father Ron, a businessman of Polish descent, Wachowski grew up in Chicago and formed a tight creative relationship with her sister Lilly. After the siblings dropped out of college, they started a construction business and wrote screenplays. Their 1995 script, Assassins (1995), was made into a movie, leading to a Warner Bros contract. After that time, the Wachowskis devoted themselves to their movie careers. In 2012, during interviews for Cloud Atlas and in her acceptance speech for the Human Rights Campaign's Visibility Award, Lana spoke about her experience of being a transgender woman, sacrificing her much cherished anonymity out of a sense of responsibility. Lana is known to be extremely well-read, loves comic books and exploring ideas of imaginary worlds, and was inspired by Stanley Kubrick's 2001: A Space Odyssey (1968) in creating Cloud Atlas. Director, writer, and producer Lilly Wachowski was born in 1967 in Chicago, the daughter of Lynne, a nurse and painter, and Ron, a businessman. Lilly was educated at Kellogg Elementary School in Chicago, before moving on to Whitney M. Young High School. After graduating from high school, she attended Emerson College in Boston but dropped out."
        },
        "ImageURL": "https://www.imdb.com/title/tt0133093/mediaviewer/rm525547776/",
        "Featured": false
    },
    {
      "Title": 'Interstellar',
      "Description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanitys survival.",
      "Genre": {
          "Name": "Sci-fi",
          "Description" : "A film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies."
      },
      "Director": {
          "Name":'Christopher Nolan',
          "Bio": "Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made."
      },
      "ImageURL": "https://www.imdb.com/title/tt0816692/mediaviewer/rm4043724800/?ref_=tt_ov_i",
      "Featured": false
    }
  ];

  let users = [
    {
        id: 1,
        name: 'Castor',
        favoriteMovies: []
    },
    {
        id: 2,
        name: 'Troy',
        favoriteMovies: ['Face Off']
    },
]

// Create
app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })//Search to see if a user with the requested username is already exists
    .then((user) => {
      if (user) {
        //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + 'Already Exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
        .then((user) => { res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Update
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Create
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id); 
    // double == means a string value like '2' can equal integer value 2
    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(movieTitle + ' has been added to user ' + id + 's array');
    } else {
        res.status(400).send('no such user')
    }
})

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Delete
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id); 
    // double == means a string value like '2' can equal integer value 2
    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(movieTitle + ' has been removed from user ' + id + 's array');
    } else {
        res.status(400).send('no such user')
    }
})

app.delete('/users/:Username/movies/:MovieID', (req, res,) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID },
    }, 
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});  



// Delete
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


  
  // GET requests
  app.get('/', (req, res) => {
    res.send('Welcome to CineApi!');
  });

  
  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  
  // app.get('/movies', (req, res) => {
  //   res.json(topMovies);
  // });
  
  // // READ
  // app.get('/movies', (req, res) => {
  //   res.status(200).json(topMovies);
  // });

  app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  // Read
app.get('/movies/:title', (req, res) => {
  // const title = req.params.title; -this is the same as the bottom code
  const { title } = req.params;
  const movie = topMovies.find(movie => movie.Title === title);

  if (movie) {
      res.status(200).json(movie);
  } else {
      res.status(400).send('no such movie')
  }
});

// Read
app.get('/movies/genre/:genreName', (req, res) => {
  // const genre = req.params.genre; -this is the same as the bottom code
  const { genreName } = req.params;
  const genre = topMovies.find(movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
      res.status(200).json(genre);
  } else {
      res.status(400).send('no such genre')
  }
});

// Read
app.get('/movies/director/:directorName', (req, res) => {
  // const genre = req.params.genre; -this is the same as the bottom code
  const { directorName } = req.params;
  const director = topMovies.find(movie => movie.Director.Name === directorName).Director;

  if (director) {
      res.status(200).json(director);
  } else {
      res.status(400).send('no such director')
  }
});



//   Serve static content from the public directory
  app.use(express.static('public'));

  app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something went wrong!');
  });

  // listen for requests
  const port = process.env.PORT || 8888;
  app.listen(port, '0.0.0.0',() => {
   console.log('Listening on Port ' + port);
  });


  // https://git.heroku.com/protected-earth-77833.git


  // mongoimport --uri mongodb+srv://Lordonez:Bearandfinn88!@cinedb.yuo28.mongodb.net/moives --collection movies --type json --file ../moviesJSON/movies.joson