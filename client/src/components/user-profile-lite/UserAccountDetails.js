import React , {Component} from "react";
import PropTypes from "prop-types";
import routes from "../../routes";

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
      hits:[],
      data: ''
    };
  }
  
  componentWillMount(){
    this.setState({isLoading: false})
    console.log("user_id is " + this.state.user_id)
      
      fetch('http://localhost:5000/api/user/' + this.state.user_id, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(res => res.json())
      .then(res => {
        this.setState({user : res})
        // console.log("user is" + this.state.user);
        return this.state.user;
      })
  }
  
  
  render(){
    // (jsons.length > 0) ? jsons.map( (json) => {
      const {data, hits} = this.state;
          return(
            <Card small className="mb-4"> 
              <CardHeader className="border-bottom">
                {/*<h6 className="m-0">{this.props.title}</h6>*/}
              </CardHeader>
              <ListGroup>
                
                <ListGroupItem className="p-3">
                  {/*{console.log(this.state.user)}*/}
           
                  <Row>
                    <Col>
                      <Form>
                        <Row form>
                          {/* First Name */}
                          {data.hits.map((hit) =>
                          <Col md="6" className="form-group">
                            
                            <label htmlFor="feFirstName">First Name</label> 
                            <FormInput disabled
                              id="feFirstName"
                              placeholder="First Name"
                              value={hit.firstname}
                              onChange={() => {}}
                            />
                          </Col>
                          )}
                          
                          
                          {/* Last Name */}
                          {data.hits.map((hit) =>
                          <Col md="6" className="form-group">
                            <label htmlFor="feLastName">Last Name</label>
                            <FormInput disabled
                              id="feLastName"
                              placeholder="Last Name"
                              value={hit.lastname}
                              onChange={() => {}}
                            />
                          </Col>
                          )}
                        </Row>
                        <Row form>
                          {/* Email */}
                          {data.hits.map((hit) =>
                          <Col md="6" className="form-group">
                            <label htmlFor="feEmail">Email</label>
                            <FormInput disabled
                              type="email"
                              id="feEmail"
                              placeholder="Email Address"
                              value={hit.email_id}
                              onChange={() => {}}
                              autoComplete="email"
                            />
                          </Col>
                          )}
                        </Row>
                        {/*Address*/}
                        <Row form>
                          {data.hits.map((hit) =>
                        <FormGroup>
                          <label htmlFor="feAddress">Address</label>
                          <FormInput disabled
                            id="feAddress"
                            placeholder="Address"
                            value={hit.address}
                            onChange={() => {}}
                          />
                          
                        </FormGroup>
                        )}
                        </Row>
                        <Row form>
                          {/* City */}
                          {data.hits.map((hit) => 
                          <Col md="6" className="form-group">
                            <label htmlFor="feCity">City</label>
                            <FormInput disabled
                              id="feCity"
                              placeholder="City"
                              value = {hit.city}
                              onChange={() => {}}
                            />
                          </Col>
                          )}
                          {/* State */}
                          {data.hits.map((hit) => 
                          <Col md="4" className="form-group">
                            <label htmlFor="feInputState">State</label>
                            <FormInput disabled
                              id="feState"
                              placeholder="State"
                              value = {hit.state}
                              onChange={() => {}}
                            />
                          </Col>
                          )}
                          {/*country*/}
                          {data.hits.map((hit) => 
                          <Col md="4" className="form-group">
                            <label htmlFor="feInputCountry">State</label>
                            <FormInput disabled
                              id="feCountry"
                              placeholder="Country"
                              value = {hit.country}
                              onChange={() => {}}
                            />
                          </Col>
                          )}
                          {/* Zip Code */}
                          {data.hits.map((hit) => 
                          <Col md="2" className="form-group">
                            <label htmlFor="feZipCode">Zip</label>
                            <FormInput disabled
                              id="feZipCode"
                              placeholder="Zip"
                              value={hit.pincode}
                              onChange={() => {}}
                            />
                          </Col>
                          )}
                        </Row>
                        <Row form>
                          
                          {/* Description */}
                          {data.hits.map((hit) => 
                          <Col md="12" className="form-group">
                            <label htmlFor="feDescription">Description</label>
                            <FormTextarea disabled id="feDescription" value= {hit.description} rows="5" />
                          </Col>
                          )}
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
