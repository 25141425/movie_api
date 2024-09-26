// Importing modules
const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),  
  path = require('path'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  uuid = require('uuid');

const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');
const { escapeRegExp } = require('lodash');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cfDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

// create write stream (in append mode)
// create log.txt file in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'}) // {flags: 'a'} meaning data gets appended at end of log file

// setting up logger
app.use(morgan('combined', {stream: accessLogStream}));  // Write log data created by morgan into accessLogStream (log.txt).'Combined' ist the data format.

app.use(express.static('public')); // Rooting request for static documentation.html file within "public" folder

app.get('/', (req, res) => {
  res.send('Welcome to myFlix');
});

// Get all movies
app.get('/movies', async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Get movie by title
app.get('/movies/:title', async (req, res) => {
await Movies.findOne({Title: req.params.title})
    .then((title) => {
      if(title) {
        res.json(title);
      } else {
        res.status(400).send('Title not found!');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    })
});

// Get genre description by name
app.get('/genres/:genreName', async (req, res) => {
await Movies.findOne({'Genre.Name': req.params.genreName})
    .then((genreName) => {
      if(genreName) {
        res.json(genreName.Genre);
      } else {
        res.send('Genre not found!');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Get director infos by name
app.get('/directors/:name', async (req, res) => {
await Movies.findOne({'Director.Name': req.params.name})
    .then((name) => {
      if(name) {
        res.json(name.Director);
      } else {
        res.status(400).send('Director not found!');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    })
});

// Add new user
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
  });
  
// Get all users
app.get('/users', async (req, res) => {
  await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

// Get user by username
app.get('/users/:Username', async (req, res) => {
  await Users.findOne({Username: req.params.Username})
    .then((user) => {
      if(user) {
        res.json(user);
      } else {
        res.status(400).send('User was not found!');
      } 
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// Update user info by username
app.put('/users/:Username', async (req, res) =>{
  await Users.findOneAndUpdate({Username: req.params.Username}, {$set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  {new: true}) //returns updated document
    .then((updatedUser) =>{
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.json(updatedUser);
    })
});

// Add movie to favorites 
// To remove a movie use $pull insetad of $push
// $addToSet doesn't add element if already there.
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({Username: req.params.Username}, {$push:{FavoriteMovies: req.params.MovieID}}, {new: true})  
    .then((updatedFavorites) => {
      res.json(updatedFavorites);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Delete user by username
app.delete('/users/:Username', async (req, res) => {
  await Users.findOneAndDelete({ Username: req.params.Username })
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

// Delete movie from favorites
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({Username: req.params.Username}, {$pull:{FavoriteMovies: req.params.MovieID}}, {new: true})  
    .then((updatedFavorites) => {
      res.json(updatedFavorites);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Start error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('An error occurred!');
  });
// End error handling


app.listen(8080, () => {
  console.log('Server started at port 8080.');
}); 