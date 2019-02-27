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
  Button,
  Progress,
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
                {/* First Name */}
                <Col md="12" className="form-group" align="center">
                    <h3>Who are you?</h3>
                    <h5>I want to register as ....<br></br></h5>
                </Col>
              </Row>
              <Row form>
                <Col md="4" className="form-group" align="right">
                  <Button theme="accent">A Startup</Button>
                </Col>
                <Col md="4" className="form-group" align="center">
                  <Button theme="accent">A Official</Button>
                </Col>
                <Col md="4" className="form-group" align="left">
                  <Button theme="accent">A Corporation</Button>
                </Col>
              </Row>
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
  title: "Choose Registration Type"
};

export default UserAccountDetails;
