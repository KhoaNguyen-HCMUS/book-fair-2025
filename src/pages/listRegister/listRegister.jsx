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

  const calculateProgramStats = () => {
    const stats = {
      '1_KM': { registered: 0, checkedIn: 0 },
      '2_LSVH': { registered: 0, checkedIn: 0 },
      '3_TV': { registered: 0, checkedIn: 0 },
      '4_NT': { registered: 0, checkedIn: 0 },
      '5_DN': { registered: 0, checkedIn: 0 },
    };

    data.forEach((attender) => {
      attender.attendance.forEach((event) => {
        if (stats[event.program_id] !== undefined) {
          stats[event.program_id].registered++;
          if (event.attended === 1) {
            stats[event.program_id].checkedIn++;
          }
        }
      });
    });

    return stats;
  };

  const programStats = calculateProgramStats();

  return (
    <div className='list-register'>
      <h1 className='title'>Danh sách đăng ký tham gia</h1>
      <table className='program-stats-table'>
        <thead>
          <tr>
            <th>Chương trình</th>
            <th>Số người đăng ký</th>
            <th>Số người đã check-in</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(programStats).map(([programId, stats]) => (
            <tr key={programId}>
              <td>{programId}</td>
              <td>{stats.registered}</td>
              <td>{stats.checkedIn}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
          <option value='3_TV'>Talkshow Tiếng Việt</option>
          <option value='4_NT'>Talkshow Nghệ Thuật</option>
          <option value='5_DN'>Đêm nhạc</option>
        </select>
      </div>
      <table className='register-table'>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã người tham gia</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Thời gian đăng ký</th>
            <th>Sự kiện</th>
            <th>1_KM</th>
            <th>2_LSVH</th>
            <th>3_TV</th>
            <th>4_NT</th>
            <th>5_DN</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((attender, index) => (
            <tr key={attender.attender_id}>
              <td>{index + 1}</td>
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
              <td>
                {attender.attendance.some((event) => event.program_id === '1_KM')
                  ? attender.attendance.find((event) => event.program_id === '1_KM').attended === 1
                    ? '✅'
                    : '❌'
                  : ''}
              </td>
              <td>
                {attender.attendance.some((event) => event.program_id === '2_LSVH')
                  ? attender.attendance.find((event) => event.program_id === '2_LSVH').attended === 1
                    ? '✅'
                    : '❌'
                  : ''}
              </td>
              <td>
                {attender.attendance.some((event) => event.program_id === '3_TV')
                  ? attender.attendance.find((event) => event.program_id === '3_TV').attended === 1
                    ? '✅'
                    : '❌'
                  : ''}
              </td>
              <td>
                {attender.attendance.some((event) => event.program_id === '4_NT')
                  ? attender.attendance.find((event) => event.program_id === '4_NT').attended === 1
                    ? '✅'
                    : '❌'
                  : ''}
              </td>
              <td>
                {attender.attendance.some((event) => event.program_id === '5_DN')
                  ? attender.attendance.find((event) => event.program_id === '5_DN').attended === 1
                    ? '✅'
                    : '❌'
                  : ''}
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
