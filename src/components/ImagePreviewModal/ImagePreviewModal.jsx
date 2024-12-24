import React from 'react';
import { Modal } from 'react-bootstrap';
import './ImagePreviewModal.scss';

const ImagePreviewModal = ({ show, image, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Body>
        <img src={image} alt="Preview" className="image-preview" />
      </Modal.Body>
    </Modal>
  );
};

export default ImagePreviewModal;
