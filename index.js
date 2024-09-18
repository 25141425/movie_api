const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'), // importing node modules fs and path 
  path = require('path');

const app = express();

let topMovies = [
  {
    title: 'Pulp Fiction',
    year: 1994
  },
  {
    title: 'Forrest Gump',
    year: 1994
  },
  {
    title: 'American Beauty',
    year: 1999
  }
];

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

// Start error handling
const bodyParser = require('body-parser'),
  methodOverride = require('method-override');

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  
  app.use(bodyParser.json());
  app.use(methodOverride());
  
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('An error occurred!');
  });
// End error handling


app.listen(8080, () => {
  console.log('Server started at port 8080.');
}); 