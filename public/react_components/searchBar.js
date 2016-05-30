// input field to search for a show
// send search param to the server
// server makes the api call to find it and return a list of of matches
// each match has an "add button"


var ItemRow = React.createClass({
    render: function() {
        var image = 'https://image.tmdb.org/t/p/w185/' + this.props.result.poster_path;
        var addURL = '/api/addShow/' + this.props.result.id;
        return (
            <tr>
                <td>{this.props.result.name}</td>
                <td>{this.props.result.overview}</td>
                <td><img src={image}/></td>
                <td>
                    <a href={addURL} className="ui button">Add to Collection</a>
                </td>
            </tr>
        );
    }
});

var ResultsTable = React.createClass({
    render: function() {
        var rows = [];
        this.props.data.forEach(function (result) {
            rows.push(<ItemRow result={result} key={result.name}/>);
        });
        return (
            <table className="ui celled striped table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Overview</th>
                    <th>Poster Path</th>
                    <th>Add To Collection</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
});

var SearchBar = React.createClass({
    getInitialState() {
        return {title: ''};
    },
    handleTitleChange: function(e) {
        this.setState({title: e.target.value})
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var title = this.state.title.trim();
        if (!title) {
            return;
        }
        this.props.onSearchSubmit(title);
        this.setState({title: ''});
    },
    render: function() {
        return (
            <form className="searchForm ui centered grid form" onSubmit={this.handleSubmit}>
                <div className="two fields row">
                    <div className="field">
                        <input
                            type="text"
                            placeholder="Search shows here!"
                            value={this.state.title}
                            onChange={this.handleTitleChange}
                        />
                    </div>
                    <input className="ui button" type="submit" value="Search" />
                </div>
            </form>
        );
    }
});

var SearchResultsTable = React.createClass({
    handleSearchSubmit: function(title) {
        $.ajax({
            url: '/api/search/tv/' + title,
            dataType: 'json',
            cache: false,
            success: function(data) {
                ReactDOM.render(
                    <ResultsTable data={data.results} />,
                    document.getElementById('search-results-component')
                );
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    render: function() {
        return (
            <div>
                <SearchBar onSearchSubmit={this.handleSearchSubmit} />
            </div>
        );

    }
});

ReactDOM.render(
    <SearchResultsTable data=''/>,
    document.getElementById('search-component')
);