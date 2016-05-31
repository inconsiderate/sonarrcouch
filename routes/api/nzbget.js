

module.exports = function(app) {

	app.post('/api/addShow/:show_id', function (req, res) {
		$.ajax({
			url: '/api/search/movie/' + title,
			dataType: 'json',
			cache: false,
			success: function (data) {
				// return success
			},
			error: function (xhr, status, err) {
				// return err
			}
		});
	})

};