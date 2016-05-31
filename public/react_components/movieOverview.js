var ItemRow = React.createClass({
	render: function() {
		var image = 'https://image.tmdb.org/t/p/w185/' + this.props.result.poster_path;
		var downloadURL = '/api/downloadMovie/' + this.props.result.id;
		return (
			<tr>
				<td>{this.props.result.title}</td>
				<td>{this.props.result.overview}</td>
				<td><img src={image}/></td>
				<td>
					<a href={downloadURL} className="ui button">Search Now</a>
				</td>
			</tr>
		);
	}
});

var ResultsTable = React.createClass({
	render: function() {
<<<<<<< Updated upstream
		var allMovies = this.props.data;
		var rows = [];
		for (var prop in allMovies) {
			console.log(allMovies[prop]);
			rows.push(<ItemRow result={allMovies[prop]} key={allMovies[prop].title}/>);
		}
		return (
			<table className="ui celled striped table">
				<thead>
				<tr>
					<th>Name</th>
					<th>Overview</th>
					<th>Poster</th>
					<th>Search Now</th>
				</tr>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		);
=======
        // TODO: fix this to work when there is no data to display
        var allMovies = this.props.data;
        var rows = [];
        for (var prop in allMovies) {
            rows.push(<ItemRow result={allMovies[prop]} key={allMovies[prop].title}/>);
        }
        return (
            <table className="ui celled striped table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Overview</th>
                    <th>Poster</th>
                    <th>Search Now</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
>>>>>>> Stashed changes
	}
});

var MovieOverviewTable = React.createClass({
	loadDataFromServer: function() {
		$.ajax({
			url: '/api/library/movie',
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	componentDidMount: function() {
		this.loadDataFromServer();
	},
	getInitialState: function() {
		return {data: []};
	},
	render: function() {
		return (
			<div>
				<ResultsTable data={this.state.data}/>
			</div>
		);

	}
});


ReactDOM.render(
	<MovieOverviewTable />,
	document.getElementById('movie-overview-component')
);