import React from "react";
import { Container } from "react-bootstrap";

import Actions from "./Actions";
import Data from "./Data";
import Profile from "./Profile";

function Sidebar() {
  return (
    <Container
      as="aside"
      className="flex-grow-1 mr-md-5 mb-5 mb-md-0 bg-white rounded-md border-1 border-brand-light"
      style={{ transform: "translateY(-100px)" }}
    >
      <Profile />
      <Data />
      <Actions />
    </Container>
  );
}

export default Sidebar;
