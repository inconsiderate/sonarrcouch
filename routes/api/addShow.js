var fs = require('fs');
var path = require('path');
var mdb = require('moviedb')('6d22a3b530e6d0e01197fb9f13b69403');
var INDEX_FILE = path.join(appRoot, 'indexDB.json');

module.exports = function(app) {
    app.get('/api/addShow/:show_id', function (req, res) {
        var showId = req.params.show_id;
        var showExists = false;
        fs.readFile(INDEX_FILE, function (err, localData) {
            var allShows = [];
            if (err) {
                console.error(err);
                process.exit(1);
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
                    addNewShowToLocalStorage(showId, allShows, function (success) {
                        if (success) {
                            res.json({message: 'added new show successfully'});
                        }
                    });
                }
            }
        });
    });

    app.get('/api/addMovie/:movie_id', function (req, res) {
        mdb.movieInfo({id: req.params.movie_id}, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.json(data);
            }
        });
    });
    
    var checkIfShowExists = function(showId, allShows, callback) {
        var showExists = false;
        allShows.forEach(function (show) {
            if (show.id == showId) {
                showExists = true;
            }
        });
        callback(showExists);
    };

    var addNewShowToLocalStorage = function(showId, localData, callback) {
        mdb.tvInfo({id: showId }, function(err, data){
            if (err) {
                callback(err);
            } else {
                localData.push(data);
                fs.writeFile(INDEX_FILE, JSON.stringify(localData, null, 4), function(err) {
                    if (err) {
                        console.error(err);
                        callback(err);
                    }
                    callback(true);
                });
            }
        });
    }
};

