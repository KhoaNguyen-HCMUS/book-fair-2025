import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

import './listMembers.scss';

const FILTER_CATEGORIES = {
  role: { title: 'Vai trò', options: ['BTC', 'CTV'] },
  sort: { title: 'Sắp xếp', options: ['Tăng dần', 'Giảm dần'] },
  performance: { title: 'Hiệu suất', options: ['Đạt KPI'] },
};

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const navigate = useNavigate();

  // Fetch members once
  useEffect(() => {
    async function fetchMembers() {
      try {
        const URL = `${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_API_LOGIN}`;
        const res = await fetch(URL);
        const result = await res.json();
        if (result.success) {
          // Map snake_case to camelCase
          setMembers(result.data);
        } else {
          toast.error('Error fetching members');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error fetching members');
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  // Reset to first page when inputs change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput, selectedFilters]);

  // Compute filtered and sorted list
  const filteredAndSorted = useMemo(() => {
    let list = [...members];

    // Search filter
    if (searchInput.trim()) {
      const term = searchInput.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(term) || m.id_member.toLowerCase().includes(term));
    }

    // Role filter using isCtv
    if (selectedFilters.role?.length) {
      list = list.filter((m) => {
        const isCtv = m.id_member.slice(-3).toUpperCase() === 'CTV';
        const memberRole = isCtv ? 'CTV' : 'BTC';
        return selectedFilters.role.includes(memberRole);
      });
    }

    // Performance filter
    if (selectedFilters.performance?.includes('Đạt KPI')) {
      const kpiList = list.filter((m) => m.count_books >= 50);
      if (kpiList.length === 0) {
        toast.error('Không có thành viên nào đạt KPI trong nhóm đã chọn');
        setSelectedFilters((prev) => {
          const nf = { ...prev };
          delete nf.performance;
          return nf;
        });
        return list;
      }
      list = kpiList;
    }

    // Sorting (mutually exclusive)
    if (selectedFilters.sort?.length) {
      const asc = selectedFilters.sort.includes('Tăng dần');
      list = [...list].sort((a, b) => (asc ? a.count_books - b.count_books : b.count_books - a.count_books));
    }

    return list;
  }, [members, searchInput, selectedFilters]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage) || 1;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentMembers = filteredAndSorted.slice(startIdx, startIdx + itemsPerPage);

  // Handlers
  const toggleFilter = (category, option) => {
    setSelectedFilters((prev) => {
      const nm = { ...prev };
      if (category === 'sort') {
        const isSelected = nm.sort?.includes(option);
        if (isSelected) {
          delete nm.sort;
        } else {
          nm.sort = [option];
        }
      } else {
        if (!nm[category]) nm[category] = [];
        const exists = nm[category].includes(option);
        nm[category] = exists ? nm[category].filter((o) => o !== option) : [...nm[category], option];
        if (nm[category].length === 0) delete nm[category];
      }
      return nm;
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleClearSearch = () => setSearchInput('');

  const handleRowClick = (member) => {
    navigate(`/memberDetail/${member.id_member}`, { state: { member } });
  };

  if (loading) return <div className='spinner'>Đang tải dữ liệu...</div>;

  return (
    <div className='list-members'>
      <div className='title'> Danh sách thành viên</div>
      <form onSubmit={handleSearchSubmit} className='search-container'>
        <FaSearch className='search-icon' />
        <input
          type='text'
          placeholder='Tìm kiếm theo tên hoặc ID'
          className='search-input'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {searchInput && (
          <button type='button' className='clear-button' onClick={handleClearSearch}>
            X
          </button>
        )}
      </form>
      <div className='filter-container'>
        {Object.entries(FILTER_CATEGORIES).map(([key, { title, options }]) => (
          <div key={key} className='filter-group'>
            <h3 className='filter-title'>{title}</h3>
            <div className='filter-options'>
              {options.map((opt) => (
                <button
                  key={opt}
                  type='button'
                  className={`filter-button ${selectedFilters[key]?.includes(opt) ? 'active' : ''}`}
                  onClick={() => toggleFilter(key, opt)}
                >
                  {opt}
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
          {currentMembers.map((m, idx) => (
            <tr key={m.id_member} onClick={() => handleRowClick(m)} className='member-row'>
              <td>{startIdx + idx + 1}</td>
              <td>{m.id_member}</td>
              <td>{m.name}</td>
              <td>{m.role}</td>
              <td>{m.count_books}</td>
              <td>{((m.count_books / 50) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      :
      <div className='pagination-container'>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className='pagination-button'>
          Trang đầu
        </button>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className='pagination-button'
        >
          Trước
        </button>
        <span className='page-info'>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className='pagination-button'
        >
          Sau
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className='pagination-button'
        >
          Trang cuối
        </button>
      </div>
    </div>
  );
}
