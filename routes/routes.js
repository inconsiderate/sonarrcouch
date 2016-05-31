module.exports = function(app){

    require('./api/addSeries')(app);
    require('./api/addMovies')(app);
    require('./api/search')(app);
    require('./api/scan')(app);
    require('./api/library')(app);

};