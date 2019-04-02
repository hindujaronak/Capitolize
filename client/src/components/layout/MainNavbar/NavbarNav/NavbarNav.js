import React from "react";
import { Nav } from "shards-react";

import Notifications from "./Notifications";
import UserActions from "./UserActions";
import Chatbot from "./Chatbot";

export default () => (
  <Nav navbar className="border-left flex-row">
    <UserActions />
    <Notifications />
    <Chatbot />
  </Nav>
);
