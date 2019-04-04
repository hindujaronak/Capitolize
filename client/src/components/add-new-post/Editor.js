import React, {Component} from "react";
import {addNewPost} from './add-new-post_helper.js';

import PropTypes from "prop-types";
import {
  Button,
  InputGroup,
  InputGroupAddon,
  Row,
  Col,
  FormCheckbox
  
} from "shards-react";
import ReactQuill from "react-quill";
import { Card, CardBody, Form, FormInput } from "shards-react";

import "react-quill/dist/quill.snow.css";
import "../../assets/quill.css";
import {Redirect} from 'react-router-dom';
import axios from 'axios';


class Editor extends Component{
  constructor(){
    super();
    this.state = {
      title: '',
      description: '',
      image: '',
      error: '',
      saveData: false
    }
  }

  clickSubmit= () => {
    const data = {
      titleOfFundraiser: this.state.title || undefined,
      description: this.state.description || undefined,
      image: this.state.image || undefined
    }


    addNewPost(data).then((data) => {
      this.setState({ error: false });
      // console.log(data)
      const { titleOfFundraiser, description, image} = this.state;
      // const email = this.state;  
      // if (!(email === 'anuja@gmail.com')) {
      axios
        .post('http://localhost:5000/api/user/login', {
          account_type: this.state.account_type
      });

    //   if (!(email === email && password === password)) {
    //     return this.setState({ error: true });
    //   }
    //   else{
    //     this.setState({redirectToDashboard: true});
    //   } 
    //   // history.push('/blog-overview');
    });
  }
  render(){
    if (this.state.saveData === true) {
      return <Redirect to='/blog-overview' />
    }
    return(
      <Card small className="mb-3">
        <CardBody>
          <Form className="add-new-post">
            <FormInput size="lg"  className="mb-3" placeholder="Your Idea Title" />
            <ReactQuill placeholder="Describe your idea here. The funding recieved will depend heavily on how well the idea is described here." className="add-new-post__editor mb-1" />
            <br></br>
            <p>Upload images to pitch your idea</p>
            <FormInput type="file" id="image" placeholder=""></FormInput>
            <br></br>
            <p>Select sector</p>
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

              <br></br>
              <Row>
                <Col md="4"><FormInput size="lg" placeholder="Enter the amount to be raised in Rupees" /></Col>
                <Col md="6"></Col>
              </Row>
              <br></br>
              <br></br>
                  <div
            className="bg-primary text-white text-center rounded p-3 "
            style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
              Start your Fundraising Journey!
            </div>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

export default Editor;
