// input field to search for a show
// send search param to the server
// server makes the api call to find it and return a list of of matches
// each match has an "add button"


var ItemRow = React.createClass({
    render: function() {
        var name =  <span style={{color: 'blue'}}>
                        {this.props.result.name}
                    </span>;
        return (
            <tr>
                <td>{name}</td>
                <td>{this.props.result.id}</td>
                <td>{this.props.result.poster_path}</td>
            </tr>
        );
    }
});

var ResultsTable = React.createClass({
    render: function() {
        console.log(this.props.data);
        var rows = [];
        this.props.data.forEach(function (result) {
            rows.push(<ItemRow result={result} key={result.name}/>);
        });
        return (
            <table class="ui celled striped table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>File Path</th>
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
            <form className="searchForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={this.state.title}
                    onChange={this.handleTitleChange}
                />
                <input type="submit" value="Post" />
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
                    document.getElementById('searchresults')
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
    document.getElementById('container')
);