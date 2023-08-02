import React, { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";

function ShowMsgModal({ message, isOpen, toggle }) {
  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle} style={{ backgroundColor: "#00594F" }}>
          Értesítés
        </ModalHeader>
        <ModalBody style={{ backgroundColor: "#00352F" }}>
            {message}
        </ModalBody>
        <ModalFooter style={{ backgroundColor: "#00594F" }}>
          <Button color="primary" onClick={toggle}>
            Rendben
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ShowMsgModal;
