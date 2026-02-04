import React, { useState, useRef } from "react";
import { Button, Container, Modal, Badge, Image } from "react-bootstrap";

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const profileImage = useRef(null);

  const openChooseImage = () => {
    profileImage.current.click();
  };

  const changeProfileImage = (event) => {
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
    const selected = event.target.files[0];

    if (selected && ALLOWED_TYPES.includes(selected.type)) {
      let reader = new FileReader();
      reader.onloadend = () => setUserProfile(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center py-5 border-bottom border-brand-light">
      <Image
        src={userProfile ? userProfile : "/img/tim-cook.jpg"}
        alt="Tim Cook"
        roundedCircle
        className="cursor-pointer"
        onClick={openChooseImage}
      />
      <input
        hidden
        type="file"
        ref={profileImage}
        onChange={changeProfileImage}
      />
      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Something went wrong</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>File not supported!</p>
          <div className="d-flex align-items-center mt-2">
            <span className="text-brand-cadet font-size-sm mr-1">
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
      <div className="text-center mt-3">
        <h3 className="text-brand-dark">Tim Cook</h3>
        <p className="text-brand-gray font-size-sm">CEO of Apple</p>
      </div>
    </Container>
  );
}

export default Profile;
