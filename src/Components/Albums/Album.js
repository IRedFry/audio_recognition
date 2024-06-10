import React, { useState, useEffect } from "react";
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
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import saveIcon from "../../Images/Icons/saveIcon.webp";
import deleteIcon from "../../Images/Icons/icon-close-512.webp";
import dayjs from "dayjs";

const { Option } = Select;

const Album = ({ artists, user }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [modalOpen, setModelOpen] = useState(false);

  const [songs, setSongs] = useState([]);
  const [album, setAlbum] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const getSongs = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch(`/api/Track/Album/${id}`, requestOptions)
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

  const getAlbum = async () => {
    const requestOptions = {
      method: "GET",
    };
    return await fetch(`/api/Album/${id}`, requestOptions)
      .then((response) => response.json())
      .then(
        (data) => {
          setAlbum(data);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  useEffect(() => {
    getAlbum();
    console.log(album);
  }, [setAlbum]);

  const onEditSwitchChanged = (value) => {
    setEditMode(value);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  const onSubmit = async (values) => {
    form.submit();

    console.log(values);

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: album.id,
        name: values.name,
        cover: values.cover ? values.cover : album.cover,
        artistId: values.artistId,
        artistName: "",
      }),
    };
    console.log(requestOptions.body);

    form.resetFields();
    setEditMode(false);
    return await fetch("https://localhost:7001/api/Album", requestOptions)
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
        getAlbum();
      });
  };

  const handleDelete = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    setModelOpen(false);

    return await fetch(`/api/Album/${id}`, requestOptions).then(() => {
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
          name: album.name,
          artistId: album.artistId,
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
                src={"data:image/png;base64, " + album.cover}
                alt=""
              />
            )}
            <div className="singleSongInfo">
              {editMode ? (
                <Form.Item name="name" className="onPageTitleEdit">
                  <Input />
                </Form.Item>
              ) : (
                <h1 className="sigleSongTitle singleAlbumTitle">
                  {album.name}
                </h1>
              )}
              {editMode ? (
                <Form.Item name="artistId" className="onPageArtistEdit">
                  <Select>
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
                <h2 className="sigleSongArtist">{album.artistName}</h2>
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
        </div>
      </Form>
      <Modal
        className="songCreationForm"
        title="Delete album?"
        open={modalOpen}
        onOk={handleDelete}
        onCancel={handleCancel}
      >
        <p className="">Are you sure you want to delete this album?</p>
      </Modal>
    </>
  );
};

export default Album;
