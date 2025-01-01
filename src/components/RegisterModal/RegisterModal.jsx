import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './RegisterModal.scss';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { hideRegisterModal, showLoginModal } from '../../redux/actions/modalActions';
import { registerNewUser } from '../../redux/actions/authActions';

const RegisterModal = () => {
  const dispatch = useDispatch();
  const registerNewUserSuccess = useSelector((state) => {
    return state.auth.registerNewUserSuccess;
  })
  const showModalRegister = useSelector((state) => state.modal.isRegisterModalVisible); // Lấy trạng thái từ Redux

  const [fullname, setFullname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Show eye icon
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const defaultValidInput = {
    isValidFullname: true,
    isValidPhonenumber: true,
    isValidAddress: true,
    isValidEmail: true,
    isValidPassword: true,
    isValidConfirmPassword: true,
  };
  const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);
  // Reset lại dữ liệu input
  const resetInputs = () => {
    setFullname("");
    setPhonenumber("");
    setAddress("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setObjCheckInput(defaultValidInput);
  }

  const checkValidInputs = () => {
    let objCheckValidInput = { ...defaultValidInput };
    if (!fullname) {
      objCheckValidInput.isValidFullname = false;
    }
    if (!phonenumber) {
      objCheckValidInput.isValidPhonenumber = false;
    }
    if (!address) {
      objCheckValidInput.isValidAddress = false;
    }
    if (!email) {
      objCheckValidInput.isValidEmail = false;
    }
    if (!password) {
      objCheckValidInput.isValidPassword = false;
    }
    if (!confirmPassword) {
      objCheckValidInput.isValidConfirmPassword = false;
    }
    setObjCheckInput({ ...objCheckValidInput });
    const hasInvalidInput = Object.values(objCheckValidInput).some(value => value === false);
    return !hasInvalidInput;
  }

  const handleRegister = () => {
    let isValidInputs = checkValidInputs();
    if (isValidInputs) {
      if (password !== confirmPassword) {
        toast.error("Vui lòng nhập đúng mật khẩu xác nhận!");
      } else {
        dispatch(registerNewUser(fullname, password, phonenumber, email, address));
      }
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin!");
    }
  }
  // Theo dõi sự thay đổi của registerNewUserSuccess
  useEffect(() => {
    if (registerNewUserSuccess) {
      resetInputs();
      dispatch(hideRegisterModal());
      dispatch(showLoginModal());
    }
  }, [registerNewUserSuccess, dispatch]);

  return (
    <Modal
      show={showModalRegister}
      onHide={() => {
        resetInputs();
        dispatch(hideRegisterModal());
      }}
      centered
      dialogClassName="custom-modal-register"
      animation={false}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title className='title-bold'>ĐĂNG KÝ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-register">
          <div className="container">
            <div className="form-register-input">
              <input
                type="text"
                placeholder='Họ tên'
                value={fullname}
                onChange={(event) => setFullname(event.target.value)}
                className={objCheckInput.isValidFullname ? 'form-control' : 'form-control is-invalid'}
              />
              <input
                type="text"
                placeholder='Số điện thoại'
                value={phonenumber}
                onChange={(event) => setPhonenumber(event.target.value)}
                className={objCheckInput.isValidPhonenumber ? 'form-control' : 'form-control is-invalid'}
              />
              <input
                type="text"
                placeholder='Địa chỉ'
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className={objCheckInput.isValidAddress ? 'form-control' : 'form-control is-invalid'}
              />
              <input
                type="email"
                placeholder='Email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={objCheckInput.isValidEmail ? 'form-control' : 'form-control is-invalid'}
              />
              {/* <input
                type="password"
                placeholder='Password'
                value={password}
                className={objCheckInput.isValidPassword ? 'form-control' : 'form-control is-invalid'}
                onChange={(event) => setPassword(event.target.value)}
              />
              <input
                type="password"
                placeholder='Nhập lại mật khẩu'
                value={confirmPassword}
                className={objCheckInput.isValidConfirmPassword ? 'form-control' : 'form-control is-invalid'}
                onChange={(event) => setConfirmPassword(event.target.value)}
              /> */}
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Mật khẩu'
                  value={password}
                  className={objCheckInput.isValidPassword ? 'form-control' : 'form-control is-invalid'}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                      <i className="fa fa-eye-slash" aria-hidden="true"></i>
                    ) : (
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    )}
                </span>
              </div>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Nhập lại mật khẩu'
                  value={confirmPassword}
                  className={objCheckInput.isValidConfirmPassword ? 'form-control' : 'form-control is-invalid'}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                      <i className="fa fa-eye-slash" aria-hidden="true"></i>
                    ) : (
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    )}
                </span>
              </div>
            </div>
            <button className='btn btn-danger' onClick={handleRegister}>Đăng ký</button>
            <div className="click-register">
              <p>Bạn đã có tài khoản?</p>
              <button onClick={() => {
                resetInputs();
                dispatch(hideRegisterModal());
                dispatch(showLoginModal());
              }}>Đăng nhập ngay</button>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(hideRegisterModal())}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RegisterModal;