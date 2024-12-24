import React, { useState } from "react";
import axios from "axios";
// import { toast } from "react-toastify";
import "./PlaceOrder.scss";

const PlaceOrder = () => {
  const [data, setData] = useState({
    userID: "",
    amount: 1,
    address: "",
  });

  const [orderResponse, setOrderResponse] = useState(null);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

  };

  return (
    <div>
      <form onSubmit={onSubmitHandler} className="place-order">
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input
              type="text"
              placeholder="User ID"
              name="userID"
              value={data.userID}
              onChange={onChangeHandler}
            />
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={data.address}
              onChange={onChangeHandler}
            />
            <input
              type="number"
              placeholder="Amount"
              name="amount"
              value={data.amount}
              onChange={onChangeHandler}
            />
          </div>
        </div>
        <button type="submit">Order</button>
      </form>

      {orderResponse && (
        <div className="order-details">
          <h2>Order Details</h2>
          <p>
            <strong>Order ID:</strong> {orderResponse.order._id}
          </p>
          <p>
            <strong>Amount:</strong> {orderResponse.order.amount}
          </p>
          <p>
            <strong>Address:</strong> {orderResponse.order.address}
          </p>
          <p>
            <strong>Status:</strong> {orderResponse.order.status}
          </p>
          <p>
            <strong>Food Items:</strong>
          </p>
          <ul>
            {Object.entries(orderResponse.foodNames).map(([id, name]) => (
              <li key={id}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
