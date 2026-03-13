// Fetch movies by region and language
export const fetchMoviesByRegion = createAsyncThunk(
  "netflix/fetchMoviesByRegion",
  async ({ regionCode, languageCode }) => {
    const { data } = await axios.get(
      `${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&with_origin_country=${regionCode}&with_original_language=${languageCode}`
    );
    // Only return movies with a backdrop_path
    return data.results
      .filter((movie) => movie.backdrop_path)
      .map((movie) => ({
        id: movie.id,
        name: movie.title || movie.original_title,
        image: movie.backdrop_path,
        genres: movie.genre_ids || [],
      }));
  }
);
import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import api from "../utils/api";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";

const initialState = {
  movies: [],
  genresLoaded: false,
  genres: [],
  trailerKey: null,
  trailerLoading: false,
  trailerNotFound: false,
  trailerSearchQuery: null,
  currentTrailerMovieId: null,
  searchResults: [],
  indianMovies: [],
  koreanMovies: [],
  pakistaniMovies: [],
};

export const getGenres = createAsyncThunk("netflix/genres", async () => {
  const {
    data: { genres },
  } = await axios.get(
    "https://api.themoviedb.org/3/genre/movie/list?api_key=3d39d6bfe362592e6aa293f01fbcf9b9"
  );
  return genres;
});

const createArrayFromRawData = (array, moviesArray, genres) => {
  array.forEach((movie) => {
    const movieGenres = [];
    movie.genre_ids.forEach((genre) => {
      const name = genres.find(({ id }) => id === genre);
      if (name) movieGenres.push(name.name);
    });
    if (movie.backdrop_path)
      moviesArray.push({
        id: movie.id,
        name: movie?.original_name ? movie.original_name : movie.original_title,
        image: movie.backdrop_path,
        genres: movieGenres.slice(0, 3),
      });
  });
};

const getRawData = async (api, genres, paging = false) => {
  const moviesArray = [];
  for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
    const {
      data: { results },
    } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
    createArrayFromRawData(results, moviesArray, genres);
  }
  return moviesArray;
};

export const fetchDataByGenre = createAsyncThunk(
  "netflix/genre",
  async ({ genre, type }, thunkAPI) => {
    const {
      netflix: { genres },
    } = thunkAPI.getState();
    return getRawData(
      `https://api.themoviedb.org/3/discover/${type}?api_key=3d39d6bfe362592e6aa293f01fbcf9b9&with_genres=${genre}`,
      genres
    );
  }
);
 

export const fetchCategory = createAsyncThunk(
  "netflix/category",
  async ({ category, type, genre, language }, thunkAPI) => {  
    const {
      netflix: { genres },
    } = thunkAPI.getState();
    return getRawData(
      `https://api.themoviedb.org/3/discover/${type}?api_key=3d39d6bfe362592e6aa293f01fbcf9b9&with_genres=${genre || ""}&with_original_language=${language || ""}`,
      genres
    );
  }
);  



export const fetchMovies = createAsyncThunk(
  "netflix/trending",
  async ({ type }, thunkAPI) => {
    const {
      netflix: { genres },
    } = thunkAPI.getState();
    return getRawData(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
      genres,
      true
    );
  }
);

export const getUsersLikedMovies = createAsyncThunk(
  "netflix/getLiked",
  async (email) => {
    const {
      data: { movies },
    } = await api.get(`/user/liked/${email}`);
    return movies;
  }
);

export const removeMovieFromLiked = createAsyncThunk(
  "netflix/deleteLiked",
  async ({ movieId, email }) => {
    const {
      data: { movies },
    } = await api.put("/user/remove", {
      email,
      movieId,
    });
    return movies;
  }
);

export const fetchTrailer = createAsyncThunk(
  "netflix/fetchTrailer",
  async ({ id, name }) => {
    // Step 1: Try TMDB
    try {
      const { data } = await axios.get(
        `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`
      );
      const results = data.results || [];
      const yt = results.filter((v) => v.site === "YouTube");
      const video =
        yt.find((v) => v.type === "Trailer") ||
        yt.find((v) => v.type === "Teaser") ||
        yt.find((v) => v.type === "Clip" || v.type === "Behind the Scenes") ||
        results[0];
      if (video?.key) return { key: video.key, searchQuery: null, movieId: id };
    } catch (err) {
      console.warn("TMDB video fetch failed:", err.message);
    }

    // Step 2: Try TMDB TV endpoint (some items are TV shows)
    try {
      const { data } = await axios.get(
        `${TMDB_BASE_URL}/tv/${id}/videos?api_key=${API_KEY}`
      );
      const results = data.results || [];
      const yt = results.filter((v) => v.site === "YouTube");
      const video =
        yt.find((v) => v.type === "Trailer") ||
        yt.find((v) => v.type === "Teaser") ||
        results[0];
      if (video?.key) return { key: video.key, searchQuery: null, movieId: id };
    } catch (err) {
      console.warn("TMDB TV video fetch failed:", err.message);
    }

    // Step 3: Return YouTube search query as fallback
    const searchQuery = name ? `${name} official trailer` : null;
    return { key: null, searchQuery, movieId: id };
  }
);

export const searchMovies = createAsyncThunk(
  "netflix/search",
  async (query) => {
    const { data } = await axios.get(
      `${TMDB_BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    return data.results
      .filter((item) => item.backdrop_path && (item.media_type === "movie" || item.media_type === "tv"))
      .slice(0, 10)
      .map((item) => ({
        id: item.id,
        name: item.title || item.name,
        image: item.backdrop_path,
        type: item.media_type,
      }));
  }
);

const NetflixSlice = createSlice({
  name: "Netflix",
  initialState,
  reducers: {
    closeTrailer: (state) => {
      state.trailerKey = null;
      state.trailerLoading = false;
      state.trailerNotFound = false;
      state.trailerSearchQuery = null;
      state.currentTrailerMovieId = null;
    },
    clearSearch: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMoviesByRegion.fulfilled, (state, action) => {
      const { regionCode, languageCode } = action.meta.arg;
      // Always REPLACE, never append, to avoid duplication
      if (regionCode === "IN" && languageCode === "hi") {
        state.indianMovies = action.payload;
      } else if (regionCode === "KR" && languageCode === "ko") {
        state.koreanMovies = action.payload;
      } else if (regionCode === "PK" && languageCode === "ur") {
        state.pakistaniMovies = action.payload;
      }
    });
    builder.addCase(getGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(getUsersLikedMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(removeMovieFromLiked.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(fetchTrailer.pending, (state, action) => {
      state.trailerLoading = true;
      state.trailerKey = null;
      state.trailerNotFound = false;
      state.trailerSearchQuery = null;
      state.currentTrailerMovieId = action.meta.arg.id;
    });
    builder.addCase(fetchTrailer.fulfilled, (state, action) => {
      const { key, searchQuery, movieId } = action.payload;
      state.trailerKey = key;
      state.trailerSearchQuery = searchQuery;
      state.trailerLoading = false;
      state.trailerNotFound = !key && !searchQuery;
      state.currentTrailerMovieId = movieId;
    });
    builder.addCase(fetchTrailer.rejected, (state) => {
      state.trailerKey = null;
      state.trailerLoading = false;
      state.trailerNotFound = true;
      state.trailerSearchQuery = null;
    });
    builder.addCase(searchMovies.fulfilled, (state, action) => {
      state.searchResults = action.payload;
    });
  },
});

export const store = configureStore({
  reducer: {
    netflix: NetflixSlice.reducer,
  },
});

export const { setGenres, setMovies, closeTrailer, clearSearch } = NetflixSlice.actions;