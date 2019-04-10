import React, {Component} from 'react';
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import FundraiserDetails from "../components/fundraiser/FundraiserDetails";

class UserProfileLite extends Component{
  constructor(props) {
    super(props)
  }

  render(){
    let props = this.props
    return(
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title="Fundraiser Details" subtitle="" md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          <FundraiserDetails {...props}/>
        </Row>
      </Container>
    )
  }
}

export default UserProfileLite;
