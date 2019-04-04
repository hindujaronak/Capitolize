import React , {Component} from "react";
import PropTypes from "prop-types";
import SocialMediaIcons from 'react-social-media-icons';
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
    console.log("Props are")
    console.log(props)
    this.state = {
      isLoading: true,
      signUp: false,
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
    console.log(props)

    // this.onTextBoxChangeSignUpEmail = this.onTextBoxChangeSignUpEmail.bind(this);
    // this.onTextBoxChangeSignUpPassword = this.onTextBoxChangeSignUpPassword.bind(this);
    // this.onTextBoxChangeSignUpMobile = this.onTextBoxChangeSignUpMobile.bind(this);
    // this.onTextBoxChangeSignUpAddress = this.onTextBoxChangeSignUpAddress.bind(this);
    // this.onTextBoxChangeSignUpFirstName = this.onTextBoxChangeSignUpFirstName.bind(this);
    // this.onTextBoxChangeSignUpLastName = this.onTextBoxChangeSignUpLastName.bind(this);
    // this.onTextBoxChangeSignUpCity = this.onTextBoxChangeSignUpCity.bind(this);
    // this.onTextBoxChangeSignUpCountry = this.onTextBoxChangeSignUpCountry.bind(this);
    // this.onTextBoxChangeSignUpState = this.onTextBoxChangeSignUpState.bind(this);
    // this.onTextBoxChangeSignUpDescription = this.onTextBoxChangeSignUpDescription.bind(this);
    // this.onTextBoxChangeSignUpPincode = this.onTextBoxChangeSignUpPincode.bind(this);
    // this.onTextBoxChangeSignUpAccountType = this.onTextBoxChangeSignUpAccountType.bind(this);
    
    this.onSignUp = this.onSignUp.bind(this);

  }

  componentDidMount(){
    const token = getFromStorage('mainapp');
    if(token){
      fetch('api/user/verify?token=' + token)
        // .then(res => res.json())
        .then(json => {
          if(json.success){
            this.setState({
              token,
              isLoading:false,
              signUp:true
            });
          }
          else{
            this.setState({
              isLoading: false,
              // signUp: true
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

  handleChange = name => event => {
    this.setState({[name]: event.target.value})
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
        signUpDescription,
        signUp
      } = this.state

      this.setState({
        isLoading : true
      });
      
      fetch('http://localhost:5000/api/user/register', {
        method: 'POST', 
        headers: {
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
        if(json.status === 200){
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUp: true,
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
          this.props.store.setUserId(json.user_id)
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
      signUpFirstName,
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
      signUpPassword,
      signUp
    } = this.state;

    if(isLoading){
      return(<div><p>Loading...</p></div>);
    }
    
    if (signUp) {
      // console.log(isLoggedIn)
      return <Redirect to='/login' />
    }
    if(!token){
     return(
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0"></h6>
          {/*<h6 className="m-0">{title}</h6>*/}
        </CardHeader>
        <ListGroup flush >
          <ListGroupItem  md = "6" className="p-3">
            <Row  md = "6">
              <Col>
                <Form>
                  <Row>
                    <Col md="12" align="center">
                      <h3>What role do you want to register as?</h3>
                    </Col>
                  </Row>

                  <Row>
                    <Col mod="4">
                      <input type="radio" name="signUpAccountType" value={this.state.signUpAccountType = 1} onChange = {this.handleChange('signUpAccountType')} /> An Official
                    </Col>
                    <Col mod="4">
                      <input type="radio" name="signUpAccountType" value={this.state.signUpAccountType = 2} onChange = {this.handleChange('signUpAccountType')} /> A User
                    </Col>
                    <Col mod="4">
                      <input type="radio" name="signUpAccountType" value={this.state.signUpAccountType = 0} onChange = {this.handleChange('signUpAccountType')} /> A Bank
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
                        defaultValue = {this.signUpFirstName}
                        name="signUpFirstName"
                        onChange = {this.handleChange('signUpFirstName')}
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
                        id="feLastName"
                        placeholder="Last Name"
                        name="signUpLastName"
                        defaultValue = {this.signUpLastName}
                        onChange = {this.handleChange('signUpLastName')}
                      />
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
                        name="signUpEmail"
                        defaultValue = {this.signUpEmail}
                        onChange = {this.handleChange('signUpEmail')}
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
                        name="signUpPassword"
                        defaultValue = {this.signUpPassword}
                        onChange = {this.handleChange('signUpPassword')}
                        autoComplete="current-password"
                      />
                    </Col>
                  </Row>
                  <FormGroup>
                    <label htmlFor="feAddress">Address</label>
                    <FormInput
                      id="feAddress"
                      placeholder="Address"
                      name="signUpAddress"
                      defaultValue = {this.signUpAddress}
                      onChange = {this.handleChange('signUpAddress')}
                    />
                  </FormGroup>
                  <Row form>
                    {/* City */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feCity">City</label>
                      <FormInput
                        id="feCity"
                        placeholder="City"
                        name="signUpCity"
                        defaultValue = {this.signUpCity}
                        onChange = {this.handleChange('signUpCity')}
                      />
                    </Col>
                    {/* State */}
                    <Col md="4" className="form-group">
                      <label htmlFor="feInputState">State</label>
                      <FormInput
                        id="feState"
                        placeholder="State"
                        name="signUpState"
                        defaultValue = {this.signUpState}
                        onChange = {this.handleChange('signUpState')}
                      />
                    </Col>
                    {/* Zip Code */}
                    <Col md="2" className="form-group">
                      <label htmlFor="feZipCode">Zip</label>
                      <FormInput
                        id="feZipCode"
                        placeholder="Zip"
                        name="signUpPincode"
                        defaultValue = {this.signUpPincode}
                        onChange = {this.handleChange('signUpPincode')}
                      />
                    </Col>
                  </Row>
                   {/* mobile */}
                    <Col md="3" className="form-group">
                      <label htmlFor="feMobileNumber">Mobile Number</label>
                      <FormInput
                        id="feMobileNumber"
                        placeholder="Mobile Number"
                        defaultValue = {this.signUpMobile}
                        name="signUpMobile"
                        onChange = {this.handleChange('signUpMobile')}
                      />
                    </Col>
                    {/*country*/}
                    <Col md="3" className="form-group">
                      <label htmlFor="feCountry">Country</label>
                      <FormInput
                        id="feCountry"
                        placeholder="Country"
                        defaultValue = {this.signUpCountry}
                        name="signUpCountry"
                        onChange = {this.handleChange('signUpCountry')}
                      />
                    </Col>
                  <Row form>
                    {/* Description */}
                    <Col md="12" className="form-group">
                      <label htmlFor="feDescription">Description</label>
                      <FormTextarea id="feDescription" name="signUpDescription" defaultValue = {this.signUpDescription} onChange = {this.handleChange('signUpDescription')} rows="5" />
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
  title: PropTypes.string,
  name: PropTypes.string
};

UserAccountDetails.defaultProps = {
  title: "Register User",
  name: "Me"
};

export default UserAccountDetails;

