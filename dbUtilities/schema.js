var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
    themoviedb_id: String,
    imdb_id: String,
    title: String,
    backdrop_path: String,
    poster_path: String,
    release_date: Date,
    status: Boolean
});

module.exports = mongoose.model('Movie', movieSchema);
