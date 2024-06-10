import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Form, Input, Button, Switch, Modal, DatePicker, Upload } from "antd";
import saveIcon from "../../Images/Icons/saveIcon.webp";
import deleteIcon from "../../Images/Icons/icon-close-512.webp";
import dayjs from "dayjs";

const { TextArea } = Input;

const Artist = ({ user }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [modalOpen, setModelOpen] = useState(false);

  const [artist, setArtist] = useState({});
  const [songs, setSongs] = useState([]);
  const [lastReleast, setLastRelease] = useState({});
  const [albums, setAlbums] = useState([]);

  const [editMode, setEditMode] = useState(false);

  const getArtist = async () => {
    const requestOptions = {
      method: "GET",
    };
    return await fetch(`/api/Artist/${id}`, requestOptions)
      .then((response) => response.json())
      .then(
        (data) => {
          setArtist(data);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  useEffect(() => {
    getArtist();
  }, [setArtist]);

  useEffect(() => {
    const getSongs = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch(`/api/Track/Artist/${id}`, requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            setSongs(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getSongs();
    console.log(songs);
  }, [setSongs]);

  useEffect(() => {
    const getLastRelease = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch(`/api/Track/Artist/LastRelease/${id}`, requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            setLastRelease(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getLastRelease();
    console.log(songs);
  }, [setLastRelease]);

  useEffect(() => {
    const getAlbums = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch(`/api/Album/Artist/${id}`, requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            setAlbums(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getAlbums();
    console.log(albums);
  }, [setAlbums]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  const onEditSwitchChanged = (value) => {
    setEditMode(value);
    form.resetFields();
  };

  const onSubmit = async (values) => {
    form.submit();

    console.log(values);

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: artist.id,
        name: values.name,
        cover: values.cover ? values.cover : artist.cover,
        description: values.description,
        startDate: dayjs(values.startDate).add(1, "day"),
      }),
    };
    console.log(requestOptions.body);

    form.resetFields();

    return await fetch("/api/Artist", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then(
        (data) => {
          console.log("Data: ", data);
        },
        (error) => {
          console.log(error);
        }
      )
      .then(() => {
        getArtist();
        setEditMode(false);
      });
  };

  const handleDelete = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    setModelOpen(false);

    return await fetch(`/api/Artist/${id}`, requestOptions).then(() => {
      window.history.go(-1);
    });
  };

  const handleCancel = () => {
    setModelOpen(false);
  };

  const props = {
    name: "cover",
    onChange(info) {
      if (info.file.status !== "uploading") {
        let reader = new FileReader();
        reader.readAsDataURL(info.file);
        reader.onload = () => {
          let si = reader.result.indexOf("4,");
          form.setFieldValue("cover", reader.result.slice(si + 2));
        };
      }
      if (info.file.status === "done") {
        console.log("yeuy");
      } else if (info.file.status === "error") {
        console.log("no");
      }
    },
    beforeUpload: () => {
      return false;
    },
    listType: "picture",
    maxCount: 1,
  };

  return (
    <>
      <Form
        preserve={false}
        form={form}
        initialValues={{
          name: artist.name,
          description: artist.description,
          startDate: dayjs(artist.startDate),
        }}
        onSubmit={onSubmit}
      >
        <div className="singleSongPage">
          <div className="singleArtistUpper">
            {editMode ? (
              <>
                <Form.Item label="Cover" name="cover">
                  <Upload {...props}>
                    <Button>Click to Upload</Button>
                  </Upload>
                </Form.Item>
              </>
            ) : (
              <img
                className="singleArtistCover"
                src={"data:image/png;base64, " + artist.cover}
                alt=""
              />
            )}
            <div className="singleArtistInfo">
              {editMode ? (
                <Form.Item name="name" className="onPageTitleEdit">
                  <Input />
                </Form.Item>
              ) : (
                <h1 className="singleArtistTitle">{artist.name}</h1>
              )}
              {editMode ? (
                <Form.Item name="startDate" className=" artistPublisDate">
                  <DatePicker />
                </Form.Item>
              ) : (
                <h1 className="sigleSongArtist">
                  Since: {dayjs(artist.startDate).format("DD.MM.YYYY")}
                </h1>
              )}
            </div>
            <div className="adminEditPanel">
              {editMode ? (
                <div style={{ display: "flex" }}>
                  <Button className="saveButton" onClick={handleOk}>
                    <img src={saveIcon}></img>
                  </Button>

                  <Button
                    className="saveButton"
                    onClick={() => setModelOpen(true)}
                  >
                    <img src={deleteIcon}></img>
                  </Button>
                </div>
              ) : (
                ""
              )}
              {user.isAuthenticated ? (
                <Switch
                  className="editModeSwitch"
                  onChange={onEditSwitchChanged}
                  value={editMode}
                ></Switch>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="singleArtistBlock singleArtistDescription">
            {editMode ? (
              <Form.Item name="description" className="onPageDescriptionEdit">
                <TextArea />
              </Form.Item>
            ) : (
              artist.description
            )}
          </div>

          <div className="artistSongsWrapper">
            <div className="songLastRelease"> Songs</div>
            <div className="artistSongGradient"></div>
            <div className="singleArtistSongs">
              {songs.map(({ id, title, artistName, cover }) => {
                return (
                  <Link to={"/Track/" + id} className="artistSongItem">
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

          <div className="singleArtistBlock">
            <div className="songLastRelease">Last Release</div>
            <Link to={"/Track/" + lastReleast.id}>
              <div className="songItem ">
                <img
                  className="songCover songCoverBig"
                  src={"data:image/png;base64, " + lastReleast.cover}
                  alt=""
                />
                <div className="songInfo">
                  <div className="songTitle songTitleBig">
                    {lastReleast.title}
                  </div>
                  <div className="songPublishDate songPublishDateBig">
                    {dayjs(lastReleast.publishDate).format("DD.MM.YYYY")}
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="artistSongsWrapper">
            <div className="songLastRelease">Albums</div>
            <div className="artistSongGradient"></div>
            <div className="singleArtistSongs">
              {albums.map(({ id, name, publishDate, cover }) => {
                return (
                  <Link to={"/Album/" + id} className="artistSongItem">
                    <div className="songItem" key={name}>
                      <img
                        className="songCover"
                        src={"data:image/png;base64, " + cover}
                        alt=""
                      />
                      <div className="songInfo">
                        <div className="songTitle">{name}</div>
                        <div className="songArtist">
                          {dayjs(publishDate).format("DD.MM.YYYY")}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </Form>
      <Modal
        className="songCreationForm"
        title="Delete artist?"
        open={modalOpen}
        onOk={handleDelete}
        onCancel={handleCancel}
      >
        <p className="">Are you sure you want to delete this artist?</p>
      </Modal>
    </>
  );
};

export default Artist;
