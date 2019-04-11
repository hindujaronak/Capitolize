import React, {Component} from "react";
import { Container, Row, Col } from "shards-react";
import PropTypes from "prop-types";

import PageTitle from "../components/common/PageTitle";
import UserDetails from "../components/user-profile-lite/UserDetails";
import UserAccountDetails from "../components/user-profile-lite/UserAccountDetails";

class ParentUserProfile extends Component{
    constructor(props) {
    super(props)
  }
    render(){
        let props = this.props
        return(
            <Container>
                <Row noGutters className="page-header py-4">
                    <PageTitle title="User Profile" subtitle="Overview" md="12" className="ml-sm-auto mr-sm-auto" />
                </Row>
                <Row>
                <Col lg="4">
                    <UserDetails {...props}/>
                </Col>
                <Col lg="8">
                    <UserAccountDetails {...props}/>
                </Col>
                </Row>
            </Container>
        );

    }

}
export default ParentUserProfile;
