var mdb = require('moviedb')('6d22a3b530e6d0e01197fb9f13b69403');

module.exports = function(app) {
    app.get('/api/search/tv/:title', function (req, res) {
        mdb.searchTv({query: req.params.title}, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.json(data);
            }
        });
    });

    app.get('/api/search/movie/:title', function (req, res) {
        mdb.searchMovie({query: req.params.title}, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.json(data);
            }
        });
    });
}