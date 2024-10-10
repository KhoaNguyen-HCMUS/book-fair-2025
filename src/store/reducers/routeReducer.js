const initState = {
  // users: [
  //   {
  //     id: 1,
  //     name: 'Anh Khoa',
  //     pass: '123456',
  //   },
  // ],
  books: [
    {
      id: '1',
      name: 'Cánh đồng bất tận',
      author: 'Nguyễn Ngọc Tư',
      category: 'Truyện ngắn',
      publisher: 'Nhà Xuất Bản Trẻ',
      price: '150000',
    },
    {
      id: '2',
      name: 'Cho tôi xin một vé đi tuổi thơ',
      author: 'Nguyễn Nhật Ánh',
      category: 'Truyện thiếu nhi',
      publisher: 'Nhà Xuất Bản Kim Đồng',
      price: '120000',
    },
    {
      id: '3',
      name: 'Mắt biếc',
      author: 'Nguyễn Nhật Ánh',
      category: 'Tiểu thuyết',
      publisher: 'Nhà Xuất Bản Trẻ',
      price: '180000',
    },
    {
      id: '4',
      name: 'Nỗi buồn chiến tranh',
      author: 'Bảo Ninh',
      category: 'Tiểu thuyết',
      publisher: 'Nhà Xuất Bản Hội Nhà Văn',
      price: '160000',
    },
    {
      id: '5',
      name: 'Dế Mèn phiêu lưu ký',
      author: 'Tô Hoài',
      category: 'Truyện thiếu nhi',
      publisher: 'Nhà Xuất Bản Kim Đồng',
      price: '170000',
    },
    {
      id: '6',
      name: 'Hà Nội băm sáu phố phường',
      author: 'Thạch Lam',
      category: 'Tùy bút',
      publisher: 'Nhà Xuất Bản Văn học',
      price: '130000',
    },
    {
      id: '7',
      name: 'Tắt đèn',
      author: 'Ngô Tất Tố',
      category: 'Tiểu thuyết',
      publisher: 'Nhà Xuất Bản Văn học',
      price: '140000',
    },
    {
      id: '8',
      name: 'Giông tố',
      author: 'Vũ Trọng Phụng',
      category: 'Tiểu thuyết',
      publisher: 'Nhà Xuất Bản Hội Nhà Văn',
      price: '150000',
    },
    {
      id: '9',
      name: 'Số đỏ',
      author: 'Vũ Trọng Phụng',
      category: 'Tiểu thuyết',
      publisher: 'Nhà Xuất Bản Hội Nhà Văn',
      price: '160000',
    },
    {
      id: '10',
      name: 'Chí Phèo',
      author: 'Nam Cao',
      category: 'Truyện ngắn',
      publisher: 'Nhà Xuất Bản Văn học',
      price: '110000',
    },
    {
      id: '11',
      name: 'Vợ nhặt',
      author: 'Kim Lân',
      category: 'Truyện ngắn',
      publisher: 'Nhà Xuất Bản Trẻ',
      price: '100000',
    },
    {
      id: '12',
      name: 'Hai đứa trẻ',
      author: 'Thạch Lam',
      category: 'Truyện ngắn',
      publisher: 'Nhà Xuất Bản Văn học',
      price: '120000',
    },
    {
      id: '13',
      name: 'Lão Hạc',
      author: 'Nam Cao',
      category: 'Truyện ngắn',
      publisher: 'Nhà Xuất Bản Văn học',
      price: '130000',
    },
    {
      id: '14',
      name: 'Tắt đèn',
      author: 'Ngô Tất Tố',
      category: 'Tiểu thuyết',
      publisher: 'Nhà Xuất Bản Văn học',
      price: '140000',
    },
    {
      id: '15',
      name: 'Làng',
      author: 'Kim Lân',
      category: 'Truyện ngắn',
      publisher: 'Nhà Xuất Bản Trẻ',
      price: '120000',
    },
    {
      id: '16',
      name: 'Mùa lá rụng trong vườn',
      author: 'Ma Văn Kháng',
      category: 'Tiểu thuyết',
      publisher: 'Nhà Xuất Bản Hội Nhà Văn',
      price: '150000',
    },
    {
      id: '17',
      name: 'Đất rừng phương Nam',
      author: 'Đoàn Giỏi',
      category: 'Tiểu thuyết',
      publisher: 'Nhà Xuất Bản Trẻ',
      price: '110000',
    },
    {
      id: '18',
      name: 'Người lái đò Sông Đà',
      author: 'Nguyễn Tuân',
      category: 'Tùy bút',
      publisher: 'Nhà Xuất Bản Văn học',
      price: '130000',
    },
    {
      id: '19',
      name: 'Tắt đèn',
      author: 'Ngô Tất Tố',
      category: 'Tiểu thuyết',
      publisher: 'Nhà Xuất Bản Văn học',
      price: '140000',
    },
    {
      id: '20',
      name: 'Đất nước đứng lên',
      author: 'Nguyễn Trung Thành',
      category: 'Tiểu thuyết',
      publisher: 'Nhà Xuất Bản Văn học',
      price: '150000',
    },
    {
      id: '21',
      name: 'Mùa hoa cải bên sông',
      author: 'Nguyễn Quang Thiều',
      category: 'Truyện ngắn',
      publisher: 'Nhà Xuất Bản Trẻ',
      price: '110000',
    },
    {
      id: '22',
      name: 'Biển đảo quê hương',
      author: 'Nguyễn Ngọc',
      category: 'Tùy bút',
      publisher: 'Nhà Xuất Bản Kim Đồng',
      price: '120000',
    },
    {
      id: '23',
      name: 'Đất nước mến yêu',
      author: 'Nguyễn Khoa Điềm',
      category: 'Thơ',
      publisher: 'Nhà Xuất Bản Hội Nhà Văn',
      price: '140000',
    },
    {
      id: '24',
      name: 'Hà Nội băm sáu phố phường',
      author: 'Thạch Lam',
      category: 'Tùy bút',
      publisher: 'Nhà Xuất Bản Văn học',
      price: '130000',
    },
    {
      id: '25',
      name: 'Sống mòn',
      author: 'Nam Cao',
      category: 'Tiểu thuyết',
      publisher: 'Nhà Xuất Bản Văn học',
      price: '150000',
    },
    {
      id: '26',
      name: 'Truyện Kiều',
      author: 'Nguyễn Du',
      category: 'Thơ',
      publisher: 'Nhà Xuất Bản Văn học',
      price: '180000',
    },
    {
      id: '27',
      name: 'Áo trắng',
      author: 'Nguyễn Thị Minh Ngọc',
      category: 'Truyện ngắn',
      publisher: 'Nhà Xuất Bản Trẻ',
      price: '160000',
    },
    {
      id: '28',
      name: 'Một chuyến về quê',
      author: 'Nguyễn Nhật Ánh',
      category: 'Truyện thiếu nhi',
      publisher: 'Nhà Xuất Bản Kim Đồng',
      price: '170000',
    },
    {
      id: '29',
      name: 'Cửa sổ mở rộng',
      author: 'Nguyễn Quang Sáng',
      category: 'Truyện ngắn',
      publisher: 'Nhà Xuất Bản Trẻ',
      price: '180000',
    },
    {
      id: '30',
      name: 'Núi non hùng vĩ',
      author: 'Tô Hoài',
      category: 'Tiểu thuyết',
      publisher: 'Nhà Xuất Bản Văn học',
      price: '160000',
    },
  ],
};

const rootReducer = (state = initState, action) => {
  switch (action.type) {
    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter((book) => book.id !== action.payload),
      };
    case 'ADD_BOOK':
      return {
        ...state,
        books: [...state.books, action.payload],
      };
    case 'EDIT_BOOK':
      return {
        ...state,
        books: state.books.map((book) => (book.id === action.payload.id ? action.payload : book)),
      };
    case 'TOGGLE_SELECT_BOOK':
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload ? { ...book, selected: !book.selected } : book
        ),
      };
    default:
      return state;
  }
};

export default rootReducer;
