import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAccount } from '../../redux/actions/authActions';
import AddPhoneNumberModal from '../AddPhoneNumberModal/AddPhoneNumberModal';
const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const showModalAddPhoneNumber = useSelector((state) => state.modal.isAddPhoneModalVisible); // Lấy trạng thái từ Redux
  // const [showAddPhoneNumber, setShowAddPhoneNumber] = useState(false); // Hiển thị Modal Add phonenumber
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      try {
        localStorage.setItem('token', token);
        console.log('Token saved to localStorage:', token);
        dispatch(getUserAccount());
        navigate('/');
        // setShowAddPhoneNumber(true);
      } catch (error) {
        console.error('Failed to save token:', error);
      }
    } else {
      console.warn('No token found in URL.');
      navigate('/login');
    }
  }, [dispatch, location.search, navigate]);
  
  // return <div>Redirecting...</div>;
  return <div>
      Redirecting...
    </div>;
};

export default OAuth2RedirectHandler;
