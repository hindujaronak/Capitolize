import React, {Component} from 'react';
import { Container, Row, Col, Alert } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import FundraiserDetails from "../components/fundraiser/FundraiserDetails";

class UserProfileLite extends Component{
  constructor(props) {
    super(props)
    this.state = {
      isAlert: false
    }
  }

  setAlert() {
    this.setState({
      isAlert: !this.state.isAlert
    })
  }

  renderAlert() {
    if (this.state.isAlert) {
      return (
          <Alert className="mb-0">
          <i className="fa fa-info mx-2"></i>Transaction Successful!!
          </Alert>
      )
    }

  }

  render(){
    let props = this.props
    return(
      <Container fluid className="main-content-container px-4">
        {this.renderAlert()}
        <Row noGutters className="page-header py-4">
          <PageTitle title="Fundraiser Details" subtitle="" md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          <Col md="4"></Col>
          <Col md="4"><FundraiserDetails {...props} setAlert={this.setAlert.bind(this)}/></Col>
        </Row>
      </Container>
    )
  }
}

export default UserProfileLite;
