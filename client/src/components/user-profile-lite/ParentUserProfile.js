import React, {Component} from "react";
import { Container, Row, Col } from "shards-react";
import PropTypes from "prop-types";

import PageTitle from "../common/PageTitle";
import UserDetails from "./UserDetails";
import UserAccountDetails from "./UserAccountDetails";

class ParentUserProfile extends Component{
    constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      token: '',
      user_id: this.props.store.getUserId(),
      user : ''
};
    }

    render(){
        let props = this.props
        let user_idFromParent = this.state.user_id
        let userDataFromParent = this.state.user
        console.log(userDataFromParent)
        console.log(user_idFromParent)
        return(
            <Container>
                <Row noGutters className="page-header py-4">
                    <PageTitle title="User Profile" subtitle="Overview" md="12" className="ml-sm-auto mr-sm-auto" />
                </Row>
                <Row>
                <Col lg="4">
                    <UserDetails {...props} userDataFromParent = {this.state.user} user_idFromParent = {this.state.user_id} />
                </Col>
                <Col lg="8">
                    <UserAccountDetails {...props} userDataFromParent = {this.state.user} user_idFromParent = {this.state.user_id}/>
                </Col>
                </Row>
            </Container>
        );

    }

}
export default ParentUserProfile;
