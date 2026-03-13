import React from "react";
import styled from "styled-components";
import YouTube from "react-youtube";
import { useSelector, useDispatch } from "react-redux";
import { closeTrailer } from "../store";
import { IoClose } from "react-icons/io5";

export default function TrailerModal() {
  const dispatch = useDispatch();
  const trailerKey = useSelector((state) => state.netflix.trailerKey);
  const trailerSearchQuery = useSelector((state) => state.netflix.trailerSearchQuery);
  const trailerLoading = useSelector((state) => state.netflix.trailerLoading);
  const trailerNotFound = useSelector((state) => state.netflix.trailerNotFound);

  if (!trailerKey && !trailerSearchQuery && !trailerLoading && !trailerNotFound) return null;

  const youtubeSearchUrl = trailerSearchQuery
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(trailerSearchQuery)}`
    : null;

  return (
    <Overlay onClick={() => dispatch(closeTrailer())}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => dispatch(closeTrailer())}>
          <IoClose />
        </button>
        {trailerLoading ? (
          <div className="loading">Loading trailer...</div>
        ) : trailerKey ? (
          <YouTube
            videoId={trailerKey}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: { autoplay: 1, modestbranding: 1, rel: 0 },
            }}
            className="youtube-player"
          />
        ) : trailerSearchQuery ? (
          <div className="search-fallback">
            <p>No trailer found on TMDB. Search YouTube instead:</p>
            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="yt-link"
            >
              🎬 Watch "{trailerSearchQuery}" on YouTube
            </a>
          </div>
        ) : (
          <div className="loading">Video not available</div>
        )}
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  position: relative;
  width: 90%;
  max-width: 900px;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;

  .close-btn {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 10;
    background: rgba(0, 0, 0, 0.6);
    border: none;
    color: #fff;
    font-size: 1.5rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .youtube-player {
    width: 100%;
    height: 100%;

    iframe {
      width: 100%;
      height: 100%;
    }
  }

  .loading {
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 1.2rem;
  }

  .search-fallback {
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 1.5rem;
    padding: 2rem;
    text-align: center;

    p {
      font-size: 1.1rem;
      opacity: 0.8;
    }

    .yt-link {
      color: #fff;
      background: #e50914;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-size: 1rem;
      font-weight: 600;
      transition: background 0.2s;

      &:hover {
        background: #f40612;
      }
    }
  }
`;
