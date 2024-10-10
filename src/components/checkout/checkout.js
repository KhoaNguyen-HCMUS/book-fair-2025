import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import './checkout.scss';
import { toast } from 'react-toastify';

const Checkout = ({ books, deleteBook }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const ids = queryParams.get('ids')?.split(',') || [];
  const selectedBooks = books.filter((book) => ids.includes(book.id));

  const [confirmed, setConfirmed] = useState(false);

  const totalPrice = selectedBooks.reduce((total, book) => total + parseFloat(book.price), 0);

  const order = ids.join('%20');

  const handleConfirm = () => {
    setConfirmed(true);
  };

  const handleSubmit = () => {
    selectedBooks.forEach((book) => deleteBook(book.id));
    toast.success('Order submitted successfully');
    navigate('/ListBooks');
  };

  return (
    <div className='checkout'>
      <h2>Checkout</h2>
      <table className='checkout-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>

            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {selectedBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.name}</td>
              <td>{book.price}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan='2'>Total Price</td>
            <td>{totalPrice}</td>
          </tr>
        </tfoot>
      </table>

      <img
        src={`https://api.vietqr.io/image/970415-100873414404-72z4QvB.jpg?accountName=NGUYEN%20LE%20HO%20ANH%20KHOA&amount=${totalPrice}&addInfo=${order}`}
        alt='Sample Image'
		  />
		  <br></br>
      <div className='checkout-buttons'>
        <button className='confirm-button' onClick={handleConfirm} disabled={confirmed}>
          Confirm
        </button>
        <button className='submit-button' onClick={handleSubmit} disabled={!confirmed}>
          Submit
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  books: state.books,
});

const mapDispatchToProps = (dispatch) => ({
  deleteBook: (bookId) => dispatch({ type: 'DELETE_BOOK', payload: bookId }),
  addBook: (newBook) => dispatch({ type: 'ADD_BOOK', payload: newBook }),
  editBook: (editedBook) => dispatch({ type: 'EDIT_BOOK', payload: editedBook }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
