import React from "react";
import {
  Form,
  FormControl,
  InputGroup,
  Container,
  Row,
  Col
} from "react-bootstrap";

function CompanySettings() {
  return (
    <Container fluid>
      <Row>
        <Col md={6}>
          <Form.Group controlId="companyId">
            <Form.Label>Company ID</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <svg width="1em" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="text"
                placeholder="apple"
                aria-label="Company ID"
                aria-describedby="basic-addon1"
                style={{ focusBorderColor: "brand.blue" }}
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="companyName">
            <Form.Label>Name</Form.Label>
            <FormControl
              type="text"
              placeholder="Apple"
              style={{ focusBorderColor: "brand.blue" }}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group controlId="emailCompany">
            <Form.Label>Email Address</Form.Label>
            <FormControl
              type="email"
              placeholder="info@apple.com"
              style={{ focusBorderColor: "brand.blue" }}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="companySize">
            <Form.Label>Size</Form.Label>
            <InputGroup>
              <FormControl
                type="number"
                placeholder="6000"
                aria-label="Company Size"
                style={{ focusBorderColor: "brand.blue" }}
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
}

export default CompanySettings;
