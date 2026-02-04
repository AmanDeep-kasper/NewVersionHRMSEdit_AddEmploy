import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import Content from "./Content/Content";
import Sidebar from "./Sidebar/Sidebar";

const Main = () => {
  return (
    <Container fluid className="px-0">
      <Row className="mx-0">
        <Col className="p-0" xs={12} md={4}>
          <Sidebar />
        </Col>
        <Col className="p-0" xs={12} md={8}>
          <Content />
        </Col>
      </Row>
    </Container>
  );
};

export default Main;
