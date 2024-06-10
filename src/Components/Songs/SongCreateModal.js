import React, { useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Upload, Button } from "antd";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const SongCreateModal = ({
  artists,
  genres,
  visible,
  setIsModalOpen,
  getSongs,
}) => {
  const [form] = Form.useForm();
  const [albumOption, setAlbumOption] = useState(null);

  const [albums, setAlbums] = useState([]);
  const [artistId, setArtistId] = useState(null);

  const getAlbums = async (value) => {
    const requestOptions = {
      method: "GET",
    };

    return await fetch("/api/Album/Artist/" + value, requestOptions)
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
    getAlbums(artistId);
  }, [setAlbums]);

  const onSubmit = async (values) => {
    form.submit();

    console.log(values);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title,
        publishDate: values.publishDate,
        description: values.description,
        cover: values.cover,
        lyrics: values.lyrics,
        genreId: values.genre,
        fingerprint: values.audio,
        artistId: values.artist,
        albumId: values.album,
        genreName: "",
        fingerprintFilePath: "",
        artistName: "",
        albumName: "",
      }),
    };
    console.log(requestOptions.body);

    form.resetFields();
    setAlbumOption(false);

    return await fetch("/api/Track/Create", requestOptions)
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
      .then(() => getSongs());
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      setIsModalOpen(false);
    });
  };

  const onCancel = () => {
    form.resetFields();
    setAlbumOption(false);
    setIsModalOpen(false);
  };

  const onArtistChange = (value) => {
    setArtistId(value);
    getAlbums(value).then(() => setAlbumOption(true));
  };

  const props = {
    name: "audio",
    onChange(info) {
      if (info.file.status !== "uploading" && info.fileList[0]) {
        let reader = new FileReader();
        reader.readAsDataURL(info.file);
        reader.onload = () => {
          let si = reader.result.indexOf("4,");
          form.setFieldValue("audio", reader.result.slice(si + 2));
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
    maxCount: 1,
  };

  const propsImage = {
    name: "cover",
    onChange(info) {
      if (info.file.status !== "uploading" && info.fileList[0]) {
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
    maxCount: 1,
  };

  return (
    <Modal
      open={visible}
      className="songCreateModal"
      destroyOnClose={true}
      okText="Add song"
      cancelText="Cancel"
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form preserve={false} className="songCreationForm" form={form}>
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Please input song title!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Publish date"
          name="publishDate"
          rules={[
            {
              required: true,
              message: "Please input publish date!",
            },
          ]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea />
        </Form.Item>

        <Form.Item label="Lyrics" name="lyrics">
          <TextArea />
        </Form.Item>

        <Form.Item label="Cover" name="cover">
          <Upload accept=".png, .jpeg, .jpg" {...propsImage}>
            <Button>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Audio" name="audio">
          <Upload accept=".m4a, .mp3, .wav" {...props}>
            <Button>Click to Upload Audio</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Genre"
          name="genre"
          rules={[
            {
              required: true,
              message: "Please select artist!",
            },
          ]}
        >
          <Select
            rules={[{ required: true, message: "Please select an option!" }]}
          >
            {genres.map(({ id, name }) => {
              return (
                <Option key={id} value={id}>
                  {name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="Artist"
          name="artist"
          rules={[
            {
              required: true,
              message: "Please select artist!",
            },
          ]}
        >
          <Select
            rules={[{ required: true, message: "Please select an option!" }]}
            onChange={onArtistChange}
          >
            {artists.map(({ id, name }) => {
              return (
                <Option key={id} value={id}>
                  {name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        {albumOption ? (
          <Form.Item label="Album" name="album">
            <Select>
              {albums.map(({ id, name }) => {
                return (
                  <Option key={id} value={id}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        ) : (
          ""
        )}
      </Form>
    </Modal>
  );
};

export default SongCreateModal;
