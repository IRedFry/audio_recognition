import React, { useState, useEffect } from "react";
import { SearchBar } from "../LandingPage/LandingPage";
import { Link } from "react-router-dom";
import { Button } from "antd";
import plusIcon from "../../Images/Icons/plus-icon-23574.png";
import SongCreateModal from "./SongCreateModal";

const Songs = ({ songs, setSongs, artists, genres, user }) => {
  const [matchedSongs, setMatchedSongs] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSearchSubmit = () => {
    const inputElement = document.getElementById("searchBar");
    if (inputElement.value === "") {
      setHasSearched(false);
      return;
    }
    const getMatchedSongs = async () => {
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
    getMatchedSongs();

    setHasSearched(true);
  };

  const getSongs = async () => {
    const requestOptions = {
      method: "GET",
    };
    return await fetch("/api/Track/", requestOptions)
      .then((response) => response.json())
      .then(
        (data) => {
          setSongs(data);
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  useEffect(() => {
    getSongs();
  }, [setSongs]);

  const onClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="songPage">
        <div className="searchPlusButton">
          <SearchBar
            placeholderText="Search by song names"
            onSearchSubmit={onSearchSubmit}
            hasSearched={hasSearched}
            setHasSearched={setHasSearched}
          />
          {user.isAuthenticated ? (
            <Button className="createButton" onClick={onClick}>
              <img src={plusIcon}></img>
            </Button>
          ) : (
            ""
          )}
        </div>
        <div className="songList">
          {hasSearched
            ? matchedSongs.map(({ id, title, cover, artistName }) => {
                return (
                  <Link to={"/Track/" + id} className="songItem">
                    <div className="songItem" key={id}>
                      <img
                        className="songCover"
                        src={"data:image/png;base64, " + cover}
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
            : songs.map(({ id, title, cover, artistName }) => {
                return (
                  <Link to={"/Track/" + id} className="songItem">
                    <div className="songItem" key={id}>
                      <img
                        className="songCover"
                        src={"data:image/png;base64, " + cover}
                        alt=""
                      />
                      <div className="songInfo">
                        <div className="songTitle">{title}</div>
                        <div className="songArtist">{artistName}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
      <SongCreateModal
        visible={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        artists={artists}
        genres={genres}
        getSongs={getSongs}
      />
    </>
  );
};

export default Songs;
