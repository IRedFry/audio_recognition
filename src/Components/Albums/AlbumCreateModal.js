import React from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";

const { Option } = Select;

const AlbumCreateModal = ({ artists, visible, setIsModalOpen, getAlbums }) => {
  const [form] = Form.useForm();

  const onSubmit = async (values) => {
    form.submit();

    console.log(values);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        publishDate: values.publishDate,
        artistId: values.artist,
        artistName: "",
      }),
    };
    console.log(requestOptions.body);

    form.resetFields();

    return await fetch(
      "/api/Album/Create",
      requestOptions
    )
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
      ).then(() => getAlbums());
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      setIsModalOpen(false);
    });
  };

  const onCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  return (
    <Modal
      open={visible}
      className="songCreateModal"
      destroyOnClose={true}
      okText="Add album"
      cancelText="Cancel"
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form preserve={false} className="songCreationForm" form={form}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input artist name!",
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
      </Form>
    </Modal>
  );
};

export default AlbumCreateModal;
