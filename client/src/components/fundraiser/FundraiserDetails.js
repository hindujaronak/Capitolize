import React, {Component} from "react";
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
  FormSelect,
  FormTextarea,
  Progress,
  Button
} from "shards-react";
import{
  getFromStorage,
  setInStorage
} from "../../utils/storage";

const UserAccountDetails = ({ title }) => (
  <Row>
    <Col md="4">
      <Card small className="mb-4 pt-3">
      <CardHeader className="border-bottom text-center">
        <div className="mb-3 mx-auto">
          <img
            src=""
            alt=""
            width="110"
          />
        </div>
        <h4 className="mb-0">{title.name}</h4>
        <span className="text-muted d-block mb-2">{title.jobTitle}</span>
        <Button pill outline size="sm" className="mb-2">
          <i className="material-icons mr-1">person_add</i> Follow
        </Button>
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="px-4">
          <div className="progress-wrapper">
            <strong className="text-muted d-block mb-2">
              {title.performanceReportTitle}
            </strong>
            <Progress
              className="progress-sm"
              value={title.performanceReportValue}
            >
              <span className="progress-value">
                {title.performanceReportValue}%
              </span>
            </Progress>
          </div>
        </ListGroupItem>
        <ListGroupItem className="p-4">
          <strong className="text-muted d-block mb-2">
            {title.metaTitle}
          </strong>
          <span>{title.metaValue}</span>
        </ListGroupItem>
      </ListGroup>
    </Card>
    </Col>
    <Col md="8">
      <Card small className="mb-0">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
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
                        value="Sierra"
                        onChange={() => {}}
                      />
                    </Col>
                    {/* Last Name */}
                    <Col md="6" className="form-group">
                      <label htmlFor="feLastName">Last Name</label>
                      <FormInput
                        id="feLastName"
                        placeholder="Last Name"
                        value="Brooks"
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
                        value="sierra@example.com"
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
    </Col>
  </Row>
);

UserAccountDetails.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string
};

UserAccountDetails.defaultProps = {
  title: "Fundraiser Title"
};

export default UserAccountDetails;
