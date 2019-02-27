import React from "react";
import ReactQuill from "react-quill";
import { Card, CardBody, Form, FormInput } from "shards-react";

import "react-quill/dist/quill.snow.css";
import "../../assets/quill.css";

const Editor = () => (
  <Card small className="mb-3">
    <CardBody>
      <Form className="add-new-post">
        <FormInput size="lg" className="mb-3" placeholder="Your Idea Title" />
        <ReactQuill placeholder="Describe your idea here. The funding recieved will depend heavily on how well the idea is described here." className="add-new-post__editor mb-1" />
        <br></br><p>Upload images and videos to pitch your idea</p>
        <FormInput type="file" placeholder=""></FormInput><br></br>
        <div
        className="bg-primary text-white text-center rounded p-3 "
        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
          Post Your Idea!
        </div>
      </Form>
    </CardBody>
  </Card>
);

export default Editor;
