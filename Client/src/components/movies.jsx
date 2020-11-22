import React, { Component } from "react";
import Like from "./common/like";
import { getMovies } from "../services/fakeMovieService";
import Pagination from "./common/pagination";
import { paginate } from "./utils/paginate";
import ListGroup from "./common/listGroup";
import { getGenres } from "../services/fakeGenreService";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
  };

  componentDidMount() {
    this.setState({ movies: getMovies(), genres: getGenres() });
  }

  handleDelete = (movie) => {
    console.log(movie);
    const movies = this.state.movies.filter((m) => m._id !== movie._id);
    this.setState({ movies });
  };

  handleLike = (movie) => {
    console.log("Liked Clicked", movie);
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    console.log("Genre is:", genre);
  };

  render() {
    const { length: moviesCount } = this.state.movies;
    const { pageSize, currentPage, movies: allMovies, genres } = this.state;
    const movies = paginate(allMovies, currentPage, pageSize);

    if (moviesCount === 0)
      return (
        <p>
          <span style={this.styles} className={this.getBadgeClasses()}>
            {this.formatCount()}
          </span>
          Movies Available
        </p>
      );

    return (
      <div className="row">
        <div className="col-2">
          <ListGroup items={genres} onItemSelect={this.handleGenreSelect()} />
        </div>
        <div className="col">
          <p>
            Showing Total
            <span style={this.styles} className={this.getBadgeClasses()}>
              {this.formatCount()}
            </span>
            Movies
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Stock</th>
                <th>Rate</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id}>
                  <td>{movie.title}</td>
                  <td>{movie.genre.name}</td>
                  <td>{movie.numberInStock}</td>
                  <td>{movie.dailyRentalRate}</td>
                  <td>
                    <Like
                      liked={movie.liked}
                      onClick={() => this.handleLike(movie)}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => this.handleDelete(movie)} //arrow function to pass an argument
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                  {/* <td> <button className="btn btn-dark btn-sm">Like</button></td> */}
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            itemsCount={moviesCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }

  styles = {
    fontSize: 15,
    fontWeight: "Bold",
  };

  getBadgeClasses() {
    let classes = "badge m-2 badge-";
    classes += this.state.movies.length === 0 ? "warning" : "primary";
    return classes;
  }

  formatCount() {
    const moviesCount = this.state.movies.length;
    return moviesCount === 0 ? "Zero" : moviesCount;
  }
}

export default Movies;
