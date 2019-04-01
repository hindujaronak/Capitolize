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
import axios from 'axios';

class UserAccountDetails extends Component{
  constructor(){
    super();
    this.state = {
      email: '',
      password: '',
      error: '',
      redirectToDashboard: false,
      isLoggedIn: false
    }
  }

  clickLogin = () => {
    const user = {
      email: this.state.email || undefined,
      password: this.state.password || undefined
    }

    axios
      .get('http://localhost:5000/api/user/login')
      .then(response=>console.log(response)) 
      // {
      //   email_id: this.state.email,
      //   password: this.state.password,
      // })

    // login(user).then((data) => {
    //   this.setState({ error: false });
    //   // console.log(data)
    //   const { email, password } = this.state;
    //   // const email = this.state;  
    //   // if (!(email === 'anuja@gmail.com')) {
      

    //   if (!(email === this.state.email && password === this.state.password)) {
    //     return this.setState({ error: true });
    //   }
    //   else{
    //     this.setState({redirectToDashboard: true, isLoggedIn: true});
    //   } 
    //   // history.push('/blog-overview');
    // });
  }
  
  handleChange = name => event => {
    this.setState({[name]: event.target.value})
  }
  render(){
    if (this.state.redirectToDashboard === true && this.state.isLoggedIn === true) {
      return <Redirect to='/blog-overview' />
    }
    // const {redirectToDashboard} = this.state
    // if (redirectToDashboard) {
    //   return (<Redirect to='/blog-overview'/>)
    // }
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
                  
                  
                  <Button theme="accent" onClick={this.clickLogin}>Login</Button>
                  {/*<Redirect
                    to={{
                      pathname: "/blog-overview",
                      state: { referrer: '/login' }
                    }}
                  />*/}
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
