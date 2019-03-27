import PropTypes from "prop-types";
import {

 
  Button,
  InputGroup,
  InputGroupAddon,
  
  FormCheckbox
  
} from "shards-react";
import React from "react";
import ReactQuill from "react-quill";
import { Card, CardBody, Form, FormInput } from "shards-react";

import "react-quill/dist/quill.snow.css";
import "../../assets/quill.css";

const Editor = () => (
  <Card small className="mb-3">
    <CardBody>
      <Form className="add-new-post">
        <FormInput size="lg"  className="mb-3" placeholder="Your Idea Title" />
        <ReactQuill placeholder="Describe your idea here. The funding recieved will depend heavily on how well the idea is described here." className="add-new-post__editor mb-1" />
        <br></br><p>Upload images to pitch your idea</p>
        <FormInput type="file" id="image" placeholder=""></FormInput><br></br>
          <FormCheckbox className="mb-1" value="Business" >
            Business
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Textile and Garments" >
            Textile and Garments
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Tourism" >
            Tourism
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Other sectors" >
            Other sectors
          </FormCheckbox>

          <br></br><br></br>
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
