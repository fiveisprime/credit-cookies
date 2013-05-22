var express = require('express')
  , hbs = require('hbs')
  , mongoose = require('mongoose');

var app = express();

// Express middleware
// ==================
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'hbs');

// Mongo/Mongoose configuration
// ============================
var db = mongoose.connection, movieSchema, Movie;

// Output any mongo connection errors to the console.
db.on('error', console.error);

// Create the movie schema and movie once the connection
// to mongo is made.
db.once('open', function() {
  movieSchema = new mongoose.Schema({
    title: { type: String }
  , rating: String
  , releaseYear: Number
  , hasCreditCookie: Boolean
  });

  Movie = mongoose.model('Movie', movieSchema);
});

// Connect to the local mongo instance on the test database.
mongoose.connect('localhost', 'test');


// Routes
// ======
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/movies', function(req, res) {
  if (typeof req.query.creditcookie === 'undefined') {
    // Return a list of all movies.
    Movie.find(function(err, movies) {
      if (err) {
        res.statusCode = 500;
        return res.json(err);
      }

      res.json(movies);
    });
  } else {
    // Return only movies with the specified parameter.
    Movie.find({ hasCreditCookie: req.query.creditcookie }, function(err, movies) {
      if (err) {
        res.statusCode = 500;
        return res.json(err);
      }

      res.statusCode = 200;
      res.json(movies);
    });
  }
});

app.get('/movie/:id', function(req, res) {
  Movie.findOne({ '_id': req.params.id }, function(err, movie) {
    if (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    res.statusCode = 200;
    res.json(movie);
  });
});

app.post('/movie/add', function(req, res) {
  if (!req.body) {
    res.statusCode = 400;
    return res.json({ error: 'no body content provided' });
  }

  var movie = new Movie(req.body);
  movie.save(function(err, movie) {
    if (err) {
      res.statusCode = 500;
      res.json(err);
    }

    res.statusCode = 201;
    res.json(movie);
  });
});

app.delete('/movie/:id', function(req, res) {
  Movie.remove({ '_id': req.params.id }, function(err) {
    res.statusCode = 200;
    res.json({ message: 'deleted' });
  });
});

app.listen(process.env.PORT || 3000);
