import React from "react";
import { Container, ListGroup } from "react-bootstrap";

const list = [
  {
    id: 1,
    name: "Opportunities applied",
    value: 32,
    color: "yellow"
  },
  {
    id: 2,
    name: "Opportunities won",
    value: 26,
    color: "green"
  },
  {
    id: 3,
    name: "Current opportunities",
    value: 6,
    color: "cadet"
  }
];

function Data() {
  return (
    <Container as="ul" className="p-0">
      {list.map((item) => (
        <ListGroup.Item
          key={item.id}
          as="li"
          className="d-flex align-items-center justify-content-between border-bottom-1"
        >
          <span className="text-brand-dark">{item.name}</span>
          <span className={`font-weight-bold text-brand-${item.color}`}>
            {item.value}
          </span>
        </ListGroup.Item>
      ))}
    </Container>
  );
}

export default Data;
