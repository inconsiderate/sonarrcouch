require('../../dbUtilities/schema.js');
var mongoose = require('mongoose');
var movieSchema = require('mongoose').model('Movie').schema;
var Movie = mongoose.model('Movie', movieSchema);


module.exports = function(app) {
	app.get('/api/library/movie', function (req, res) {
        Movie.find({}, function(err, result) {
            if (err) return err;
            res.json(result);
        });
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