import React, { useState, useEffect } from "react";
import { SearchBar } from "../LandingPage/LandingPage";
import { Link } from "react-router-dom";
import { Button } from "antd";
import plusIcon from "../../Images/Icons/plus-icon-23574.png";
import AlbumCreateModal from "./AlbumCreateModal";

const Albums = ({ albums, setAlbums, user }) => {
  const [matchedAlbums, setMatchedAlbums] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [artists, setArtists] = useState([]);

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

  const onSearchSubmit = () => {
    const inputElement = document.getElementById("searchBar");
    if (inputElement.value === "") {
      setHasSearched(false);
      return;
    }
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

  useEffect(() => {
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
    getAlbums();
  }, [setAlbums]);

  const onClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="albumPage">
        <div className="searchPlusButton">
          <SearchBar
            placeholderText="Search by album names"
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
        <div className="albumList">
          {hasSearched
            ? matchedAlbums.map(({ id, name, cover, artistName }) => {
                return (
                  <Link to={"/Album/" + id} className="albumItem">
                    <div className="albumItem" key={id}>
                      <img
                        className="albumCover"
                        src={"data:image/png;base64, " + cover}
                        alt=""
                      />
                      <div className="albumInfo">
                        <div className="albumName">{name}</div>
                        <div className="albumArtist">{artistName}</div>
                      </div>
                    </div>
                  </Link>
                );
              })
            : albums.map(({ id, name, cover, artistName }) => {
                return (
                  <Link to={"/Album/" + id} className="albumItem">
                    <div className="albumItem" key={id}>
                      <img
                        className="albumCover"
                        src={"data:image/png;base64, " + cover}
                        alt=""
                      />
                      <div className="albumInfo">
                        <div className="albumName">{name}</div>
                        <div className="albumArtist">{artistName}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
      <AlbumCreateModal
        visible={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        artists={artists}
        getAlbums={getAlbums}
      />
    </>
  );
};

export default Albums;
