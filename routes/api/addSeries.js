var fs = require('fs');
var path = require('path');
var mdb = require('moviedb')('6d22a3b530e6d0e01197fb9f13b69403');
var mongoose = require('mongoose');
var INDEX_SERIES_FILE = path.join(appRoot, 'indexSeries.json');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});


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
    
    var checkIfShowExists = function(showId, allShows, callback) {
        var showExists = false;
        if (allShows[showId]) {
            showExists = true;
        }
        callback(showExists);
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

