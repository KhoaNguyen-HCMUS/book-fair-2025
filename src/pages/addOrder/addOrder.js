import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import './addOrder.scss';

function AddOrder() {
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch books from the API
  const fetchBooks = async () => {
    try {
      const URL = process.env.REACT_APP_DOMAIN + process.env.REACT_APP_API_GET_LIST_BOOKS;
      const response = await fetch(URL);
      const result = await response.json();
      if (result.success) {
        setBooks(result.data);
      }
    } catch (error) {
      toast.error('Error fetching books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Update total price whenever orderItems change
  useEffect(() => {
    const newTotalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(newTotalPrice);
  }, [orderItems]);

  // Add a book to the order.
  // If it already exists, increase quantity (without exceeding stock).
  const handleAddBook = (book) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id_product === book.id_product);
      if (existingItem) {
        if (existingItem.quantity < book.stock) {
          return prevItems.map((item) =>
            item.id_product === book.id_product ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          toast.error('Cannot add more than available stock!');
          return prevItems;
        }
      } else {
        return [...prevItems, { ...book, quantity: 1 }];
      }
    });
  };

  // Increase quantity of a given order item.
  const handleIncreaseQuantity = (id_product) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id_product === id_product) {
          if (item.quantity < item.stock) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            toast.error('Cannot add more than available stock!');
          }
        }
        return item;
      })
    );
  };

  // Decrease quantity of a given order item.
  // If quantity reaches 1 and then decreased, remove the item.
  const handleDecreaseQuantity = (id_product) => {
    setOrderItems((prevItems) =>
      prevItems.reduce((acc, item) => {
        if (item.id_product === id_product) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
          // if quantity is 1, skipping the item removes it from orderItems
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  // Remove the order item completely.
  const handleRemoveBook = (id_product) => {
    setOrderItems((prevItems) => prevItems.filter((item) => item.id_product !== id_product));
  };

  // Submit order
  const handleSubmitOrder = () => {
    if (orderItems.length === 0) {
      toast.error('Please add at least one book to the order!');
      return;
    }
    console.log('Order submitted:', orderItems, 'Total Price:', totalPrice);
    toast.success('Order submitted successfully!');
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter books based on search term and stock availability
  const filteredBooks = books
    .filter(
      (book) =>
        (book.name && book.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (book.id_product && book.id_product.toString().includes(searchTerm))
    )
    .filter((book) => book.stock > 0);

  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredBooks.length / itemsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className='addOrder'>
      <h1>Tạo hóa đơn</h1>

      <div className='left-container'>
        <div className='search-bar'>
          <input
            type='text'
            placeholder='Search by ID or Name'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset pagination on search
            }}
          />
          {searchTerm && <button onClick={() => setSearchTerm('')}>X</button>}
        </div>
        <div className='book-list'>
          {loading ? (
            <p>Loading books...</p>
          ) : (
            <table className='book-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentBooks.map((book) => (
                  <tr key={book.id_product}>
                    <td>{book.id_product}</td>
                    <td>{book.name}</td>
                    <td>{book.stock}</td>
                    <td>
                      {book.price.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </td>
                    <td>
                      <button onClick={() => handleAddBook(book)}>Add to Order</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className='pagination'>
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            Trang đầu
          </button>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Trước
          </button>
          <span>
            Trang {currentPage} / {Math.ceil(filteredBooks.length / itemsPerPage)}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredBooks.length / itemsPerPage)}>
            Trang sau
          </button>
        </div>
      </div>

      {/* Right Container: Order Summary */}
      <div className='right-container'>
        <div className='order-summary'>
          <h2>Order Summary</h2>
          {orderItems.map((item) => (
            <div key={item.id_product} className='order-item'>
              <span>{item.name}</span>
              <div className='quantity-controls'>
                <button onClick={() => handleDecreaseQuantity(item.id_product)}>–</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleIncreaseQuantity(item.id_product)}>+</button>
              </div>
              <button onClick={() => handleRemoveBook(item.id_product)}>Remove</button>
            </div>
          ))}
          <h3>
            Total Price:{' '}
            {totalPrice.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </h3>

          <button onClick={handleSubmitOrder}>Submit Order</button>
        </div>
      </div>
    </div>
  );
}

export default AddOrder;
