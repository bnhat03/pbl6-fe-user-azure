import React, { useState, useEffect } from "react";
import './Combo.scss';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCombos } from "../../redux/actions/productActions";
import Pagination from 'react-bootstrap/Pagination';
import ComboItem from "../../components/ComboItem/ComboItem";
import axios from 'axios';
import PacmanLoader from 'react-spinners/PacmanLoader';

export default function Combo() {
  const dispatch = useDispatch();
  const allCombos = useSelector((state) => state.product.allCombos);
  const isLoading = useSelector((state) => state.product.isLoadingAllCombos);
  // state phân trang
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 8; 
  const totalPages = Math.ceil(allCombos.length / itemsPerPage); 
  // State cho AI + search + select
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermAI, setSearchTermAI] = useState('');
  const [selectedSort, setSelectedSort] = useState("default");
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchAllCombos());
  }, [dispatch]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setActivePage(1); 
  };
  const handleSortChange = (event) => {
    setSelectedSort(event.target.value);
    setActivePage(1);
  };
  // Lọc và sắp xếp sản phẩm theo search (input) + AI(file) và giá (select)
  const filteredProducts = allCombos
    .filter((combo) =>
      combo.comboName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      combo.comboName.toLowerCase().includes(searchTermAI.toLowerCase())
    )
    .sort((a, b) => {
      if (selectedSort === "asc") return a.price - b.price;
      if (selectedSort === "desc") return b.price - a.price;
      return 0;
    });

  // Phân trang
  const currentCombos = filteredProducts.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };
  const handlePrevious = () => {
    if (activePage > 1) {
      setActivePage(activePage - 1);
    }
  };
  const handleNext = () => {
    if (activePage < totalPages) {
      setActivePage(activePage + 1);
    }
  };
  const [previewImage, setPreviewImage] = useState(null);
  // AI file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    return new Promise((resolve, reject) => {
      if (file) {
        const reader = new FileReader(); 
        reader.onloadend = () => {
          const base64String = reader.result.split(",")[1]; 
          resolve(base64String); 
          setPreviewImage(reader.result);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file); 
      } else {
        reject("No file selected");
      }
    });
  };
  const onFileSelected = async (event) => {
    try {
      const base64FileImage = await handleFileChange(event);
      // AI: Tìm product-> upload file
      try {
        let urlAI = import.meta.env.VITE_AI_URL || `http://localhost:5000`;
        const responseAI = await axios.post(`${urlAI}/predict`, {
          image: base64FileImage
        });
        if (responseAI?.data) {
          const nameProduct = responseAI.data;
          // setSearchTermAI(nameProduct);
          setSearchTerm(nameProduct);
        }
      } catch (err) {
        console.error("Error details: ", err);
      }
    } catch (error) {
      console.error("Error converting file to base64:", error);
    }
  };

  return (
    <div className="page-combo">
      <div className="search-filter-container">
        {/* AI */}
        <div className="file-upload-AI-container">
        <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={onFileSelected}
            style={{ display: "none" }}
          />
          <label htmlFor="file-input" className="image-upload-label">
            {
              previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="image-preview"
                />
              ) : (
                <div className="image-upload-placeholder">
                  AI
              </div>
              )
            }
          </label>
        </div>

        <div className="search-container">
          <div className="row">
            <div className="col-md-12">
              <div className="input-group">
                <input
                  className="form-control border-end-0 border"
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Tìm kiếm sản phẩm"
                />

                <span className="input-group-append">
                  <button className="btn btn-outline-secondary bg-white border ms-n5" type="button">
                    <i className="fa fa-search"></i>
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="filter-container">
          <select
            className="form-select"
            value={selectedSort}
            onChange={handleSortChange}
            aria-label="Sort by price"
          >
            <option value="default">Mặc định</option>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
        </div>
      </div>
      {
        isLoading === false ? (
          currentCombos && currentCombos.length > 0 ? (
            <div className="has-products">
              <div className="combo-list-products">
                {
                  currentCombos.map((combo, index) => (
                    <React.Fragment key={index}>
                      <ComboItem combo={combo} />
                      {
                        (index + 1) % 4 === 0 && (index + 1) !== currentCombos.length && <hr className="hr-separate" />
                      }
                    </React.Fragment>
                  ))
                }
              </div>
              {/* Phần phân trang */}
              <div className="pagination-container">
                <Pagination>
                  <Pagination.Prev onClick={handlePrevious} disabled={activePage === 1} />
                  {[...Array(totalPages)].map((_, number) => (
                    <Pagination.Item
                      key={number + 1}
                      active={number + 1 === activePage}
                      onClick={() => handlePageChange(number + 1)}
                    >
                      {number + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={handleNext} disabled={activePage === totalPages} />
                </Pagination>
              </div>
            </div>
          ) : (
            <div className="no-product">Không có sản phẩm</div>
          )
        ) : (
          <div className="loading-container">
            <PacmanLoader size={20} color={"#ff0000"} loading={isLoading} />
            <span className="loading-data">
              Đang tải dữ liệu
            </span>
          </div>
        )
      }
    </div>
  );
}
