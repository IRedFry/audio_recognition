import {
  Switch,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Modal,
  Upload,
} from "antd";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import saveIcon from "../../Images/Icons/saveIcon.webp";
import deleteIcon from "../../Images/Icons/icon-close-512.webp";
import dayjs from "dayjs";

const { Option } = Select;

const Song = ({ artists, genres, albums, user }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [modalOpen, setModelOpen] = useState(false);

  const [artistId, setArtistId] = useState(null);
  const [albumId, setAlbumId] = useState(null);
  const [song, setSong] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    form.setFieldValue("albumId", albumId);
  }, [artistId]);

  useEffect(() => {
    form.setFieldValue("albumId", albumId);
  }, [albumId]);

  const getSong = async () => {
    const requestOptions = {
      method: "GET",
    };
    return await fetch(`/api/Track/${id}`, requestOptions)
      .then((response) => response.json())
      .then(
        (data) => {
          setSong(data);
          return data;
        },
        (error) => {
          console.log(error);
        }
      )
      .then((data) => {
        onArtistChange(data.artistId);
        setAlbumId(data.albumId);
        startAlbumId(data.albumId);
      });
  };

  useEffect(() => {
    getSong();
  }, [setSong]);

  const onEditSwitchChanged = (value) => {
    setEditMode(value);
    setArtistId(song.artistId);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  const onSubmit = async (values) => {
    form.submit();

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: song.id,
        title: values.title,
        publishDate: dayjs(values.publishDate).add(1, "day"),
        description: song.description,
        lyrics: song.lyrics,
        genreId: values.genreId,
        artistId: values.artistId,
        albumId: values.albumId,
        fingerprint: song.fingerprint,
        cover: values.cover ? values.cover : song.cover,
        genreName: "",
        fingerprintFilePath: "",
        artistName: "",
        albumName: "",
      }),
    };

    form.resetFields();
    setEditMode(false);
    return await fetch("/api/Track", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then(
        (data) => {},
        (error) => {
          console.log(error);
        }
      )
      .then(() => {
        getSong();
      });
  };

  const handleDelete = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    setModelOpen(false);

    return await fetch(`/api/Track/${id}`, requestOptions).then(() => {
      window.history.go(-1);
    });
  };

  const handleCancel = () => {
    setModelOpen(false);
  };
  const onArtistChange = (value) => {
    setArtistId(value);
    if (value == song.artistId) setAlbumId(song.albumId);
    else setAlbumId(-1);
  };

  const startAlbumId = (value) => {
    if (value == null) setAlbumId(-1);
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
          title: song.title,
          artistId: artistId,
          genreId: song.genreId,
          albumId: albumId,
          publishDate: dayjs(song.publishDate),
          // cover: song.cover,
        }}
        onSubmit={onSubmit}
      >
        <div className="singleSongPage">
          <div className="singleSongUpper">
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
                className="singleSongCover"
                src={"data:image/png;base64, " + song.cover}
                alt=""
              />
            )}

            <div className="singleSongInfo">
              {editMode ? (
                <Form.Item name="title" className="onPageTitleEdit">
                  <Input />
                </Form.Item>
              ) : (
                <h1 className="sigleSongTitle">{song.title}</h1>
              )}
              {editMode ? (
                <Form.Item name="artistId" className="onPageArtistEdit">
                  <Select onChange={onArtistChange}>
                    {artists.map(({ id, name }) => {
                      return (
                        <Option key={id} value={id}>
                          {name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              ) : (
                <h2 className="sigleSongArtist">{song.artistName}</h2>
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
          <div className="singleSongLower">
            <div className="singleSongAlbumPart">
              <h1>Recommended Album</h1>
              {song.albumId != null ? (
                <>
                  <Link
                    to={"/Album/" + song.albumId}
                    className="albumFromSongLink"
                  >
                    <img
                      className="singleSongAlbumCover"
                      src={
                        "data:image/png;base64, " +
                        albums[song.albumId - 1].cover
                      }
                      alt=""
                    />
                    <h2 className="singleSongAlbum">{song.albumName}</h2>
                    <h1 className="singleSongAlbumDate">
                      {dayjs(song.albumDate).format("DD.MM.YYYY")}
                    </h1>
                  </Link>
                </>
              ) : (
                <h2 className="singleSongAlbum">It's a single</h2>
              )}
            </div>
            <div className="singleSongAbout">
              <div className="singleSongAboutLine">
                <div>Album</div>
                {editMode ? (
                  <Form.Item name="albumId" className="onPageGenreEdit">
                    <Select>
                      {albums
                        .filter((value) => value.artistId == artistId)
                        .map(({ id, name }) => {
                          return (
                            <Option key={id} value={id}>
                              {name}
                            </Option>
                          );
                        })}
                      <Option key={-1} value={-1}>
                        None
                      </Option>
                    </Select>
                  </Form.Item>
                ) : (
                  <div>{song.albumName}</div>
                )}
              </div>
              <div className="singleSongAboutLine">
                <div>Publish Date</div>
                {editMode ? (
                  <Form.Item name="publishDate" className="singleSongDateEdit">
                    <DatePicker />
                  </Form.Item>
                ) : (
                  <div>{dayjs(song.publishDate).format("DD.MM.YYYY")}</div>
                )}
              </div>
              <div className="singleSongAboutLine">
                <div>Genre</div>
                {editMode ? (
                  <Form.Item name="genreId" className="onPageGenreEdit">
                    <Select>
                      {genres.map(({ id, name }) => {
                        return (
                          <Option key={id} value={id}>
                            {name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                ) : (
                  <div>{song.genreName}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Form>
      <Modal
        className="songCreationForm"
        title="Delete song?"
        open={modalOpen}
        onOk={handleDelete}
        onCancel={handleCancel}
      >
        <p className="">Are you sure you want to delete this track?</p>
      </Modal>
    </>
  );
};

export default Song;
