import React, { useState, useEffect } from 'react';
import PacmanLoader from 'react-spinners/PacmanLoader';

const Loading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 15000); // Giả lập dữ liệu được tải trong 3 giây
  }, []);

  return (
    <div>
      {loading ? (
        <div className="spinner">
          <PacmanLoader size={20} color={"#ff0000"} loading={loading} />
        </div>
      ) : (
        <div>
          <h1>Dữ liệu đã tải xong</h1>
        </div>
      )}
    </div>
  );
};

export default Loading;
