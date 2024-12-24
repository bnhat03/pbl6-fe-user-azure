import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import './ForgetPasswordModal.scss';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { sendOTP, verifyOTP } from '../../redux/actions/authActions';
const ForgetPasswordModal = ({ showModalForgetPassword, hideForgetPasswordModal }) => {
  const dispatch = useDispatch();
  const isSentOTP = useSelector((state) => {
    return state.auth.isSentOTP;
  })
  const isVerifyOTPSuccess = useSelector((state) => {
    return state.auth.isVerifyOTPSuccess;
  })
  const [email, setEmail] = useState('');
  const [OTP, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidOTP, setIsValidOTP] = useState(true);
  const [isValidNewPassword, setIsValidNewPassword] = useState(true);
  // const [isSendingOTP, setIsSendingOTP] = useState(false);

  const handleSendOTP = () => {
    if (!email) {
      setIsValidEmail(false);
      toast.error("Vui lòng nhập email.");
      return;
    }
    else {
      dispatch(sendOTP(email));
    }
  }
  const handleVerifyOTP = () => {
    if (!OTP || !newPassword) {
      setIsValidOTP(false);
      setIsValidNewPassword(false);
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    else {
      dispatch(verifyOTP(email, OTP, newPassword));
    }
  };

  const resetInputs = () => {
    setEmail('');
    setOTP('');
    setNewPassword('');
    setIsValidEmail(true);
    setIsValidOTP(true);
    setIsValidNewPassword(true);
  };
  useEffect(() => {
    if (isVerifyOTPSuccess) {
      resetInputs();
      hideForgetPasswordModal();
    }
  }, [isVerifyOTPSuccess, dispatch]);
  return (
    <Modal
      show={showModalForgetPassword}
      onHide={() => {
        resetInputs();
        hideForgetPasswordModal();
      }}
      centered
      dialogClassName="custom-modal-forget-password"
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className="title-bold">QUÊN MẬT KHẨU</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-forget-password">
          <div className="container">
            {
              isSentOTP === false ? (
                <>
                  <div className="form-forget-password-input">
                    <input
                      type="email"
                      placeholder="Nhập email của bạn"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setIsValidEmail(true); // Reset validation on input change
                      }}
                      className={isValidEmail ? 'form-control' : 'form-control is-invalid'}
                    />
                  </div>
                  <button className="btn btn-danger mt-3" onClick={handleSendOTP}>
                    GỬI OTP
                  </button>
                </>
              )
                : (
                  <>
                    <div className="form-forget-password-input">
                      <input
                        type="text"
                        placeholder="Mã OTP trong email"
                        value={OTP}
                        onChange={(event) => {
                          setOTP(event.target.value);
                          setIsValidOTP(true);
                        }}
                        className={isValidOTP ? 'form-control' : 'form-control is-invalid'}
                      />
                      <input
                        type="password"
                        placeholder='Mật khẩu mới'
                        value={newPassword}
                        className={isValidNewPassword ? 'form-control' : 'form-control is-invalid'}
                        onChange={(event) => {
                          setNewPassword(event.target.value);
                          setIsValidNewPassword(true);
                        }}
                      />
                    </div>
                    <button className="btn btn-danger mt-3" onClick={handleVerifyOTP}>
                      XÁC NHẬN
                    </button>
                  </>
                )
            }

          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => hideForgetPasswordModal()}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal >
  );
};

export default ForgetPasswordModal;
