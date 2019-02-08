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
                <Col md="6" className="form-group">
                    <h2><br></br>Who are you?</h2>
                    <h4>I want to register as ....</h4>
                </Col>
                <Col md="6" className="form-group">
                    <Row>
                        <Col md="6"><Button theme="accent">A Startup</Button></Col>
                    </Row>
                    <Row>
                        <Progress style={{ height: "5px" }} value={50} className="mb-3" />
                    </Row>
                    <Row>
                        <Col md="6"><Button theme="accent">A Bank</Button></Col>
                    </Row>
                    <Row>
                        <Progress style={{ height: "5px" }} value={50} className="mb-3" />
                    </Row>
                    <Row>
                        <Col md="6"><Button theme="accent">An Official</Button></Col>
                    </Row>
                    
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
