import React, {useState, useEffect} from 'react';
import Movielist from './components/Movielist';
import MovieListHeading from './components/MovieListHeading';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Searchbox from './components/Searchbox';
import AddFavorite from './components/AddFavourite';
import RemoveFavourites from './components/RemoveFavourites';

//app loads and useEffect gets called passing in our search value sending it to our request converting it to Json. When the user types the setSearchValue gets called and gets stored in state. Searchvalue is changed the useEffect gets triggered with the new searchValue which is passed to the api. When the movieList updates it gets rendered on our screen.
const App = () => {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const getMovieRequest = async (searchValue) => {
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=ea8b287`

    const response = await fetch(url);
    const responsJson = await response.json();

    if(responsJson.Search) {
    setMovies(responsJson.Search);
    }
  };

//useEffect function called only when page loads 
  useEffect(() => {
   getMovieRequest(searchValue);
  },[searchValue]);

  useEffect(()=> {
    const movieFavourites = JSON.parse(localStorage.getItem('react-movie-db-favourites')
    );

    setFavourites(movieFavourites);
  }, []);

  const saveToLocalStorage = (items) => {
    localStorage.setItem('react-movie-db-favourites', JSON.stringify(items))
  };

  //function to update state
  const addFavouriteMovie = (movie) => {
    const newFavouriteList = [...favourites, movie];
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  }

  //functionm to remove favourites
  const removeFavouriteMovie = (movie) =>{
    const newFavouriteList = favourites.filter((favourite)=> favourite.imdbID !== movie.imdbID
    );
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };


  return ( <div className='container-fluid movie-app'>
			<div className='row d-flex align-items-center mt-4 mb-4'>
      <MovieListHeading heading = 'Movies/TV Shows'/>
      <Searchbox searchValue={searchValue} setSearchValue={setSearchValue} / >
    </div>
    <div className="row">
      <Movielist 
      movies={movies} 
      handleFavouritesClick ={addFavouriteMovie} favouriteComponent = {AddFavorite} 
      />
    </div>
    	<div className='row d-flex align-items-center mt-4 mb-4'>
      <MovieListHeading heading = 'Favourites'/>
    </div>
      <div className="row">
      <Movielist 
      movies={favourites} 
      handleFavouritesClick ={removeFavouriteMovie} favouriteComponent = {RemoveFavourites} 
      />
    </div>
  </div>
  );
};

export default App;
