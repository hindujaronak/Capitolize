import React, {Component} from 'react';
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";

class UserProfileLite extends Component{
  
  render(){
    return(
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title="Fundraiser Details" subtitle="" md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          <Col lg="3"></Col>
        </Row>
      </Container>
    )
  }
}

export default UserProfileLite;
