import React, { useEffect, useRef } from "react";
import { Button, InputGroup, FormControl, Container } from "react-bootstrap";

export default function Actions() {
  const value = "https://apple.com/cook";

  const profileUrl = useRef(null);

  useEffect(() => {
    if (profileUrl.current) {
      profileUrl.current.focus();
      profileUrl.current.select();
    }
  }, [value]);

  return (
    <Container className="py-3 px-4" style={{ maxWidth: "320px" }}>
      <Button block variant="outline-primary" className="mb-2">
        View Public Profile
      </Button>
      <InputGroup>
        <FormControl
          ref={profileUrl}
          type="url"
          value={value}
          readOnly
          className="text-primary"
          style={{ borderColor: "brand.blue" }}
        />
        <InputGroup.Append>
          <Button
            variant="link"
            onClick={() => {
              navigator.clipboard.writeText(value);
            }}
          >
            <svg width="1.2em" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Container>
  );
}
