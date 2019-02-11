import React from "react";
import PropTypes from "prop-types";
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

const UserAccountDetails = ({ title }) => (
  <Card small className="mb-4">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
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
                    <InputGroup className="mb-3">
                        <InputGroupAddon type="prepend">
                            <InputGroupText></InputGroupText>
                        </InputGroupAddon>
                        <FormInput placeholder="Email id" />
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
                        id="fePassword"
                        placeholder="Password"
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
);

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
