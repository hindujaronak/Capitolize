import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import RegisterUser from "../components/register/RegisterUser";
import RegisterOffical from "../components/register/RegisterOfficial";
import RegisterCorp from "../components/register/RegisterCorp";
import RegisterChoice from "../components/register/RegisterChoice";

const UserProfileLite = () => (
  <Container fluid className="main-content-container px-4">
    <Row noGutters className="page-header py-4">
      <PageTitle title="Registration" subtitle="Select your identity" md="12" className="ml-sm-auto mr-sm-auto" />
    </Row>
    <Row>
      <Col lg="12">
        <RegisterChoice />
      </Col>
    </Row>
    <Row>
      <Col lg="12">
        <RegisterUser />
      </Col>
    </Row>
    <Row>
      <Col lg="12">
        <RegisterOffical />
      </Col>
    </Row>
    <Row>
      <Col lg="12">
        <RegisterCorp />
      </Col>
    </Row>
  </Container>
);

export default UserProfileLite;
