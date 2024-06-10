import React from "react";
import { Modal, Form, Input, DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";

const ArtistCreateModal = ({ visible, setIsModalOpen, getArtists }) => {
  const [form] = Form.useForm();

  const onSubmit = async (values) => {
    form.submit();

    console.log(values);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        startDate: values.startDate,
        description: values.description,
      }),
    };
    console.log(requestOptions.body);

    form.resetFields();

    return await fetch(
      "/api/Artist/Create",
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
      )
      .then(() => getArtists());
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
      okText="Add artist"
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
          label="Start date"
          name="startDate"
          rules={[
            {
              required: true,
              message: "Please input start date!",
            },
          ]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ArtistCreateModal;
