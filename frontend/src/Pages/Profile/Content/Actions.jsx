import React from "react";
import { Button, Container } from "react-bootstrap";

function Actions() {
  return (
    <Container
      className="mt-5 py-5 px-8"
      style={{ borderTop: "1px solid #brand.light" }}
    >
      <Button variant="primary">Update</Button>
    </Container>
  );
}

export default Actions;
