import React , {Component} from "react";
import PropTypes from "prop-types";
import {Redirect} from 'react-router-dom';
import {
    Card,
    CardHeader,
    ListGroup,
    ListGroupItem,
    Row,
    Col,
    Form,
    FormGroup,
    FormInput,
    
    Button,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from "shards-react";

import{
    getFromStorage,
    setInStorage
} from "../../utils/storage.js";

class UserAccountDetails extends Component{
    
    handleChange = name => event => {
      this.setState({[name]: event.target.value})
    }
    render(){
      const{
        isLoading,
        token,
        signInEmail,
        signInPassword,
        isLoggedIn
      } = this.state;
  
      if(isLoading){
        return(<div><p>Loading...</p></div>);
      }
      if (isLoggedIn === true) {
        return <Redirect to='/blog-overview' />
      }
      // const {redirectToDashboard} = this.state
      // if (redirectToDashboard) {
      //   return (<Redirect to='/blog-overview'/>)
      // }
      if(token){
        return(
          <Card small className="-3">
            <CardHeader className="border-bottom">
              {/*<h6 className="m-0">{title}</h6>*/}
              <h6 className="m-0">Login</h6>
            </CardHeader>
            <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                    <Form>  
                      <Row form>
                      
                        {/* Email */}
                        <Col md="6" className="form-group">
                          <label htmlFor="feLastName">Email id</label>
                        <FormGroup>
                            <InputGroup className="mb-2 ">
                                <InputGroupAddon type="prepend">
                                    <InputGroupText></InputGroupText>
                                </InputGroupAddon>
                                <FormInput placeholder="Email id" name="signInEmail" value={signInEmail} onChange={this.handleChange('signInEmail')} />
                            </InputGroup>
                        </FormGroup>
                        </Col>
                      </Row>
                      <Row form>
                        
                        {/* Password */}
                        <Col md="6" className="form-group">
                          <label htmlFor="fePassword">Password</label>
                          
                          <FormGroup>
                          <InputGroup className="mb-3">
                                <InputGroupAddon type="prepend">
                                    <InputGroupText></InputGroupText>
                                </InputGroupAddon>
                                <FormInput type="password"
                                id="fePassword" name="signInPassword"
                                placeholder="Password" value={signInPassword} onChange={this.handleChange('signInPassword')}
                                />
                            </InputGroup>
                        </FormGroup>
                        </Col>
                      </Row>
                      
                        <Row>
                        {/* Confirm Password */}
                        <Col md="6" className="form-group">
                          <label htmlFor="fePassword">Forgot Password?</label>
                          
                          <br></br>
                          <a href="/login">Click here to reset password</a>
                          <br></br>
  
                        </Col>
                      </Row>
                      
                      
                      <Button theme="accent">Login</Button>
                    </Form>
                  </Col>
                </Row>
              </ListGroupItem>
            </ListGroup>
          </Card>
        )
      }
      return(
        <Redirect to = "/login" />
      )
    }
  }
  
  
  UserAccountDetails.propTypes = {
    /**
     * The component's title.
     */
    title: PropTypes.string
  };
  
  UserAccountDetails.defaultProps = {
    title: "Fundraiser Details"
  };
  
  export default UserAccountDetails;
  