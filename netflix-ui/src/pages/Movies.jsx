import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import CardSlider from "../components/CardSlider";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies, getGenres, fetchCategory, fetchDataByGenre } from "../store";
import CustomGenreSelector from "../components/CustomGenreSelector";
import Slider from "../components/Slider";
import NotAvailable from "../components/NotAvailable"; 
import Footer from "../components/Footer";

function MoviePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.netflix.genres);
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);
  const categories = useSelector((state) => state.netflix.categories);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, []);

  useEffect(() => {
    if (genresLoaded) {
      if (selectedGenre) {
        dispatch(fetchDataByGenre({ genre: selectedGenre, type: "movie" }));
      } else {
        dispatch(fetchMovies({ type: "movie" }));
      }
      dispatch(fetchCategory({ category: "Korean Movies", type: "movie", language: "ko" }));
      dispatch(fetchCategory({ category: "Asian Movies", type: "movie", language: "ja" }));
      dispatch(fetchCategory({ category: "Teen Movies", type: "movie", genre: "10751" }));
      dispatch(fetchCategory({ category: "Romantic Movies", type: "movie", genre: "10749" }));
      dispatch(fetchCategory({ category: "Thriller Movies", type: "movie", genre: "53" }));
      dispatch(fetchCategory({ category: "Horror Movies", type: "movie", genre: "27" }));
    }
  }, [genresLoaded, selectedGenre]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset !== 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Container>
      <div className="navbar">
        <Navbar isScrolled={isScrolled} />
      </div>
      <div className="data">
        <CustomGenreSelector
          genres={genres}
          selectedGenre={selectedGenre}
          onSelect={setSelectedGenre}
          label="Select Genre"
        />
        {movies.length ? <Slider movies={movies} categories={categories} /> : <NotAvailable />}
      </div>
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  .data {
    margin-top: 8rem;
    .not-available {
      text-align: center;
      color: white;
      margin-top: 4rem;
    }
  }
`;
export default MoviePage; 
