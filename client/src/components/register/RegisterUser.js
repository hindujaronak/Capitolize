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
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormRadio
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

    function onTextBoxChangeSignUpEmail(event){
      this.setState({
        signUpEmail: event.target.value
      });
    }
    function onTextBoxChangeSignUpPassword(event){
      this.setState({
        signUpPassword: event.target.value
      });
    }
    function onTextBoxChangeSignUpMobile(event){
      this.setState({
        signUpMobile: event.target.value
      });
    }
    function onTextBoxChangeSignUpFirstName(event){
      this.setState({
        signUpFirstname: event.target.value
      });
    }
    function onTextBoxChangeSignUpLastName(event){
      this.setState({
        signUpLastName: event.target.value
      });
    }
    function onTextBoxChangeSignUpAddress(event){
      this.setState({
        signUpAddress: event.target.value
      });
    }
    function onTextBoxChangeSignUpCity(event){
      this.setState({
        signUpCity: event.target.value
      });
    }
    function onTextBoxChangeSignUpCountry(event){
      this.setState({
        signUpCountry: event.target.value
      });
    }
    function onTextBoxChangeSignUpDescription(event){
      this.setState({
        signUpDescription: event.target.value
      });
    }

    function onTextBoxChangeSignUpPincode(event){
      this.setState({
        signUpPincode: event.target.value
      });
    }
    
    function onTextBoxChangeSignUpState(event){
      this.setState({
        signUpState: event.target.value
      });
    }
    
    function onTextBoxChangeSignUpAccountType(event){
      this.setState({
        signUpAccountType: event.target.value
      });
    }        
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

                  <Row>
                    <Col md="4">
                      <fieldset>
                        <FormRadio value="1" checked={this.state.signUpAccountType === 1} onChange = {() => this.onTextBoxChangeSignUpAccountType()}>An Official</FormRadio>
                      </fieldset>
                    </Col>
                    <Col md="4">
                      <fieldset>
                        <FormRadio defaultChecked value="2" checked={this.state.signUpAccountType === 2} onChange = {() => this.onTextBoxChangeSignUpAccountType()}>A User</FormRadio>
                      </fieldset>
                    </Col> 
                    <Col md="4">
                      <fieldset>
                        <FormRadio value="0" checked={this.state.signUpAccountType === 0} onChange = {() => this.onTextBoxChangeSignUpAccountType()} >A Bank</FormRadio>
                      </fieldset>
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
                        onChange = {() => this.onTextBoxChangeSignUpFirstName()}
                      />
                    </Col>
                    {/* Last Name */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feLastName">Last Name</label>
                    <FormGroup>
                        <InputGroup className="mb-3">
                            <InputGroupAddon type="prepend">
                                <InputGroupText></InputGroupText>
                            </InputGroupAddon>
                            <FormInput 
                              value = {signUpLastName}
                              onChange = {() => this.onTextBoxChangeSignUpLastName()}
                              placeholder="Last Name" />
                        </InputGroup>
                    </FormGroup>
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
                        onChange = {() => this.onTextBoxChangeSignUpEmail()}
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
                        onChange = {() => this.onTextBoxChangeSignUpPassword()}
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
                      onChange = {() => this.onTextBoxChangeSignUpAddress()}
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
                        onChange = {() => this.onTextBoxChangeSignUpCity()}
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
                        onChange = {() => this.onTextBoxChangeSignUpPincode()}
                      />
                    </Col>
                  </Row>
                  <Row form>
                    {/* Description */}
                    <Col md="12" className="form-group">
                      <label htmlFor="feDescription">Description</label>
                      <FormTextarea id="feDescription" value = {signUpDescription} onChange = {() => this.onTextBoxChangeSignUpDescription()} rows="5" />
                    </Col>
                  </Row>
                  <Button theme="accent">Register Account</Button>
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

