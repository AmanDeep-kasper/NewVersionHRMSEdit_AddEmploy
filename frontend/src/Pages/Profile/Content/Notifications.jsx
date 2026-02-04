import React from "react";
import { Form } from "react-bootstrap";

function Notifications() {
  return (
    <Form.Group className="d-flex align-items-center justify-content-between">
      <Form.Label
        htmlFor="notificationEmails"
        className="mb-0 cursor-pointer"
        style={{ userSelect: "none" }}
      >
        Receive notification emails
      </Form.Label>
      <Form.Check
        type="switch"
        id="notificationEmails"
        label=""
        className="ml-2"
      />
    </Form.Group>
  );
}

export default Notifications;
