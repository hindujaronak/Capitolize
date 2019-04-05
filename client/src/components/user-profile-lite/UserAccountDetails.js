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
      user_id: this.props.store.getUserId(),
      responses:[]
    };

  }
  componentDidMount(){
    this.setState({isLoading: false})
    console.log("user_id is " + this.state.user_id)
      
      fetch('http://localhost:5000/api/user/' + this.state.user_id, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(res => res.json())
      .then(data => this.setState({ responses: data.responses }));
  }
  render(){
    // (jsons.length > 0) ? jsons.map( (json) => {
      const {responses} = this.state;
          return(
            <Card small className="mb-4"> 
              <CardHeader className="border-bottom">
                {/*<h6 className="m-0">{this.props.title}</h6>*/}
              </CardHeader>
              <ListGroup>
                {this.state.responses.map( (response) =>
                <ListGroupItem className="p-3">
                  <Row>
                    <Col>
                      <Form>
                        <Row form>
                          {/* First Name */}
                          <Col md="6" className="form-group">
                            <label htmlFor="feFirstName">First Name</label> 
                            <FormInput disabled
                              id="feFirstName"
                              placeholder="First Name"
                              value={response.firstname}
                              onChange={() => {}}
                            />
                          </Col>
                          {/* Last Name */}
                          <Col md="6" className="form-group">
                            <label htmlFor="feLastName">Last Name</label>
                            <FormInput disabled
                              id="feLastName"
                              placeholder="Last Name"
                              value={response.lastname}
                              onChange={() => {}}
                            />
                          </Col>
                        </Row>
                        <Row form>
                          {/* Email */}
                          <Col md="6" className="form-group">
                            <label htmlFor="feEmail">Email</label>
                            <FormInput disabled
                              type="email"
                              id="feEmail"
                              placeholder="Email Address"
                              value={response.email_id}
                              onChange={() => {}}
                              autoComplete="email"
                            />
                          </Col>
                          
                        </Row>
                        <FormGroup>
                          <label htmlFor="feAddress">Address</label>
                          <FormInput disabled
                            id="feAddress"
                            placeholder="Address"
                            value={response.address}
                            onChange={() => {}}
                          />
                        </FormGroup>
                        <Row form>
                          {/* City */}
                          <Col md="6" className="form-group">
                            <label htmlFor="feCity">City</label>
                            <FormInput disabled
                              id="feCity"
                              placeholder="City"
                              value = {response.city}
                              onChange={() => {}}
                            />
                          </Col>
                          {/* State */}
                          <Col md="4" className="form-group">
                            <label htmlFor="feInputState">State</label>
                            <FormInput disabled
                              id="feState"
                              placeholder="State"
                              value = {response.state}
                              onChange={() => {}}
                            />
                          </Col>
                          {/*country*/}
                          <Col md="4" className="form-group">
                            <label htmlFor="feInputCountry">State</label>
                            <FormInput disabled
                              id="feCountry"
                              placeholder="Country"
                              value = {response.country}
                              onChange={() => {}}
                            />
                          </Col>
                          {/* Zip Code */}
                          <Col md="2" className="form-group">
                            <label htmlFor="feZipCode">Zip</label>
                            <FormInput disabled
                              id="feZipCode"
                              placeholder="Zip"
                              value={response.pincode}
                              onChange={() => {}}
                            />
                          </Col>
                        </Row>
                        <Row form>
                          {/* Description */}
                          <Col md="12" className="form-group">
                            <label htmlFor="feDescription">Description</label>
                            <FormTextarea disabled id="feDescription" value= {response.description} rows="5" />
                          </Col>
                        </Row>
                      </Form>
                    </Col>
                  </Row>
                </ListGroupItem>
                )}
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
