import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./routes/home/home.page";
import MovieDetailPage from "./routes/movie-detail/movie-detail.page";
import Navigation from "./routes/navigation/navigation.component";

function App() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [searchField, setSearchField] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isReached, setIsReached] = useState(false);

  useEffect(() => {
    getMovies();
  }, []);

  window.addEventListener("scroll", () => {
    const scrollLocation = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const fullHeight = document.body.scrollHeight;
    if (scrollLocation + windowHeight >= fullHeight) {
      setIsReached(true);
    }
  });

  useEffect(() => {
    const func = async () => {
      if (isReached) {
        setIsLoading(true);
        setPage((prev) => prev + 1);
        await getMovies();
        setIsLoading(false);
        setTimeout(() => {
          setIsReached(false);
        }, 1500);
      }
    };
    func();
  }, [isReached]);

  async function getMovies() {
    const fetchUrl =
      "https://yts.mx/api/v2/list_movies.json?page=" + page.toString();
    try {
      await fetch(fetchUrl)
        .then((resolve) => resolve.json())
        .then((json) => json.data)
        .then((data) =>
          setMovies((prev) => {
            const fetchedMovies = data.movies;
            if (prev.length === 0) {
              return fetchedMovies;
            } else {
              if (prev.find((movie) => movie.id === fetchedMovies[0].id)) {
                return prev;
              } else {
                return prev.concat(fetchedMovies);
              }
            }
          })
        );
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  useEffect(() => {
    const newFilteredMovies = movies.filter((movie) =>
      movie.title.toLocaleLowerCase().includes(searchField)
    );
    setFilteredMovies(newFilteredMovies);
  }, [movies, searchField]);

  return (
    <>
      <Routes>
        <Route
          path={"/"}
          element={
            <Navigation searchFieldState={{ searchField, setSearchField }} />
          }
        >
          <Route
            index={true}
            element={<HomePage movies={filteredMovies} isLoading={isLoading} />}
          />
          <Route
            path={"/movies"}
            element={
              <MovieDetailPage movies={filteredMovies} isLoading={isLoading} />
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
