var express = require('express')
  , mongoose = require('mongoose');

var app = express();

app.use(express.bodyParser());

var db = mongoose.connection, movieSchema, Movie;

db.on('error', console.error);
db.once('open', function() {
  movieSchema = new mongoose.Schema({
    title: { type: String }
  , rating: String
  , releaseYear: Number
  , hasCreditCookie: Boolean
  });

  Movie = mongoose.model('Movie', movieSchema);
});

mongoose.connect('localhost', 'test');

app.get('/', function(req, res) {
  res.redirect('/movies');
});

app.get('/movies', function(req, res) {
  if (typeof req.query.creditcookie === 'undefined') {
    Movie.find(function(err, movies) {
      if (err) {
        res.statusCode = 500;
        return res.send('failed to get movies :(');
      }

      res.json(movies);
    });
  } else {
    Movie.find({ hasCreditCookie: req.query.creditcookie }, function(err, movies) {
      if (err) {
        res.statusCode = 500;
        return res.json(err);
      }

      res.statusCode = 200;
      res.json(movies);
    })
  }
});

app.post('/movie/add', function(req, res) {
  if (!req.body) {
    res.statusCode = 204;
    return res.json({ error: 'no content found' });
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

app.get('/movie/:id', function(req, res) {
  Movie.findOne({ '_id': req.params.id }, function(err, movie) {
    res.statusCode = 200;
    res.json(movie);
  })
});

app.delete('/movie/:id', function(req, res) {
  if (!req.params.id) {
    res.statusCode = 204;
    return res.json({ error: 'no content found' });
  }

  Movie.remove({ '_id': req.params.id }, function(err) {
    console.dir(err);
    res.statusCode = 200;
    res.json({ message: 'deleted' });
  });
});

app.listen(process.env.PORT || 3000);