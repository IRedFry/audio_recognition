import React, { useState } from "react";
import searchIcon from "../../Images/Icons/search-icon-2048x2048-cmujl7en.png";
import closeIcon from "../../Images/Icons/icon-close-512.webp";
import logo from "../../Images/Logos/logo3.png";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [matchedSongs, setMatchedSongs] = useState([]);
  const [matchedArtists, setMatchedArtists] = useState([]);
  const [matchedAlbums, setMatchedAlbums] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const onSearchSubmit = () => {
    const inputElement = document.getElementById("searchBar");
    if (inputElement.value == "") {
      setHasSearched(false);
      return;
    }

    const getSongs = async () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputElement.value),
      };

      console.log(requestOptions);
      return await fetch("/api/Track/", requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            setMatchedSongs(data);
            console.log(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getSongs();

    const getMatchedArtists = async () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputElement.value),
      };

      console.log(requestOptions);
      return await fetch("/api/Artist/", requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            setMatchedArtists(data);
            console.log(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getMatchedArtists();

    const getMatchedAlbums = async () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputElement.value),
      };

      console.log(requestOptions);
      return await fetch("/api/Album/", requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            setMatchedAlbums(data);
            console.log(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getMatchedAlbums();

    setHasSearched(true);
  };

  return (
    <>
      <div className="landingMain">
        <SearchBar
          placeholderText="Search by artist, song name or album"
          onSearchSubmit={onSearchSubmit}
          hasSearched={hasSearched}
          setHasSearched={setHasSearched}
        />
        {hasSearched ? (
          <div class="searchBlock">
            <h1 className="searchTitle">Songs</h1>
            <div class="songList">
              {matchedSongs.length > 0 ? (
                matchedSongs.map(({ id, title, cover, artistName }) => {
                  return (
                    <Link to={"/Track/" + id}>
                      <div className="songItem" key={id}>
                        <img
                          className="songCover"
                          src={"data:image/png;base64," + cover}
                          alt=""
                        />
                        <div className="songInfo">
                          <div className="songTitle">{title}</div>
                          <div className="songArtist">{artistName}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <h1>Nothing :(</h1>
              )}
            </div>

            <h1 className="searchTitle">Artists</h1>
            <div class="songList">
              {matchedArtists.length > 0 ? (
                matchedArtists.map(({ id, name, imagePath }) => {
                  return (
                    <Link to={"/Artist/" + id}>
                      <div className="artistItem" key={id}>
                        <img className="artistCover" src={imagePath} alt="" />
                        <div className="artistInfo">
                          <div className="artistName">{name}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <h1>Nothing :(</h1>
              )}
            </div>

            <h1 className="searchTitle">Albums</h1>
            <div class="songList">
              {matchedAlbums.length > 0 ? (
                matchedAlbums.map(({ id, name, imagePath, artistName }) => {
                  return (
                    <Link to={"/Album/" + id}>
                      <div className="albumItem" key={id}>
                        <img className="albumCover" src={imagePath} alt="" />
                        <div className="albumInfo">
                          <div className="albumName">{name}</div>
                          <div className="songArtist">{artistName}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <h1>Nothing :(</h1>
              )}
            </div>
          </div>
        ) : (
          <div className="bigLogo">
            <img src={logo}></img>
            <h1 className="brandName">BOLT</h1>
            <div className="brandTitle">Fastest Music Search</div>
          </div>
        )}
      </div>
    </>
  );
};

const SearchBar = ({ placeholderText, onSearchSubmit, hasSearched }) => {
  const clearInput = () => {
    let inputElement = document.getElementById("searchBar");
    inputElement.value = "";
    onSearchSubmit();
  };

  return (
    <>
      <div className="searchBarWrapper">
        <input
          type="text"
          id="searchBar"
          placeholder={placeholderText}
          className="searchBar"
          onChange={onSearchSubmit}
        />
        {hasSearched ? (
          <button className="searchButton" onClick={clearInput}>
            <img src={closeIcon} className="searchButtonLogo" />
          </button>
        ) : (
          <button className="searchButton" onClick={onSearchSubmit}>
            <img src={searchIcon} className="searchButtonLogo" />
          </button>
        )}
      </div>
    </>
  );
};

export { LandingPage, SearchBar };
