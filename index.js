// Importing modules
const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),  
  path = require('path'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  uuid = require('uuid');

const app = express();

let topMovies = [
  {
    title: 'Pulp Fiction',
    year: 1994,
    genre: 'Thriller',
    director: 'Quentin Tarantino'
  },
  {
    title: 'Forrest Gump',
    year: 1994,
    genre: 'Comedy',
    director: 'Robert Zemeckis'
  },
  {
    title: 'American Beauty',
    year: 1999,
    genre: 'Drama',
    director: 'Sam Mendes'
  },
];

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

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/movies/:title', (req, res) => {
  res.json(topMovies.find((movie) =>
    { return movie.title === req.params.title }));
});

app.get('/genre/:genreName', (req, res) => {
  res.json('JSON object with genre description');
});

app.get('/directors/:name', (req, res) => {
  res.json('JSON object with data about director (bio, birth year, death year)');
});

app.post('/users', (req, res) => {
  res.json('JSON object with data about new user, including id');
});

app.put('/users/:id', (req, res) => {
  res.json('JSON object with updated user data');
});

app.post('/users/:id/favorites', (req, res) => {
  res.send('Text message that movie was added to favorites');
});

app.delete('/users/:id/favorites', (req, res) => {
  res.send('Text message that movie was deleted');
});

app.delete('/users/:id', (req, res) => {
  res.send('Text message that user was deleted');
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