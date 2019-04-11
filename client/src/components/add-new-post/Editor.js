import React, {Component} from "react";
import {addNewPost} from './add-new-post_helper.js';

import PropTypes from "prop-types";
import {
  Row,
  Col,
  FormCheckbox
} from "shards-react";
import ReactQuill from "react-quill";
import { Card, CardBody, Form, FormInput } from "shards-react";

import "react-quill/dist/quill.snow.css";
import "../../assets/quill.css";
import {Redirect} from 'react-router-dom';
import{
  getFromStorage,
  setInStorage
} from "../../utils/storage.js";
import axios from 'axios';


class Editor extends Component{
  constructor(){
    super();
    this.state = {
      title: '',
      description: '',
      sector: '',
      amount: '',
      error: '',
      saveData: false,
      isLoading: true,
      isSubmitted: false,
    }
    
  }

  componentDidMount(){
    const obj = getFromStorage('mainapp');
    
    if(obj && obj.token){
      const { token } = obj;
      fetch('api/user/verify?token=' + token)
        .then(res => res.text())
        .then(json => {
          // console.log(json)
          if(json.success){ 
            this.setState({
              token,
              isLoading:false,
              isSubmitted:false
            });
            
            console.log(json);
          }
          else{
            this.setState({
              isLoading: false,
              isSubmitted:false
            });
          }
        }
      );
    }
    else{
      this.setState({
        isLoading: false,
        isSubmitted:false
      });
    }
  }

  onSubmit(){
    const {
      title,
      description,
      sector,
      amount,
      isSubmitted
    } = this.state;

    console.log("Function started");

    fetch('http://localhost:5000/api/fundraiser/addFundraiser', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(
        {
          title: title,
          description: description,
          sector: sector,
          amount: amount,
        }
      )
    }).then(json => {
      console.log('json', json);
      if(json){
        this.setState(
          {
            title: '',
            description: '',
            sector: '',
            amount: '',
            isSubmitted: true
          }
        );
      }
      else{
        this.setState({
          addError: "Bhavika is crazy",
          isLoading: false,
          isSubmitted: false
        });
      }
    })
  }

  handleChange = name => event => {
    this.setState({[name]: event.target.value})
  }

  render(){
    // if (this.state.saveData === true) {
    //   return <Redirect to='/blog-overview' />
    // }
    const{
      token,
    } = this.state;
    if(this.state.isSubmitted){
      return <Redirect to='/blog-overview' />
    }
    else{
    
      return(
        <Card small className="mb-3">
          <CardBody>
            <Form className="add-new-post">
              <FormInput size="lg"  
                className="mb-3" 
                placeholder="Your Idea Title" 
                name="title" 
                defaultValue={this.state.title} 
                onChange={this.handleChange('title')}/>
              <ReactQuill 
                placeholder="Describe your idea here. The funding recieved will depend heavily on how well the idea is described here." 
                className="add-new-post__editor mb-1" 
                name="description" defaultValue={this.state.description} />
              <br></br>
              <br></br>
              <p>Select sector</p>
                <FormCheckbox className="mb-1" name="sector" value={this.state.sector = 1} onChange={this.handleChange('sector')} >
                  Business
                </FormCheckbox>
                <FormCheckbox className="mb-1" name="sector" value={this.state.sector = 2} onChange={this.handleChange('sector')}>
                  Textile and Garments
                </FormCheckbox>
                <FormCheckbox className="mb-1" name="sector" value={this.state.sector = 3} onChange={this.handleChange('sector')} >
                  Tourism
                </FormCheckbox>
                <FormCheckbox className="mb-1" name="sector" value={this.state.sector = 4} onChange={this.handleChange('sector')} >
                  Other sectors
                </FormCheckbox>
  
                <br></br>
                
                <Row>
                  <Col md="2"><p>Amount of funds to be raised</p></Col>
                  <Col md="6"><FormInput 
                    size="lg" 
                    placeholder="Enter the amount to be raised in Rupees" 
                    name="amount" 
                    defaultValue={this.state.amount} 
                    onChange={this.handleChange('amount')} /></Col>
                </Row>
                <br></br>
                <br></br>
              <button
                className="bg-primary text-white text-center rounded p-3 "
                style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}
                onClick={this.onSubmit}>
                Start your Fundraising Journey!
              </button>
            </Form>
          </CardBody>
        </Card>
      );
    }
    }
    }
    


export default Editor;
