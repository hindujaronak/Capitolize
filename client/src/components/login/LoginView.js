import React , {Component} from "react";
// import {login} from './login_helper.js';
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
import axios from 'axios';
import{
  getFromStorage,
  setInStorage
} from "../../utils/storage.js";
import store from '../../flux/store.js'



class UserAccountDetails extends Component{
  constructor(props){
    super(props);
    console.log("Props are")
    console.log(props)
    this.state = {
      isLoading: true,
      token: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      isLoggedIn: false
    };
    // this.onTextBoxChangeSignInEmail = this.onTextBoxChangeSignInEmail.bind(this);
    // this.onTextBoxChangeSignInPassword = this.onTextBoxChangeSignInPassword.bind(this);

    this.onLogin = this.onLogin.bind(this);

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
              isLoading:false
            });
            
            console.log(json)
          }
          else{
            this.setState({
              isLoading: false
            });
          }
        }
      );
    }
    else{
      this.setState({
        isLoading: false
      });
    }
    
    // onTextBoxChangeSignUpEmail = (event) => {
    //   this.setState({
    //     signUpEmail: event.target.value
    //   });
    // }
   
  }

  // onTextBoxChangeSignInEmail = (event) => {
  //     this.setState({
  //       signInEmail: event.target.value
  //     });
  // }
  // onTextBoxChangeSignInPassword = (event) => {
  //   this.setState({
  //     signInPassword: event.target.value
  //   });
  // }
  

  onLogin = () => {
    const {
        signInEmail,
        signInPassword,
        isLoggedIn
      } = this.state

      this.setState({
        isLoading : true
      });
      
      fetch('http://localhost:5000/api/user/signin', {
        method: 'POST', 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_id: signInEmail,
          password: signInPassword
        }),
      })
      .then((res => res.json()))
      .then(json => {
        console.log(json)
        // console.log(json.json())
        if(json.success){
          setInStorage('mainapp', { token: json.token });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: '',
            signInPassword : '',
            token : json.token,
            isLoggedIn : true
          });
          console.log(this.props)
          console.log(json)
          this.props.store.setUserId(json.user_id)
        }
        else{
          this.setState({
            signInError: json.message,
            isLoading: false
          });
        }
      })
  }
  
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
    console.log(this.state)
    if(isLoading){
      return(<div><p>Loading...</p></div>);
    }
    if (isLoggedIn) {
      return <Redirect to='/blog-overview' />
    }
    // const {redirectToDashboard} = this.state
    // if (redirectToDashboard) {
    //   return (<Redirect to='/blog-overview'/>)
    // }
    if(!token){
      return(
        <Card small className="mb-3">
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
                    
                    <Row>
                      <Col md="6" align="left">
                        <Button theme="accent" onClick={this.onLogin}>Login</Button>
                      </Col>
                      <Col md="6" align="right">
                        <p>Want to create an account? <Button theme="accent" href="/register">Register here!</Button></p>
                      </Col>
                    </Row>
                    {/*<Redirect
                      to={{
                        pathname: "/blog-overview",
                        state: { referrer: '/login' }
                   z   }}
                    />*/}
                  </Form>
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>
        </Card>
      )
    }
    return(
      <Redirect to = "/blog-overview" />
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
