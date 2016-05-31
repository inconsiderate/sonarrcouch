var fs = require('fs');
var path = require('path');
var INDEX_SERIES_FILE = path.join(appRoot, 'indexSeries.json');

module.exports = function(app) {

    app.get('/api/scan', function (req, res) {

        // this is where we will do a "scan for file changes" later on
        fs.readFile(INDEX_SERIES_FILE, function (err, data) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            res.json(JSON.parse(data));
        });
    });

};


//
// fs read root media folder 
// for each folder in root, add folder name to object and if meta data exists
// if meta data exists, also add show_id to the object
// end we should have planned_folder_object
//
// planned_folder_object = [
//     {
//         folder_name: "bones",
//         meta_data_exists: true,
//         show_id: "12345"
//     },{
//         folder_name: "caprica",
//         meta_data_exists: false
//     },{
//         folder_name: "house",
//         meta_data_exists: true,
//         show_id: "54321"
//     }
// ];
//
// kick off a meta-data fetch job for each folder that does not have meta_data
// compare each show_id in the object against our local indexDB.json and correct any discrepancies
//
