import React, { useState } from 'react';
import { connect } from 'react-redux';
import './addBook.scss';
import { toast } from 'react-toastify';

const AddBookForm = ({ addBook }) => {
  const [formState, setFormState] = useState({
    id: '',
    name: '',
    author: '',
    category: '',
    publisher: '',
    price: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  const handleAddBook = (event) => {
    event.preventDefault();
    const newErrors = {};

    if (formState.id.trim() === '') newErrors.id = true;
    if (formState.name.trim() === '') newErrors.name = true;
    if (formState.author.trim() === '') newErrors.author = true;
    if (formState.category.trim() === '') newErrors.category = true;
    if (formState.publisher.trim() === '') newErrors.publisher = true;
    if (formState.price.trim() === '') newErrors.price = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all the fields');
      return;
    }

    addBook(formState);
    toast.success('Add new book successfully');
    setFormState({
      id: '',
      name: '',
      author: '',
      category: '',
      publisher: '',
      price: '',
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleAddBook} className='add-book-form'>
      <input
        type='text'
        name='id'
        placeholder='ID'
        value={formState.id}
        onChange={handleChange}
        className={errors.id ? 'error' : ''}
      />
      <input
        type='text'
        name='name'
        placeholder='Name'
        value={formState.name}
        onChange={handleChange}
        className={errors.name ? 'error' : ''}
      />
      <input
        type='text'
        name='author'
        placeholder='Author'
        value={formState.author}
        onChange={handleChange}
        className={errors.author ? 'error' : ''}
      />
      <input
        type='text'
        name='category'
        placeholder='Category'
        value={formState.category}
        onChange={handleChange}
        className={errors.category ? 'error' : ''}
      />
      <input
        type='text'
        name='publisher'
        placeholder='Publisher'
        value={formState.publisher}
        onChange={handleChange}
        className={errors.publisher ? 'error' : ''}
      />
      <input
        type='text'
        name='price'
        placeholder='Price'
        value={formState.price}
        onChange={handleChange}
        className={errors.price ? 'error' : ''}
      />
      <button type='submit' className='add-button'>
        Add Book
      </button>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => ({
  deleteBook: (bookId) => dispatch({ type: 'DELETE_BOOK', payload: bookId }),
  addBook: (newBook) => dispatch({ type: 'ADD_BOOK', payload: newBook }),
});

export default connect(null, mapDispatchToProps)(AddBookForm);
