import React, { useState, useEffect } from "react";
import { SearchBar } from "../LandingPage/LandingPage";
import { Link } from "react-router-dom";
import { Button } from "antd";
import plusIcon from "../../Images/Icons/plus-icon-23574.png";
import ArtistCreateModal from "./ArtistCreateModal";

const Artists = ({ artists, setArtists, user }) => {
  const [matchedArtists, setMatchedArtists] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getArtists = async () => {
    const requestOptions = {
      method: "GET",
    };
    return await fetch("/api/Artist/", requestOptions)
      .then((response) => response.json())
      .then(
        (data) => {
          setArtists(data);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  useEffect(() => {
    getArtists();
  }, [artists]);

  const onSearchSubmit = () => {
    const inputElement = document.getElementById("searchBar");
    if (inputElement.value === "") {
      setHasSearched(false);
      return;
    }
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

    setHasSearched(true);
  };

  const onClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="artistPage">
        <div className="searchPlusButton">
          <SearchBar
            placeholderText="Search by artist"
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
        <div className="artistList">
          {hasSearched
            ? matchedArtists.map(({ id, name, cover }) => {
                return (
                  <Link className="artistItem" to={"/Artist/" + id}>
                    <div className="artistItem" key={id}>
                      <img
                        className="artistCover"
                        src={"data:image/png;base64, " + cover}
                        alt=""
                      />
                      <div className="artistInfo">
                        <div className="artistName">{name}</div>
                      </div>
                    </div>
                  </Link>
                );
              })
            : artists.map(({ id, name, cover }) => {
                return (
                  <Link className="artistItem" to={"/Artist/" + id}>
                    <div className="artistItem" key={id}>
                      <img
                        className="artistCover"
                        src={"data:image/png;base64, " + cover}
                        alt=""
                      />
                      <div className="artistInfo">
                        <div className="artistName">{name}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
      <ArtistCreateModal
        visible={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        getArtists={getArtists}
      />
    </>
  );
};

export default Artists;
