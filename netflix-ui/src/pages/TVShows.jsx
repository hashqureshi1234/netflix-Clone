import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import CardSlider from "../components/CardSlider";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies, getGenres, fetchCategory, fetchDataByGenre } from "../store";
import CustomGenreSelector from "../components/CustomGenreSelector";
import Slider from "../components/Slider"; 
import Footer from "../components/Footer";

function TVShows() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.netflix.genres);
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);
  const categories = useSelector((state) => state.netflix.categories);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!genres.length) dispatch(getGenres());
  }, []);

  useEffect(() => {
    if (genresLoaded) {
      if (selectedGenre) {
        dispatch(fetchDataByGenre({ genre: selectedGenre, type: "tv" }));
      } else {
        dispatch(fetchMovies({ type: "tv" }));
      }
      dispatch(fetchCategory({ category: "K-Dramas", type: "tv", language: "ko" }));
      dispatch(fetchCategory({ category: "International Dramas", type: "tv", genre: "18" }));
      dispatch(fetchCategory({ category: "Anime", type: "tv", language: "ja", genre: "16" }));
      dispatch(fetchCategory({ category: "TV Seasons", type: "tv" }));
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
      <Navbar isScrolled={isScrolled} />
      <div className="data">
        <CustomGenreSelector
          genres={genres}
          selectedGenre={selectedGenre}
          onSelect={setSelectedGenre}
          label="Select Genre"
        />
        {movies.length ? (
          <>
            <Slider movies={movies} categories={categories} />
          </>
        ) : (
          <h1 className="not-available">
            No TV Shows available for the selected genre. Please select a
            different genre.
          </h1>
        )}
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
      margin-top: 4rem;
    }
  }
`;
export default TVShows;