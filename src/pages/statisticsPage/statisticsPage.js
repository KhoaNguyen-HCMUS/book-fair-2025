import React, { useState, useEffect } from 'react';
import './statisticsPage.scss';
import { toast } from 'react-toastify';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const StatisticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);

  const genreOptions = [
    'Khoa học xã hội & Nhân văn',
    'Khoa học tự nhiên & Công nghệ',
    'Sách giáo dục & trường học',
    'Văn học Việt Nam',
    'Văn học Nước ngoài',
    'Văn học Nước ngoài biên phiên dịch',
    'Truyện tranh',
    'Khác',
  ];

  const classifyOptions = ['Sách Ký Gửi', 'Sách Quyên Góp', 'Sách Nhà Xuất Bản'];

  const calcPercent = (current, target) => {
    if (target === 0) return 0;
    return ((current / target) * 100).toFixed(2);
  };

  const groupByGenreAndClassify = (books) => {
    const result = {};
    books.forEach((book) => {
      const genre = book.genre || 'Khác';
      const classify = book.classify || 'Khác';

      if (!result[genre]) {
        result[genre] = { consign: 0, donate: 0, publisher: 0 };
      }

      if (classify === 'Sách Ký Gửi') {
        result[genre].consign++;
      } else if (classify === 'Sách Quyên Góp') {
        result[genre].donate++;
      } else if (classify === 'Sách Nhà Xuất Bản') {
        result[genre].publisher++;
      }
    });
    return result;
  };

  useEffect(() => {
    // Fetch data from API
    const fetchBooks = async () => {
      try {
        const URL = process.env.REACT_APP_DOMAIN + process.env.REACT_APP_API_GET_LIST_BOOKS;
        const response = await fetch(URL);

        const result = await response.json();
        if (result.success) {
          setBooks(result.data);
        }
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu!');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Group books by genre and classify
  const booksByGenreAndClassify = groupByGenreAndClassify(books);

  const totalBooks = books.length;
  const targetBooks = 5000;
  const percentage = calcPercent(totalBooks, targetBooks);

  return (
    <div className='statistics-page'>
      <h1>Thống kê</h1>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          {/* Tổng số sách */}
          <div className='statistics-overview'>
            <div className='progress-circle'>
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                  textColor: '#333',
                  pathColor: '#4caf50',
                  trailColor: '#d6d6d6',
                })}
              />
            </div>
            <div className='statistics-content'>
              <p>Tổng số sách: {totalBooks}</p>
              <p>Mục tiêu: {targetBooks}</p>
            </div>
          </div>

          {/* Thống kê theo thể loại và phân loại */}
          <div className='statistics-section'>
            <h2>Thống kê theo thể loại và phân loại</h2>
            <table>
              <thead>
                <tr>
                  <th>Thể loại</th>
                  <th>Sách Ký Gửi</th>
                  <th>Sách Quyên Góp</th>
                  <th>Sách Nhà Xuất Bản</th>
                </tr>
              </thead>
              <tbody>
                {genreOptions.map((genre) => (
                  <tr key={genre}>
                    <td>{genre}</td>
                    <td>{booksByGenreAndClassify[genre]?.consign || 0}</td>
                    <td>{booksByGenreAndClassify[genre]?.donate || 0}</td>
                    <td>{booksByGenreAndClassify[genre]?.publisher || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default StatisticsPage;
