import React, { useState, useEffect } from "react";
import "./App.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import { LandingPage } from "./Components/LandingPage/LandingPage";
import Songs from "./Components/Songs/Songs";
import Artists from "./Components/Artists/Artists";
import Albums from "./Components/Albums/Albums";
import Song from "./Components/Songs/Song";
import Artist from "./Components/Artists/Artist";
import Album from "./Components/Albums/Album";
import Login from "./Components/Login/Login";

function App() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [genres, setGenres] = useState([]);

  const [user, setUser] = useState({
    isAuthenticated: false,
    userName: "",
    userRole: "",
  });

  useEffect(() => {
    const getGenres = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("/api/Track/Genre", requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            setGenres(data);
            console.log(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getGenres();
  }, [setGenres]);

  useEffect(() => {
    const getUser = async () => {
      return await fetch("/api/Account/IsAuthenticated")
        .then((response) => {
          response.status === 401 &&
            setUser({ isAuthenticated: false, userName: "" });
          return response.json();
        })
        .then(
          (data) => {
            console.log("data = ");
            console.log(data);
            if (
              typeof data != "undefined" &&
              typeof data.userName != "undefined"
            ) {
              setUser({
                isAuthenticated: true,
                userName: data.userName,
                userRole: data.userRole,
              });
            }
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getUser();
  }, [setUser]);

  useEffect(() => {
    const getArtists = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("/api/Artist/", requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            setArtists(data);
            console.log(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getArtists();
  }, [setArtists]);

  const getAlbums = async () => {
    const requestOptions = {
      method: "GET",
    };

    return await fetch("/api/Album/", requestOptions)
      .then((response) => response.json())
      .then(
        (data) => {
          setAlbums(data);
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  useEffect(() => {
    getAlbums();
  }, [setAlbums]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user}></Layout>}>
          <Route
            index
            element={
              <div>
                <LandingPage />
              </div>
            }
          />
          <Route
            path="/Songs"
            element={
              <Songs
                songs={songs}
                setSongs={setSongs}
                artists={artists}
                genres={genres}
                user={user}
              />
            }
          />

          <Route
            path="/Artists"
            element={
              <Artists artists={artists} setArtists={setArtists} user={user} />
            }
          />

          <Route
            path="/Albums"
            element={
              <Albums albums={albums} setAlbums={setAlbums} user={user} />
            }
          />

          <Route
            path="/Track/:id"
            element={
              <Song
                artists={artists}
                genres={genres}
                albums={albums}
                user={user}
              ></Song>
            }
          />
          <Route path="/Artist/:id" element={<Artist user={user}></Artist>} />
          <Route
            path="/Album/:id"
            element={<Album artists={artists} user={user}></Album>}
          />

          <Route
            path="/Login"
            element={<Login user={user} setUser={setUser} />}
          />

          <Route path="*" element={<h3>404</h3>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
