import React , {Component} from "react";
import PropTypes from "prop-types";
import SocialMediaIcons from 'react-social-media-icons';
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
  FormSelect,
  FormTextarea,
  Button
} from "shards-react";

import{
  getFromStorage,
  setInStorage
} from "../../utils/storage.js";

class UserAccountDetails extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signUpFirstName:'',
      signUpAccountType: '',
      signUpPincode: '',
      signUpAddress: '',
      signUpDescription: '',
      signUpCountry: '',
      signUpState: '',
      signUpCity: '',
      signUpLastName: '',
      signUpMobile: '',
      signUpEmail: '',
      signUpPassword: ''
    };

    this.onTextBoxChangeSignUpEmail = this.onTextBoxChangeSignUpEmail.bind(this);
    this.onTextBoxChangeSignUpPassword = this.onTextBoxChangeSignUpPassword.bind(this);
    this.onTextBoxChangeSignUpMobile = this.onTextBoxChangeSignUpMobile.bind(this);
    this.onTextBoxChangeSignUpAddress = this.onTextBoxChangeSignUpAddress.bind(this);
    this.onTextBoxChangeSignUpFirstName = this.onTextBoxChangeSignUpFirstName.bind(this);
    this.onTextBoxChangeSignUpLastName = this.onTextBoxChangeSignUpLastName.bind(this);
    this.onTextBoxChangeSignUpCity = this.onTextBoxChangeSignUpCity.bind(this);
    this.onTextBoxChangeSignUpCountry = this.onTextBoxChangeSignUpCountry.bind(this);
    this.onTextBoxChangeSignUpState = this.onTextBoxChangeSignUpState.bind(this);
    this.onTextBoxChangeSignUpDescription = this.onTextBoxChangeSignUpDescription.bind(this);
    this.onTextBoxChangeSignUpPincode = this.onTextBoxChangeSignUpPincode.bind(this);
    this.onTextBoxChangeSignUpAccountType = this.onTextBoxChangeSignUpAccountType.bind(this);
    
    this.onSignUp = this.onSignUp.bind(this);

  }

  componentDidMount(){
    const token = getFromStorage('mainapp');
    if(token){
      fetch('api/user/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if(json.success){
            this.setState({
              token,
              isLoading:false
            });
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
  onTextBoxChangeSignUpEmail = (event) => {
      this.setState({
        signUpEmail: event.target.value
      });
  }
   onTextBoxChangeSignUpPassword = (event) => {
      this.setState({
        signUpPassword: event.target.value
      });
    }
    onTextBoxChangeSignUpMobile = (event) => {
      this.setState({
        signUpMobile: event.target.value
      });
    }
    onTextBoxChangeSignUpFirstName = (event) => {
      this.setState({
        signUpFirstname: event.target.value
      });
    }
    onTextBoxChangeSignUpLastName = (event) => {
      this.setState({
        signUpLastName: event.target.value
      });
    }
    onTextBoxChangeSignUpAddress = (event) => {
      this.setState({
        signUpAddress: event.target.value
      });
    }
    onTextBoxChangeSignUpCity = (event) => {
      this.setState({
        signUpCity: event.target.value
      });
    }
    onTextBoxChangeSignUpCountry = (event) => {
      this.setState({
        signUpCountry: event.target.value
      });
    }
    onTextBoxChangeSignUpDescription = (event) => {
      this.setState({
        signUpDescription: event.target.value
      });
    }

    onTextBoxChangeSignUpPincode = (event) => {
      this.setState({
        signUpPincode: event.target.value
      });
    }
    
    onTextBoxChangeSignUpState = (event) => {
      this.setState({
        signUpState: event.target.value
      });
    }
    
    onTextBoxChangeSignUpAccountType = (event) => {
      this.setState({
        signUpAccountType: event.target.value
      });
    }

    onSignUp(){
      const {
        signUpEmail,
        signUpPassword,
        signUpFirstName,
        signUpLastName,
        signUpMobile,
        signUpAccountType,
        signUpAddress,
        signUpCity,
        signUpState,
        signUpCountry,
        signUpPincode,
        signUpDescription
      } = this.state

      this.setState({
        isLoading : true
      });
      
      fetch('http://localhost:5000/api/user/register', {
        method: 'POST', 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstname: signUpFirstName,
          lastname: signUpLastName,
          email_id: signUpEmail,
          password: signUpPassword,
          mobile_number: signUpMobile,
          state: signUpState,
          address: signUpAddress,
          city: signUpCity,
          country: signUpCountry,
          pincode: signUpPincode,
          description: signUpDescription,
          accountType:signUpAccountType
        }),
      })
      // .then((res => res.json())
      .then(json => {
        console.log('json', json);
        if(json.success){
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpAccountType : '',
            signUpAddress: '',
            signUpCity : '',
            signUpCountry : '',
            signUpDescription: '',
            signUpEmail: '',
            signUpFirstName : '',
            signUpLastName : '',
            signUpMobile : '',
            signUpPassword : '',
            signUpPincode : '',
            signUpState : '',
          });
        }
        else{
          this.setState({
            signUpError: json.message,
            isLoading: false
          });
        }
      }); //add a closing bracket
    }     
  render(){
    const{
      isLoading,
      token,
      signUpFirstname,
      signUpAccountType,
      signUpPincode,
      signUpDescription,
      signUpCountry,
      signUpState,
      signUpAddress,
      signUpCity,
      signUpLastName,
      signUpMobile,
      signUpEmail,
      signUpPassword
    } = this.state;

    if(isLoading){
      return(<div><p>Loading...</p></div>);
    }
    if(!token){
     return(
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0"></h6>
          {/*<h6 className="m-0">{title}</h6>*/}
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <Form>
                  <Row>
                    <Col md="12" align="center">
                      <h3>What role do you want to register as?</h3>
                    </Col>
                  </Row>

                  {/* <form>
                    <div className="radio">
                      <label>
                        <input type="radio" value="1" checked={this.state.signUpAccountType === '1'} onChange = {() => this.onTextBoxChangeSignUpAccountType} />
                        An Official
                      </label>
                    </div>
                    <div className="radio">
                      <label>
                        <input type="radio" value="2" checked={this.state.signUpAccountType === '2'} onChange = {() => this.onTextBoxChangeSignUpAccountType} />
                        A User
                      </label>
                    </div>
                    <div className="radio">
                      <label>
                        <input type="radio" value="0" checked={this.state.signUpAccountType === '0'} onChange = {() => this.onTextBoxChangeSignUpAccountType} />
                        A Bank
                      </label>
                    </div>
                  </form> */}
                  <Row>
                    <Col mod="4">
                      <input type="radio" value={this.state.signUpAccountType === 1} onChange = {() => this.onTextBoxChangeSignUpAccountType} /> An Official
                    </Col>
                    <Col mod="4">
                      <input type="radio" value={this.state.signUpAccountType === 2} onChange = {() => this.onTextBoxChangeSignUpAccountType} /> A User
                    </Col>
                    <Col mod="4">
                      <input type="radio" value={this.state.signUpAccountType === 0} onChange = {() => this.onTextBoxChangeSignUpAccountType} /> A Bank
                    </Col>
                  </Row>

                  <hr></hr>
                  
                  <Row form>
                    {/* First Name */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feFirstName">First Name</label>
                      <FormInput
                        id="feFirstName"
                        placeholder="First Name"
                        value = {signUpFirstname}
                        onChange = {() => this.onTextBoxChangeSignUpFirstName}
                      />
                    </Col>
                    {/* Last Name */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feLastName">Last Name</label>
                    {/*<FormGroup>
                        <InputGroup className="mb-3">
                            <InputGroupAddon type="prepend">
                                <InputGroupText></InputGroupText>
                            </InputGroupAddon>*/}
                            <FormInput 
                              value = {signUpLastName}
                              onChange = {() => this.onTextBoxChangeSignUpLastName}
                              placeholder="Last Name" />
                        {/*</InputGroup>
                    </FormGroup>*/}
                    </Col>
                  </Row>
                  <Row form>
                    {/* Email */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feEmail">Email</label>
                      <FormInput
                        type="email"
                        id="feEmail"
                        placeholder="Email Address"
                        value = {signUpEmail}
                        onChange = {() => this.onTextBoxChangeSignUpEmail}
                        autoComplete="email"
                      />
                    </Col>
                    {/* Password */}
                    <Col md="6" className="form-group">
                      <label htmlFor="fePassword">Password</label>
                      <FormInput
                        type="password"
                        id="fePassword"
                        placeholder="Password"
                        value = {signUpPassword}
                        onChange = {() => this.onTextBoxChangeSignUpPassword}
                        autoComplete="current-password"
                      />
                    </Col>
                  </Row>
                  <FormGroup>
                    <label htmlFor="feAddress">Address</label>
                    <FormInput
                      id="feAddress"
                      placeholder="Address"
                      value = {signUpAddress}
                      onChange = {() => this.onTextBoxChangeSignUpAddress}
                    />
                  </FormGroup>
                  <Row form>
                    {/* City */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feCity">City</label>
                      <FormInput
                        id="feCity"
                        placeholder="City"
                        value = {signUpCity}
                        onChange = {() => this.onTextBoxChangeSignUpCity}
                      />
                    </Col>
                    {/* State */}
                    <Col md="4" className="form-group">
                      <label htmlFor="feInputState">State</label>
                      <FormSelect id="feInputState">
                        <option>Choose...</option>
                        <option>...</option>
                      </FormSelect>
                    </Col>
                    {/* Zip Code */}
                    <Col md="2" className="form-group">
                      <label htmlFor="feZipCode">Zip</label>
                      <FormInput
                        id="feZipCode"
                        placeholder="Zip"
                        value = {signUpPincode}
                        onChange = {() => this.onTextBoxChangeSignUpPincode}
                      />
                    </Col>
                  </Row>
                  <Row form>
                    {/* Description */}
                    <Col md="12" className="form-group">
                      <label htmlFor="feDescription">Description</label>
                      <FormTextarea id="feDescription" value = {signUpDescription} onChange = {() => this.onTextBoxChangeSignUpDescription} rows="5" />
                    </Col>
                  </Row>
                  <Button theme="accent" onClick = {() => this.onSignUp()}>Register Account</Button>
                </Form>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Card>
     ); 
    }
    return(
      "Account"
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
  title: "Register User"
};

export default UserAccountDetails;

