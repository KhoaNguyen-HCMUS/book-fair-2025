import React, { useState, useEffect } from 'react';
import './listRegister.scss';
import { toast } from 'react-toastify';

const ListRegister = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const URL = `${import.meta.env.VITE_DOMAIN}/api/list-register`;
        const response = await fetch(URL);
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          setFilteredData(result.data);
        } else {
          toast.error('Lỗi khi tải danh sách người tham gia');
        }
      } catch {
        toast.error('Đã xảy ra lỗi khi tải danh sách người tham gia');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter(
      (attender) => attender.attender_name.toLowerCase().includes(term) || attender.email.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleFilterProgram = (e) => {
    const program = e.target.value;
    setFilterProgram(program);
    if (program === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((attender) => attender.attendance.some((event) => event.program_id === program));
      setFilteredData(filtered);
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <div className='loading'>Đang tải danh sách người tham gia...</div>;
  }

  return (
    <div className='list-register'>
      <h1 className='title'>Danh sách đăng ký tham gia</h1>
      <div className='controls'>
        <input
          type='text'
          placeholder='Tìm kiếm theo tên hoặc email...'
          value={searchTerm}
          onChange={handleSearch}
          className='search-bar'
        />
        <select value={filterProgram} onChange={handleFilterProgram} className='filter-select'>
          <option value=''>Tất cả chương trình</option>
          <option value='1_KM'>Lễ Khai Mạc</option>
          <option value='2_LSVH'>Talkshow Lịch Sử, Văn Hóa</option>
          <option value='3_NT'>Talkshow Nghệ Thuật</option>
          <option value='4_DN'>Đêm Nhạc</option>
          <option value='5_TV'>Talkshow Tiếng Việt</option>
        </select>
      </div>
      <table className='register-table'>
        <thead>
          <tr>
            <th>Mã người tham gia</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Thời gian đăng ký</th>
            <th>Sự kiện</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((attender) => (
            <tr key={attender.attender_id}>
              <td>{attender.attender_id}</td>
              <td>{attender.attender_name}</td>
              <td>{attender.email}</td>
              <td>{new Date(attender.time_register).toLocaleString()}</td>
              <td>
                <ul>
                  {attender.attendance.map((event) => (
                    <li key={event.id}>{event.program_id}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='pagination-container'>
        <button
          className='pagination-button first-page'
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          Trang đầu
        </button>
        <button
          className='pagination-button'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </button>

        <span className='page-info'>
          Trang {currentPage} / {totalPages}
        </span>

        <button
          className='pagination-button'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau
        </button>
        <button
          className='pagination-button last-page'
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Trang cuối
        </button>
      </div>
    </div>
  );
};

export default ListRegister;
