module.exports = function(app){

    require('./api/addShow')(app);
    require('./api/search')(app);

};