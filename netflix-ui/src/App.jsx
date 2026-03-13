import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import MoviePage from "./pages/Movies";
import Netflix from "./pages/Netflix";
import Player from "./pages/Player";
import Signup from "./pages/Signup";
import TVShows from "./pages/TVShows";
import UserListedMovies from "./pages/UserListedMovies";
import TrailerModal from "./components/TrailerModal";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <TrailerModal />
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/player" element={<ProtectedRoute><Player /></ProtectedRoute>} />
        <Route exact path="/tv" element={<ProtectedRoute><TVShows /></ProtectedRoute>} />
        <Route exact path="/movies" element={<ProtectedRoute><MoviePage /></ProtectedRoute>} />
        <Route exact path="/new" element={<ProtectedRoute><Player /></ProtectedRoute>} />
        <Route exact path="/mylist" element={<ProtectedRoute><UserListedMovies /></ProtectedRoute>} />
        <Route exact path="/" element={<ProtectedRoute><Netflix /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
} 
