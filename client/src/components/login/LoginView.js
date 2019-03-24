import React , {Component} from "react";
import {login} from './login_helper.js';
import PropTypes from "prop-types";
import {Redirect} from 'react-router-dom'
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
import {signin} from './login_helper.js';

class UserAccountDetails extends Component{
  state = {
      email: '',
      password: '',
      error: '',
      redirectToDashboard: false
  }

  clickSubmit = () => {
    const user = {
      email: this.state.email || undefined,
      password: this.state.password || undefined
    }

    login(user).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
          this.setState({redirectToDashboard: true})
      }
    })
  }

  handleChange = name => event => {
    this.setState({[name]: event.target.value})
  }
  render(){
    const {redirectToDashboard} = {
      redirectToDashboard: {
        pathname: '/add-new-idea'
      }
    }
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
                            <FormInput placeholder="Email id" name="email" value={this.state.email} onChange={this.handleChange('email')} />
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
                            id="fePassword" name="password"
                            placeholder="Password" value={this.state.password} onChange={this.handleChange('password')}
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
}


UserAccountDetails.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string
};

UserAccountDetails.defaultProps = {
  title: "Login Details"
};

export default UserAccountDetails;
