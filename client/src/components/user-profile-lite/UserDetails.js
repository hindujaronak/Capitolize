import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  Button,
  ListGroup,
  ListGroupItem,
  Progress
} from "shards-react";

class UserDetails extends Component{
  constructor(props){
    super(props)
    
    this.state = {
      isLoading: true,
      token: '',
      user_id: this.props.store.getUserId(),
      userDetails : '',
      userData : this.props.userData
    }
  }
  componentWillMount(){
    this.setState({isLoading: false})
    console.log("user_id is " + this.state.user_id)
      
      fetch('http://localhost:5000/api/user/' + this.state.user_id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(res => res.json())
      .then(res => {
        this.setState({userDetails : res})
        // console.log("user is" + this.state.user);
        return this.state.userDetails;
      })
    }
  render(){
    const user = this.state.userDetails;
    return (
      <Card small className="mb-4 pt-3">
        <CardHeader className="border-bottom text-center">
          <div className="mb-3 mx-auto">
            <img
              className="rounded-circle"
              src={this.state.userData.avatar}
              alt={user.firstname}
              width="110"
            />
          </div>
          <h4 className="mb-0">{user.firstname} {user.lastname}</h4>
          <span className="text-muted d-block mb-2"></span>
          <Button pill outline size="sm" className="mb-2">
            <i className="material-icons mr-1">person_add</i> Follow
          </Button>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="px-4">
            <div className="progress-wrapper">
              <strong className="text-muted d-block mb-2">
                {this.state.userData.performanceReportTitle}
              </strong>
              <Progress
                className="progress-sm"
                value={this.state.userData.performanceReportValue}
              >
                <span className="progress-value">
                  {this.state.userData.performanceReportValue}%
                </span>
              </Progress>
            </div>
          </ListGroupItem>
          <ListGroupItem className="p-4">
            <strong className="text-muted d-block mb-2">
              {this.state.userData.metaTitle}
            </strong>
            <span>{user.description}</span>
          </ListGroupItem>
        </ListGroup>
      </Card>
      );
  }
}


UserDetails.propTypes = {
  /**
   * The user details object.
   */
  userData: PropTypes.object
};

UserDetails.defaultProps = {
  userData: {
    avatar: require("./../../images/avatars/1.svg"),
    performanceReportTitle: "Profile Completion",
    performanceReportValue: 74,
    metaTitle: "Description"
  }
};

export default UserDetails;
