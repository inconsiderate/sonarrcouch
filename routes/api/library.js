var fs = require('fs');
var path = require('path');
var mdb = require('moviedb')('6d22a3b530e6d0e01197fb9f13b69403');
var INDEX_SERIES_FILE = path.join(appRoot, 'indexSeries.json');
var INDEX_MOVIES_FILE = path.join(appRoot, 'indexMovies.json');


module.exports = function(app) {
<<<<<<< Updated upstream
=======
    
>>>>>>> Stashed changes
	app.get('/api/library/movie', function (req, res) {
		fs.readFile(INDEX_MOVIES_FILE, function (err, data) {
			if (err) {
				res.json(err)
			} else {
				var allMovies = JSON.parse(data);
				res.json(allMovies)
			}
		})
	});

	app.get('/api/library/series', function (req, res) {
		fs.readFile(INDEX_SERIES_FILE, function (err, data) {
			if (err) {
				res.json(err)
			} else {
				var allSeries = JSON.parse(data);
				res.json(allSeries)
			}
		})
	})
};