import React, { useState } from "react";
import { Container, Nav, Tab, Row, Col } from "react-bootstrap";

import AccountSettings from "./AccountSettings";
import Actions from "./Actions";
import CompanySettings from "./CompanySettings";
import Notifications from "./Notifications";

const Content = () => {
  const [activeTab, setActiveTab] = useState("Account Settings");

  const handleTabSelect = (selectedTab) => {
    setActiveTab(selectedTab);
  };

  const tabs = ["Account Settings", "Company Settings", "Notifications"];

  return (
    <Container
      as="main"
      className="flex-3 d-flex flex-column justify-content-between pt-5 bg-white rounded-md border-1 border-gray-200"
      style={{ transform: "translateY(-100px)" }}
    >
      <Nav variant="pills" className="px-5">
        {tabs.map((tab) => (
          <Nav.Item key={tab} className="mx-3 px-0 py-3">
            <Nav.Link
              eventKey={tab}
              active={activeTab === tab}
              onSelect={handleTabSelect}
              className={`font-weight-semibold text-brand-cadet border-bottom-1 ${
                activeTab === tab ? "active" : ""
              }`}
            >
              {tab}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Tab.Content className="px-3 mt-5">
        <Tab.Pane eventKey="Account Settings">
          <AccountSettings />
        </Tab.Pane>
        <Tab.Pane eventKey="Company Settings">
          <CompanySettings />
        </Tab.Pane>
        <Tab.Pane eventKey="Notifications">
          <Notifications />
        </Tab.Pane>
      </Tab.Content>

      <Actions />
    </Container>
  );
};

export default Content;
