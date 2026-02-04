

import React from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";

function AccountSettings() {
  return (
    <Container fluid>
      <Row>
        <Col md={6}>
          <Form.Group controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="Tim" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Cook" />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group controlId="phoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <InputGroup>
              <InputGroup.Text id="basic-addon1">(</InputGroup.Text>
              <Form.Control
                type="tel"
                placeholder="408) 996–1010"
                aria-label="Phone Number"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="emailAddress">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="tcook@apple.com" />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control as="select" placeholder="Select city">
              <option value="california">California</option>
              <option value="washington">Washington</option>
              <option value="toronto">Toronto</option>
              <option value="newyork" selected>
                New York
              </option>
              <option value="london">London</option>
              <option value="netherlands">Netherlands</option>
              <option value="poland">Poland</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control as="select" placeholder="Select country">
              <option value="america" selected>
                America
              </option>
              <option value="england">England</option>
              <option value="poland">Poland</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
}

export default AccountSettings;
