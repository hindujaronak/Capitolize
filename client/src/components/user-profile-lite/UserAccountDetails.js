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
      user_id: this.props.store.getUserId()
    };

  }
  componentDidMount(){
    this.setState({isLoading: false})
    // const obj = getFromStorage('mainapp');
    
    // if(obj && obj.token){
    //   const { token } = obj;
    //   fetch('api/user/verify?token=' + token)
    //     .then(res => res.json())
    //     .then(json => {
    //       if(json.success){
    //         this.setState({
    //           token,
    //           isLoading:false
    //         });
    //       }
    //       else{
    //         this.setState({
    //           isLoading: false
    //         });
    //       }
    //     }
    //   );
    // }
    // else{
    //   this.setState({
    //     isLoading: false
    //   });
    // }
    
     // how will we fetch user id from session
      this.setState({
        isLoading : true
      });
      
      fetch('http://localhost:5000/api/user/' + this.state.user_id, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json'
        },
      })
      // .then((res => res.json())
      .then(json => {
        console.log('json', json);
        if(json.status === 200){
          this.setState({
            
          });
        }
        else{
          this.setState({
            isLoading: false
          });
        }
      });

  }
  render(){
    return(
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          {/*<h6 className="m-0">{this.props.title}</h6>*/}
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <Form>
                  <Row form>
                    {/* First Name */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feFirstName">First Name</label>
                      <FormInput
                        id="feFirstName"
                        placeholder="First Name"
                        value="Bhavika"
                        onChange={() => {}}
                      />
                    </Col>
                    {/* Last Name */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feLastName">Last Name</label>
                      <FormInput
                        id="feLastName"
                        placeholder="Last Name"
                        value="Shahani"
                        onChange={() => {}}
                      />
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
                        value="shahani@capitolize.com"
                        onChange={() => {}}
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
                        value="EX@MPL#P@$$w0RD"
                        onChange={() => {}}
                        autoComplete="current-password"
                      />
                    </Col>
                  </Row>
                  <FormGroup>
                    <label htmlFor="feAddress">Address</label>
                    <FormInput
                      id="feAddress"
                      placeholder="Address"
                      value="1234 Main St."
                      onChange={() => {}}
                    />
                  </FormGroup>
                  <Row form>
                    {/* City */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feCity">City</label>
                      <FormInput
                        id="feCity"
                        placeholder="City"
                        onChange={() => {}}
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
                        onChange={() => {}}
                      />
                    </Col>
                  </Row>
                  <Row form>
                    {/* Description */}
                    <Col md="12" className="form-group">
                      <label htmlFor="feDescription">Description</label>
                      <FormTextarea id="feDescription" rows="5" />
                    </Col>
                  </Row>
                  <Button theme="accent">Update Account</Button>
                </Form>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Card>
    );
  }
}
UserAccountDetails.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string
};

UserAccountDetails.defaultProps = {
  title: "Account Details"
};

export default UserAccountDetails;
