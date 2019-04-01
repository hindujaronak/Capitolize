import React, {Component} from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import RegisterUser from "../components/register/RegisterUser";

class UserProfileLite extends Component{
  render(){
    return(
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title="Registration" subtitle="Select your identity" md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          <Col lg="12">
          </Col>
        </Row>
        <Row>
          <Col lg="12">
            <RegisterUser />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default UserProfileLite;
