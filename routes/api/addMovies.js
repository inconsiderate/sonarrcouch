module.exports = function(app) {
    var fs = require('fs');
    var path = require('path');
    var mdb = require('moviedb')('6d22a3b530e6d0e01197fb9f13b69403');
    require('../../data/dbUtilities/schema.js');
    var mongoose = require('mongoose');
    var movieSchema = require('mongoose').model('Movie').schema;
    var Movie = mongoose.model('Movie', movieSchema);

    app.get('/api/addMovie/:movie_id', function (req, res) {

        mongoose.connect('mongodb://localhost/movies');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));

        var movieId = req.params.movie_id;
        checkIfMovieExists(movieId, function (result) {
            if (result.length) {
                res.json({message: 'This movie already exists'})
            } else {
                addNewMovieToLocalStorage(movieId, function (result) {
                    console.log('adding movie');
                    if (result === true) {
                        // todo: not disconnecting properly after db actions
                        db.disconnect();
                        res.json({message: 'Added new movie successfully'});
                    } else {
                        db.disconnect();
                        res.json({result});
                    }
                });
            }
        });
    });

    var checkIfMovieExists = function(movieId, callback) {
        Movie.find({themoviedb_id: movieId }, function(err, result) {
            if (err) return err;
            callback(result);
        });
    };

    var addNewMovieToLocalStorage = function(movieId, callback) {
        mdb.movieInfo({id: movieId}, function (err, movieData) {
            if (err) {
                callback(err);
            } else {
                var newMovie = new Movie(movieData);
                newMovie["themoviedb_id"] = movieData.id;
                newMovie.save();
                callback(true);
            }
        });
    };
};

