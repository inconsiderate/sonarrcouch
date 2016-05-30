
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mdb = require('moviedb')('6d22a3b530e6d0e01197fb9f13b69403');

app.set('port', (process.env.PORT || 5050));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var INDEX_FILE = path.join(__dirname, 'indexDB.json');


// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


app.get('/api/scan', function(req, res) {
    fs.readFile(INDEX_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.json(JSON.parse(data));
    });
});

app.get('/api/search/tv/:title', function(req, res) {
    mdb.searchTv({query: req.params.title }, function(err, data){
        if (err) {
            res.send(err);
        } else {
            res.json(data);
        }
    });
});

app.get('/api/search/movie/:title', function(req, res) {
    mdb.searchMovie({query: req.params.title }, function(err, data){
        if (err) {
            res.send(err);
        } else {
            res.json(data);
        }
    });
});

app.get('/api/addShow/:show_id', function(req, res) {
    var showId = req.params.show_id;
    fs.readFile(INDEX_FILE, function(err, localData) {
        if (err) {
            console.error(err);
            process.exit(1);
        } else {
            if (localData.length) {
                var allShows = JSON.parse(localData);
                checkIfShowExists(allShows, showId, function (showExists) {
                    if (!showExists) {
                        addNewShowToLocalStorage(showId, allShows, function (success) {
                            if (success) {
                                res.json({message: 'added new show successfully'});
                            }
                        });
                    } else {
                        res.json({message: 'show already exists!'});
                    }
                });
            }
        }
    });
});

app.get('/api/addMovie/:movie_id', function(req, res) {
    mdb.movieInfo({id: req.params.movie_id }, function(err, data){
        if (err) {
            res.send(err);
        } else {
            res.json(data);
        }
    });
});

app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});


var checkIfShowExists = function(allShows, showId, callback) {
    var showExists = false;
    if (allShows.length < 2) {
        if (allShows.id == showId) {
            showExists = true;
            console.log('show #' + showId + ' already exists!');
        }
    } else {
        allShows.forEach(function (show) {
            if (show.id == showId) {
                showExists = true;
                console.log('show #' + showId + ' already exists!');
            }
        });
    }
    callback(showExists);
};

var addNewShowToLocalStorage = function(showId, localData, callback) {
    mdb.tvInfo({id: showId }, function(err, data){
        if (err) {
            res.send(err);
        } else {
            console.log('writing new show data');
            if (localData) {
                localData.push(data);
            }
            fs.writeFile(INDEX_FILE, JSON.stringify(localData, null, 4), function(err) {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                callback(true);
            });
        }
    });
}