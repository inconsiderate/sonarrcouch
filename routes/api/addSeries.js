var fs = require('fs');
var path = require('path');
var mdb = require('moviedb')('6d22a3b530e6d0e01197fb9f13b69403');
var INDEX_SERIES_FILE = path.join(appRoot, 'indexSeries.json');
var INDEX_MOVIES_FILE = path.join(appRoot, 'indexMovies.json');

module.exports = function(app) {
    app.get('/api/addShow/:show_id', function (req, res) {
        var showId = req.params.show_id;
        var showExists = false;
        fs.readFile(INDEX_SERIES_FILE, function (err, localData) {
            var allShows = {};
            if (err) {
                console.error(err);
            } else {
                if (localData.length) {
                    allShows = JSON.parse(localData);
                    checkIfShowExists(showId, allShows, function (result) {
                        showExists = result;
                    });
                }
                if (showExists) {
                    res.json({message: 'show already exists'})
                } else {
                    addNewSeriesToLocalStorage(showId, allShows, function (success) {
                        if (success) {
                            res.json({message: 'added new show successfully'});
                        } else {
                            res.json({message: 'ERROR! Show not added!'});
                        }
                    });
                }
            }
        });
    });

    app.get('/api/addMovie/:movie_id', function (req, res) {
        var movieId = req.params.movie_id;
        var movieExists = false;
        fs.readFile(INDEX_MOVIES_FILE, function (err, localData) {
            var allMovies = {};
            if (err) {
                res.json({err})
            } else {
                if (localData.length) {
                    allMovies = JSON.parse(localData);
                    checkIfShowExists(movieId, allMovies, function (result) {
                        movieExists = result;
                    });
                }
                if (movieExists) {
                    res.json({message: 'This movie already exists'})
                } else {
                    addNewMovieToLocalStorage(movieId, allMovies, function (result) {
                        if (result === true) {
                            res.json({message: 'Added new movie successfully'});
                        } else {
                            res.json({result});
                        }
                    });
                }
            }
        });
    });
    
    var checkIfShowExists = function(showId, allShows, callback) {
        var showExists = false;
        if (allShows[showId]) {
            showExists = true;
        }
        callback(showExists);
    };

    var addNewMovieToLocalStorage = function(movieId, localData, callback) {
        mdb.movieInfo({id: movieId}, function (err, movieData) {
            if (err) {
                callback(err);
            } else {
                localData[movieId] = movieData;
                fs.writeFile(INDEX_MOVIES_FILE, JSON.stringify(localData, null, 4), function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        // TODO: CREATE NEW FOLDER STRUCTURE FOR THE ADDED FILE
                        // TODO: KICK OFF A META-DATA FETCH FOR THIS SHOW_ID
                        callback(true);
                    }
                });
            }
        });
    };

    var addNewSeriesToLocalStorage = function(showId, localData, callback) {
        mdb.tvInfo({id: showId }, function(err, showData){
            if (err) {
                callback(err);
            } else {
                localData[showId] = showData;
                fs.writeFile(INDEX_SERIES_FILE, JSON.stringify(localData, null, 4), function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        // TODO: CREATE NEW FOLDER STRUCTURE FOR THE ADDED FILE
                        // TODO: KICK OFF A META-DATA FETCH FOR THIS SHOW_ID
                        callback(true);
                    }
                });
            }
        });
    }
};

