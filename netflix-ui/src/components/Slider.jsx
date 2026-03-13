import React from "react";
import styled from "styled-components";
import CardSlider from "./CardSlider";
export default function Slider({ movies, categories = {} }) {
  const getMoviesFromRange = (from, to) => {
    return movies.slice(from, to);
  };
  const rows = [
    { title: "Trending Now", data: getMoviesFromRange(0, 10) },
    { title: "New Releases", data: getMoviesFromRange(10, 20) },
    { title: "Blockbuster Movies", data: getMoviesFromRange(20, 30) },
    { title: "Popular on Netflix", data: getMoviesFromRange(30, 40) },
    { title: "Action Movies", data: getMoviesFromRange(40, 50) },
    { title: "Epics", data: getMoviesFromRange(50, 60) },
  ];
  return (
    <Container>
      {rows.map(
        (row) =>
          row.data && row.data.length > 0 ? (
            <CardSlider key={row.title} data={row.data} title={row.title} />
          ) : null
      )}
      {Object.entries(categories).map(([name, data]) =>
        data.length > 0 ? (
          <CardSlider key={name} data={data} title={name} />
        ) : null
      )}
    </Container>
  );
}

const Container = styled.div``;