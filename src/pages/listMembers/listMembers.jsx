import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

import './listMembers.scss';

const categories = {
  'Vai trò': ['BTC', 'CTV'],
  'Sắp xếp': ['Tăng dần', 'Giảm dần'],
  'Hiệu suất': ['Đạt KPI'],
};
function ListMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState({});

  const [filteredResults, setFilteredResults] = useState([]);

  const indexOfLastMember = currentPage * itemsPerPage;
  const indexOfFirstMember = indexOfLastMember - itemsPerPage;
  const currentMembers =
    filteredResults.length > 0
      ? filteredResults.slice(indexOfFirstMember, indexOfLastMember)
      : members.slice(indexOfFirstMember, indexOfLastMember);

  // Update the totalPages calculation
  const totalPages = Math.ceil((filteredResults.length > 0 ? filteredResults : members).length / itemsPerPage);

  const toggleFilter = (category, item) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (!newFilters[category]) newFilters[category] = [];

      if (category === 'Sắp xếp') {
        // For sorting, only allow one selection
        newFilters[category] = newFilters[category].includes(item) ? [] : [item];
      } else {
        if (newFilters[category].includes(item)) {
          newFilters[category] = newFilters[category].filter((i) => i !== item);
          if (newFilters[category].length === 0) {
            delete newFilters[category];
          }
        } else {
          newFilters[category] = [...(newFilters[category] || []), item];
        }
      }

      return newFilters;
    });
  };

  useEffect(() => {
    let membersToShow = filteredMembers.length > 0 ? filteredMembers : members;

    if (Object.keys(selectedFilters).length > 0) {
      // First pass: Filter by role
      if (selectedFilters['Vai trò']?.length > 0) {
        membersToShow = membersToShow.filter((member) => {
          const isCtv = member.id_member.slice(-3).toUpperCase() === 'CTV';
          const memberRole = isCtv ? 'CTV' : 'BTC';
          return selectedFilters['Vai trò'].includes(memberRole);
        });
      }

      // Second pass: Filter by KPI
      if (selectedFilters['Hiệu suất']?.includes('Đạt KPI')) {
        const kpiMembers = membersToShow.filter((member) => (member.count_books || 0) >= 50);

        if (kpiMembers.length === 0) {
          toast.error('Không có thành viên nào đạt KPI trong nhóm đã chọn');
          // Remove the KPI filter
          setSelectedFilters((prev) => {
            const newFilters = { ...prev };
            delete newFilters['Hiệu suất'];
            return newFilters;
          });
          return;
        }
        membersToShow = kpiMembers;
      }

      // Finally: Apply sorting
      if (selectedFilters['Sắp xếp']?.length > 0) {
        membersToShow.sort((a, b) => {
          const countA = a.count_books || 0;
          const countB = b.count_books || 0;
          return selectedFilters['Sắp xếp'].includes('Tăng dần') ? countA - countB : countB - countA;
        });
      }
    }

    setFilteredResults(membersToShow);
  }, [selectedFilters, members, filteredMembers]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const calcPercent = (current, target) => {
    if (target === 0) return 0;
    return ((current / target) * 100).toFixed(1);
  };

  const handleRowClick = (member) => {
    navigate(`/memberDetail/${member.id_member}`, {
      state: { member },
    });
  };

  const fetchMembers = async () => {
    try {
      const URL = `${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_API_LOGIN}`;
      const response = await fetch(URL);
      const result = await response.json();

      if (result.success) {
        setMembers(result.data);
      } else {
        toast.error('Error fetching members');
      }
    } catch {
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
      <div className='filter-container'>
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className='filter-group'>
            <h3 className='filter-title'>{category}</h3>
            <div className='filter-options'>
              {items.map((item) => (
                <button
                  key={item}
                  className={`filter-button ${selectedFilters[category]?.includes(item) ? 'active' : ''}`}
                  onClick={() => toggleFilter(category, item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <table className='members-table'>
        <thead>
          <tr>
            <th>STT</th>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Vai trò</th>
            <th>Số sách</th>
            <th>% Hoàn Thành</th>
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
              <td>{calcPercent(member.count_books, 50)}%</td>
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
