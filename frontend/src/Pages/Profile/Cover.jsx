import React, { useRef, useState } from "react";
import { Badge, Button, Image, Modal } from "react-bootstrap";

export default function Cover() {
  const [coverImage, setCoverImage] = useState(null);
  const inputRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openChooseFile = () => {
    inputRef.current.click();
  };

  const handleChangeCover = (event) => {
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
    const selected = event.target.files[0];

    if (selected && ALLOWED_TYPES.includes(selected.type)) {
      let reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <div style={{ height: "60px", position: "relative", overflow: "hidden" }}>
      <Image
        fluid
        src={coverImage ? coverImage : "/img/cover.jpg"}
        alt="Cover"
        style={{ objectFit: "cover" }}
      />
      <Button
        onClick={openChooseFile}
        style={{ position: "absolute", top: "4px", right: "4px" }}
        variant="link"
      >
        <svg width="1.2em" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
          />
        </svg>
        <span style={{ marginLeft: "2px" }}>Change Cover</span>
        <input ref={inputRef} type="file" onChange={handleChangeCover} hidden />
      </Button>
      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Something went wrong</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>File not supported!</p>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "2px" }}
          >
            <span style={{ color: "brand.cadet", fontSize: "12px" }}>
              Supported types:
            </span>
            <Badge variant="green">PNG</Badge>
            <Badge variant="green">JPG</Badge>
            <Badge variant="green">JPEG</Badge>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
