import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import LoginView from "../components/login/LoginView";

const UserProfileLite = () => (
  <Container fluid className="main-content-container px-4">
    <Row noGutters className="page-header py-4">
      <PageTitle title="Login" subtitle="Identify Yourself" md="12" className="ml-sm-auto mr-sm-auto" />
    </Row>
    <Row>
      <Col lg="6">
        <LoginView />
      </Col>
    </Row>
  </Container>
);

export default UserProfileLite;
