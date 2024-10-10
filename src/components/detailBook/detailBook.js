import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import './detailBook.scss';
// import { editBook } from '../../store/bookActions'; // Import editBook action

const DetailBook = ({ books, editBook }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find((book) => book.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({ ...book });

  if (!book) {
    return <div>Book not found</div>;
  }

  const handleChangeName = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      name: event.target.value,
    }));
  };

  const handleChangeAuthor = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      author: event.target.value,
    }));
  };

  const handleChangeCategory = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      category: event.target.value,
    }));
  };

  const handleChangePublisher = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      publisher: event.target.value,
    }));
  };

  const handleChangePrice = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      price: event.target.value,
    }));
  };

  const handleSave = () => {
    const editedBook = {
      id: book.id,
      name: formState.name,
      author: formState.author,
      category: formState.category,
      publisher: formState.publisher,
      price: formState.price,
	  };
	  
    editBook(editedBook);
    setIsEditing(false);
  };

  return (
    <div className='book-detail'>
      <h2>Book Details</h2>
      <p>
        <strong>ID:</strong> {book.id}
      </p>
      <p>
        <strong>Name:</strong>{' '}
        {isEditing ? <input type='text' name='name' value={formState.name} onChange={handleChangeName} /> : book.name}
      </p>
      <p>
        <strong>Author:</strong>{' '}
        {isEditing ? (
          <input type='text' name='author' value={formState.author} onChange={handleChangeAuthor} />
        ) : (
          book.author
        )}
      </p>
      <p>
        <strong>Category:</strong>{' '}
        {isEditing ? (
          <input type='text' name='category' value={formState.category} onChange={handleChangeCategory} />
        ) : (
          book.category
        )}
      </p>
      <p>
        <strong>Publisher:</strong>{' '}
        {isEditing ? (
          <input type='text' name='publisher' value={formState.publisher} onChange={handleChangePublisher} />
        ) : (
          book.publisher
        )}
      </p>
      <p>
        <strong>Price:</strong>{' '}
        {isEditing ? (
          <input type='text' name='price' value={formState.price} onChange={handleChangePrice} />
        ) : (
          book.price
        )}
      </p>
      <button className='back-button' onClick={() => window.history.back()}>
        Back
      </button>
      <button className='edit-button' onClick={isEditing ? handleSave : () => setIsEditing(true)}>
        {isEditing ? 'Save' : 'Edit'}
      </button>
      {isEditing && (
        <button className='cancel-button' onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  books: state.books,
});

const mapDispatchToProps = (dispatch) => ({
  editBook: (editedBook) => dispatch({ type: 'EDIT_BOOK', payload: editedBook }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailBook);
