import React from "react";
import { Container, Row, Col } from "shards-react";
import PropTypes from "prop-types";

import PageTitle from "../components/common/PageTitle";
import ParentUserProfile from "../components/user-profile-lite/ParentUserProfile";

class UserProfileLite extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    let props = this.props
    return (  
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle title="User Profile" subtitle="Overview" md="12" className="ml-sm-auto mr-sm-auto" />
      </Row>
      <ParentUserProfile {...props}/>
  </Container>)
  }
}
export default UserProfileLite;
