import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

import './listMembers.scss';

function ListMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const navigate = useNavigate();

  const indexOfLastMember = currentPage * itemsPerPage;
  const indexOfFirstMember = indexOfLastMember - itemsPerPage;
  const currentMembers = (filteredMembers.length > 0 ? filteredMembers : members).slice(
    indexOfFirstMember,
    indexOfLastMember
  );

  const totalPages = Math.ceil((filteredMembers.length > 0 ? filteredMembers : members).length / itemsPerPage);

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleRowClick = (member) => {
    navigate(`/memberDetail/${member.id_member}`, {
      state: { member },
    });
  };

  const fetchMembers = async () => {
    try {
      const URL = `${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_API_LOGIN}`;
      const response = await fetch(URL);
      const result = await response.json();

      if (result.success) {
        setMembers(result.data);
      } else {
        toast.error('Error fetching members');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error fetching members');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const filtered = members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        member.id_member.toLowerCase().includes(searchInput.toLowerCase())
    );

    setFilteredMembers(filtered);
    if (filtered.length === 0) {
      toast.error('Member not found');
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setFilteredMembers([]);
  };

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Đang tải dữ liệu</div>;
  }

  return (
    <div className='list-members'>
      <form onSubmit={handleSearchSubmit} className='search-container'>
        <FaSearch className='search-icon' />

        <input
          type='text'
          placeholder='Tìm kiếm theo tên hoặc ID'
          className='search-input'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <button type='button' className='clear-button' onClick={handleClearSearch}>
          X
        </button>
      </form>

      <table className='members-table'>
        <thead>
          <tr>
            <th>STT</th>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Vai trò</th>
            <th>Số sách</th>
          </tr>
        </thead>
        <tbody>
          {currentMembers.map((member, index) => (
            <tr className='member-row' key={member.id_member} onClick={() => handleRowClick(member)}>
              <td>{indexOfFirstMember + index + 1}</td>
              <td>{member.id_member}</td>
              <td>{member.name}</td>
              <td>{member.role}</td>
              <td> {member.count_books || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='pagination-container'>
        <button
          className='pagination-button first-page'
          onClick={() => handlePaginationClick(1)}
          disabled={currentPage === 1}
        >
          Trang đầu
        </button>
        <button
          className='pagination-button'
          onClick={() => handlePaginationClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </button>

        <span className='page-info'>
          Trang {currentPage} / {totalPages}
        </span>

        <button
          className='pagination-button'
          onClick={() => handlePaginationClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau
        </button>
      </div>
    </div>
  );
}

export default ListMembers;
