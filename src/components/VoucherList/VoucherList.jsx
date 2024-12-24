// Scroll danh sách cửa hàng có sản phẩm trong page Product Detail
import React from 'react';
import './VoucherList.scss';
import logoVoucher from '../../assets/logo/voucher.png'
// import { saveVoucher } from '../../redux/actions/userActions';
// import { useDispatch, useSelector } from 'react-redux';

const VoucherList = ({ vouchers, handleSaveVoucher }) => {

  return (
    <div className="infor-right-voucher-display">
      <h2 className='voucher-title'>VOUCHER</h2>
      {vouchers && vouchers.length > 0 ? (
        vouchers.map((voucher, index) => (
          <div
            key={index}
            className='voucher-item'
          // onClick={() => onSelectStore(store)}
          >
            <div className="left-container">
              <img src={logoVoucher} alt='Ảnh Voucher' className="voucher-image" />
              <div className="voucher-info">
                <span className="voucher-name">Code: {voucher.code}</span>
                <p className="voucher-discount-percent">Giảm giá: {voucher.discountPercent} %</p>
                <p className="voucher-description">Mô tả: {voucher.description}</p>
              </div>
            </div>
            <div className="right-container">
              {
                voucher.userHas ? ( // User đã lưu
                  <button className='saved' disabled>Đã lưu</button>
                )
                  : (
                    // <button onClick={handleSaveVoucher(voucher.voucherId)}>Lưu</button> => note: Viết ri => Tự động gọi đến component cha => Loop vô hạn luôn trời (ko cần Click mà tự gọi)
                    <button className='unsaved' onClick={() => handleSaveVoucher(voucher.voucherId)}>Lưu</button> // Cách 
                  )
              }
            </div>
          </div>
        ))
      ) : (
        <div className='no-voucher'>Không có voucher</div>
      )}
    </div>
  );
};

export default VoucherList;