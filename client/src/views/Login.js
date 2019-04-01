import React, {Component} from 'react';
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import LoginView from "../components/login/LoginView";

class UserProfileLite extends Component{
  
  render(){
    return(
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title="Login" subtitle="Identify Yourself" md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          <Col lg="3"></Col>
          <Col lg="6">
            <LoginView />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default UserProfileLite;
