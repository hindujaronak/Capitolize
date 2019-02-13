import React from "react";
import { NavItem, NavLink, Badge, Collapse, DropdownItem } from "shards-react";

export default class Chatbot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.toggleNotifications = this.toggleNotifications.bind(this);
  }

  toggleNotifications() {
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    return (
      <NavItem className="border-right dropdown notifications">
        <NavLink
          className="nav-link-icon text-center"
          onClick={this.toggleNotifications}
        >
          <div className="nav-link-icon__wrapper">
            <i className="material-icons">chat_bubble_outline</i>
            <Badge pill theme="danger">
            </Badge>
          </div>
        </NavLink>
        <Collapse
          open={this.state.visible}
          className="dropdown-menu dropdown-menu-small"
        >
          <DropdownItem className="notification__all text-center">
                <iframe 
                    allow="microphone;" 
                    width="375" 
                    height="430" 
                    src="https://console.dialogflow.com/api-client/demo/embedded/7cdf6dce-26d3-4ca6-87a7-6c60dd00a0df"> 
                </iframe>
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }
}
