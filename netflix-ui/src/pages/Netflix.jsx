import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import CardSlider from "../components/CardSlider";
// Use the previous red Netflix logo for Navbar
import MovieLogo from "../assets/homeTitle.webp";

import { useSelector, useDispatch } from "react-redux";
import { fetchMovies, getGenres, fetchCategory, fetchMoviesByRegion } from "../store";
import Slider from "../components/Slider";
import Footer from "../components/Footer";

// Use a movie scene video (Big Buck Bunny sample)
const HERO_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

function Netflix() {
  const [isScrolled, setIsScrolled] = useState(false);
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.netflix.genres);
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);
  const categories = useSelector((state) => state.netflix.categories);
  const indianMovies = useSelector((state) => state.netflix.indianMovies);
  const koreanMovies = useSelector((state) => state.netflix.koreanMovies);
  const pakistaniMovies = useSelector((state) => state.netflix.pakistaniMovies);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, []);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ genres, type: "all" }));
      dispatch(fetchCategory({ category: "Korean Movies", type: "movie", language: "ko" }));
      dispatch(fetchCategory({ category: "Asian Movies", type: "movie", language: "ja" }));
      dispatch(fetchCategory({ category: "Teen Movies", type: "movie", genre: "10751" }));
      dispatch(fetchCategory({ category: "International Dramas", type: "movie", genre: "18" }));
      dispatch(fetchCategory({ category: "K-Dramas", type: "tv", language: "ko" }));
      dispatch(fetchCategory({ category: "Anime", type: "tv", language: "ja", genre: "16" }));
      dispatch(fetchCategory({ category: "TV Seasons", type: "tv" }));
      dispatch(fetchCategory({ category: "Romantic Movies", type: "movie", genre: "10749" }));
      dispatch(fetchCategory({ category: "Thriller Movies", type: "movie", genre: "53" }));
      dispatch(fetchCategory({ category: "Horror Movies", type: "movie", genre: "27" }));
      // New region/language-based rows
      dispatch(fetchMoviesByRegion({ regionCode: "IN", languageCode: "hi" }));
      dispatch(fetchMoviesByRegion({ regionCode: "KR", languageCode: "ko" }));
      dispatch(fetchMoviesByRegion({ regionCode: "PK", languageCode: "ur" }));
    }
  }, [genresLoaded]);

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
      <div className="hero w-full h-[80vh] relative flex items-center justify-center">
        {/* Movie Scene Background Video */}
        <motion.video
          className="background-video absolute top-0 left-0 w-full h-full object-cover z-0"
          src={HERO_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        {/* Gradient Overlay for logo/navbar and bottom fade */}
        <div className="hero-gradient-overlay pointer-events-none absolute inset-0 z-10" />
        {/* Center logo removed as requested */}
      </div>
      {/* Only render unique, non-empty rows */}
      <Slider movies={movies} categories={categories} />
      
       {indianMovies && indianMovies.length > 0 && (
  <CardSlider data={indianMovies} title="Indian Movies" />
)}
      
      {koreanMovies && koreanMovies.length > 0 && (
        <CardSlider data={koreanMovies} title="Korean Dramas" />
      )}
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  background-color: #000;
  .hero {
    position: relative;
    height: 80vh;
    overflow: hidden;
  }
  .background-video {
    object-fit: cover;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .hero-gradient-overlay {
    /* Top: dark, middle: transparent, bottom: dark */
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.6) 0%,
      rgba(0,0,0,0.0) 35%,
      rgba(0,0,0,0.0) 65%,
      rgba(0,0,0,0.5) 100%
    );
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    z-index: 10;
    pointer-events: none;
  }
`;
export default Netflix;