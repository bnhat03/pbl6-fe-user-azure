import React, { useState, useEffect } from "react";
import './AccountInfo.scss';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from "../../redux/actions/userActions";
import { updateAccountAuth, getUserAccount } from "../../redux/actions/authActions";

const AccountInfo = () => {
  // redux
  const dispatch = useDispatch();
  const accountInfo = useSelector((state) => {
    return state.auth.account;
  });

  // disable/enable các input
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(`data:image/png;base64,${accountInfo.avatar}` || ''); // Preview avatar

  const handleSaveChangeClick = () => {
    setIsEditing(false); // update
    dispatch(updateProfile(fullname, avatarFile, email, address));
    // dispatch(updateAccountAuth(fullname, avatarPreview.slice(22), email, address));
  };

  const handleCancelClick = () => {
    setIsEditing(false); // update
    if (accountInfo) {
      setFullname(accountInfo.fullName || '');
      setPhonenumber(accountInfo.phoneNumber || '');
      setAddress(accountInfo.address || '');
      setEmail(accountInfo.email || '');
      setAvatarPreview(`data:image/png;base64,${accountInfo.avatar}`);
    }
    // setAvatarPreview(`data:image/png;base64,${accountInfo.avatar}`); // Revert avatar if cancel
  };

  const handleEditClick = () => {
    setIsEditing(true); // => disabled
  };

  // state input
  // setState(redux) => Chỉ lấy redux lần đầu thôi 
  // => Nếu redux thay đổi -> state không thay đổi theo
  // -> Cần viết thêm useEffect có dependency = redux => redux thay đổi thì state thay đổi tương ứng
  // -> Bựa dừ cứ tưởng state phụ thuộc theo redux ban đầu thì sau ni vẫn phụ thuộc tiếp
  const [fullname, setFullname] = useState(accountInfo.fullName); // chỉ lấy accountInfo lần đầu
  const [phonenumber, setPhonenumber] = useState(accountInfo.phoneNumber);
  const [address, setAddress] = useState(accountInfo.address);
  const [email, setEmail] = useState(accountInfo.email);
  const [avatarFile, setAvatarFile] = useState(null);

  // Xử lý chọn avatar mới
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file); // Lưu trữ tệp avatar vào state
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result); // Cập nhật preview
      };
      reader.readAsDataURL(file); // Đọc file dưới dạng base64
    }
  };
  // useEffect(() => {
  //   dispatch(getUserAccount());
  // }, [dispatch]);
  // Cập nhật state sau khi accountInfo từ Redux store thay đổi
  useEffect(() => { // Đảm bảo redux thay đổi thì state thay đổi theo luôn (VD: refresh trang)
    if (accountInfo) {
      setFullname(accountInfo.fullName || '');
      setPhonenumber(accountInfo.phoneNumber || '');
      setAddress(accountInfo.address || '');
      setEmail(accountInfo.email || '');
      setAvatarPreview(`data:image/png;base64,${accountInfo.avatar}`);
    }
  }, [accountInfo]);

  return (
    <div className="account-infor">
      <div className="container">
        <div className="account-infor-icon">
          <i className="icon-i fa-regular fa-user"></i>
          <span className='icon-span'>Thông tin chi tiết</span>
        </div>
        <div className="account-infor-content">
          <div className="row py-3">
            {/* Họ tên */}
            <div className="form-group col-md-6">
              <label htmlFor="fullname">Họ tên</label>
              <input
                type="text"
                className="form-control"
                id="fullname"
                value={fullname}
                onChange={(event) => setFullname(event.target.value)}
                disabled={!isEditing}
              />
            </div>
            {/* Địa chỉ */}
            <div className="form-group col-md-6">
              <label htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                className="form-control"
                id="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="row py-3">
            {/* Email */}
            <div className="form-group col-md-6">
              <label htmlFor="exampleInputEmail1">Email</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={!isEditing}
              />
            </div>
            {/* Sđt */}
            <div className="form-group col-md-6">
              <label htmlFor="phonenumber">Số điện thoại</label>
              <input
                type="text"
                className="form-control"
                id="phonenumber"
                value={phonenumber}
                disabled={true}
                // onChange={(event) => setPhonenumber(event.target.value)}
                // disabled={!isEditing}
              />
            </div>
          </div>
          {/* Avatar */}
          <div className="row py-3 d-flex ">
            <div className="form-group col-md-12">
              <label>Avatar</label>
              <div className="avatar-container d-flex align-items-center">
                <div className="avatar-preview mb-3">
                  <img
                    src={avatarPreview}
                    alt="Chưa có hình đại diện"
                    className="img-fluid rounded-circle"
                    width={100}
                    height={100}
                  />
                </div>
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control file-input"
                    onChange={handleAvatarChange}
                  />
                )}
              </div>
            </div>
          </div>

        </div>
        <div className="account-infor-btn">
          {isEditing ? (
            <>
              <button className="btn btn-dark me-3" onClick={handleSaveChangeClick}>
                Lưu thay đổi
              </button>
              <button className="btn btn-danger" onClick={handleCancelClick}>
                Hủy
              </button>
            </>
          ) : (
            <button className="btn btn-dark me-3" onClick={handleEditClick}>
              Cập nhật
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
