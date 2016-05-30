var fs = require('fs');
var path = require('path');
var INDEX_FILE = path.join(appRoot, 'indexDB.json');

module.exports = function(app) {

    app.get('/api/scan', function (req, res) {

        // this is where we will do a "scan for file changes" later on
        fs.readFile(INDEX_FILE, function (err, data) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            res.json(JSON.parse(data));
        });
    });

}