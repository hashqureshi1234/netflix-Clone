import { signOut } from "firebase/auth";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { firebaseAuth } from "../utils/firebase-config";
import { FaPowerOff, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { searchMovies, clearSearch, fetchTrailer, closeTrailer } from "../store";

export default function Navbar({ isScrolled }) {
  const [showSearch, setShowSearch] = useState(false);
  const [inputHover, setInputHover] = useState(false);
  const [query, setQuery] = useState("");
  const debounceRef = useRef(null);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchResults = useSelector((state) => state.netflix.searchResults);
  const currentTrailerMovieId = useSelector((state) => state.netflix.currentTrailerMovieId);

  const links = [
    { name: "Home", link: "/" },
    { name: "TV Shows", link: "/tv" },
    { name: "Movies", link: "/movies" },
    { name: "My List", link: "/mylist" },
  ];

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!value.trim()) {
        dispatch(clearSearch());
        return;
      }
      debounceRef.current = setTimeout(() => {
        dispatch(searchMovies(value.trim()));
      }, 400);
    },
    [dispatch]
  );

  const handleResultClick = (item) => {
    if (currentTrailerMovieId === item.id) {
      dispatch(closeTrailer());
    } else {
      dispatch(fetchTrailer({ id: item.id, name: item.name }));
    }
    setQuery("");
    dispatch(clearSearch());
    setShowSearch(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        dispatch(clearSearch());
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <Container>
      <nav className={`${isScrolled ? "scrolled" : ""} flex`}>
        <div className="left flex a-center">
          <div className="brand flex a-center j-center">
            <img src={logo} alt="Logo" />
          </div>
          <ul className="links flex">
            {links.map(({ name, link }) => {
              return (
                <li key={name}>
                  <Link to={link}>{name}</Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="right flex a-center">
          <div
            className={`search ${showSearch ? "show-search" : ""}`}
            ref={dropdownRef}
          >
            <button
              onFocus={() => setShowSearch(true)}
              onBlur={() => {
                if (!inputHover) {
                  setShowSearch(false);
                }
              }}
            >
              <FaSearch />
            </button>
            <input
              type="text"
              placeholder="Titles, people, genres"
              value={query}
              onChange={handleSearchChange}
              onMouseEnter={() => setInputHover(true)}
              onMouseLeave={() => setInputHover(false)}
              onBlur={() => {
                if (!inputHover) {
                  setShowSearch(false);
                }
              }}
            />
            {searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="search-item"
                    onMouseDown={() => handleResultClick(item)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w200${item.image}`}
                      alt={item.name}
                    />
                    <div className="search-item-info">
                      <span className="search-item-name">{item.name}</span>
                      <span className="search-item-type">
                        {item.type === "movie" ? "Movie" : "TV Show"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => signOut(firebaseAuth)}>
            <FaPowerOff />
          </button>
        </div>
      </nav>
    </Container>
  );
}

const Container = styled.div`
  .scrolled {
    background-color: rgba(0, 0, 0, 0.95) !important;
    backdrop-filter: none !important;
  }
  nav {
    position: fixed;
    top: 0;
    height: 6.5rem;
    width: 100%;
    justify-content: space-between;
    z-index: 2;
    padding: 0 4rem;
    align-items: center;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.7) 0%,
      transparent 100%
    );
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: all 0.4s ease;
    .left {
      gap: 2rem;
      .brand {
        img {
          height: 4rem;
        }
      }
      .links {
        list-style-type: none;
        gap: 2rem;
        li {
          a {
            color: #e5e5e5;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            transition: color 0.2s;
            &:hover {
              color: #fff;
            }
          }
        }
      }
    }
    .right {
      gap: 1rem;
      button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        &:focus {
          outline: none;
        }
        svg {
          color: #f34242;
          font-size: 1.2rem;
        }
      }
      .search {
        display: flex;
        gap: 0.4rem;
        align-items: center;
        justify-content: center;
        padding: 0.2rem;
        padding-left: 0.5rem;
        position: relative;
        button {
          background-color: transparent;
          border: none;
          &:focus {
            outline: none;
          }
          svg {
            color: white;
            font-size: 1.2rem;
          }
        }
        input {
          width: 0;
          opacity: 0;
          visibility: hidden;
          transition: 0.3s ease-in-out;
          background-color: transparent;
          border: none;
          color: white;
          &:focus {
            outline: none;
          }
        }
        .search-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          width: 350px;
          max-height: 420px;
          overflow-y: auto;
          background: rgba(20, 20, 20, 0.97);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);
          z-index: 100;
          .search-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            transition: background 0.2s;
            &:hover {
              background: rgba(255, 255, 255, 0.1);
            }
            img {
              width: 80px;
              height: 45px;
              object-fit: cover;
              border-radius: 3px;
              flex-shrink: 0;
            }
            .search-item-info {
              display: flex;
              flex-direction: column;
              gap: 0.15rem;
              overflow: hidden;
              .search-item-name {
                color: #fff;
                font-size: 0.85rem;
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .search-item-type {
                color: #999;
                font-size: 0.7rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
            }
          }
        }
      }
      .show-search {
        border: 1px solid white;
        background-color: rgba(0, 0, 0, 0.6);
        input {
          width: 200px;
          opacity: 1;
          visibility: visible;
          padding: 0.3rem;
        }
      }
    }
  }
`;