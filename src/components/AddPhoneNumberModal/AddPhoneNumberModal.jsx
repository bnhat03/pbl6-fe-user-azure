import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import './AddPhoneNumberModal.scss';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { hideAddPhoneNumberModal } from "../../redux/actions/modalActions";
import { addPhoneNumber } from '../../redux/actions/authActions';
const AddPhoneNumberModal = () => {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const showModalAddPhoneNumber = useSelector((state) => state.modal.isAddPhoneModalVisible); // Lấy trạng thái từ Redux
  const isAddPhoneNumberSuccess = useSelector((state) => {
      return state.auth.isAddPhoneNumberSuccess;
    })
  const resetInputs = () => {
    setPhoneNumber("");
  }
  const handleSendPhoneNumber = () => {
    if (!phoneNumber) {
      toast.error("Vui lòng nhập số điện thoại.");
      return;
    }
    else {
      dispatch(addPhoneNumber(phoneNumber));
    }
  }
  useEffect(() => {
    if (isAddPhoneNumberSuccess) {
      resetInputs();
      dispatch(hideAddPhoneNumberModal());
    }
  }, [isAddPhoneNumberSuccess, dispatch]);
  return (
    <Modal
      show={showModalAddPhoneNumber}
      onHide={() => { 
        dispatch(hideAddPhoneNumberModal());
        resetInputs();
      }}
      centered
      dialogClassName="custom-modal-add-phonenumber"
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className="title-bold">THÊM SỐ ĐIỆN THOẠI</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-add-phonenumber">
          <div className="container">
            <div className="form-add-phonenumber-input">
              <input
                type="text"
                placeholder="Nhập số điện thoại của bạn"
                value={phoneNumber}
                onChange={(event) => {
                  setPhoneNumber(event.target.value);
                }}
                className='form-control'
              />
            </div>
            <button className="btn btn-danger mt-3" onClick={handleSendPhoneNumber}>
              THÊM SỐ ĐIỆN THOẠI
            </button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => hideAddPhoneNumberModal()}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal >
  );
};

export default AddPhoneNumberModal;
