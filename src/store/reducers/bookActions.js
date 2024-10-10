import { parse, unparse } from 'papaparse';

const writeBooksToFile = (books) => {
  const csvData = unparse(books);
  localStorage.setItem('books', csvData);
};

export const addBook = (book) => (dispatch, getState) => {
  dispatch({
    type: 'ADD_BOOK',
    payload: book,
  });
  const { books } = getState();
  writeBooksToFile(books);
};

export const deleteBook = (bookId) => (dispatch, getState) => {
  dispatch({
    type: 'DELETE_BOOK',
    payload: bookId,
  });
  const { books } = getState();
  writeBooksToFile(books);
};

export const editBook = (editedBook) => (dispatch, getState) => {
  dispatch({
    type: 'EDIT_BOOK',
    payload: editedBook,
  });
  const { books } = getState();
  writeBooksToFile(books);
};

export const toggleSelectBook = (bookId) => ({
  type: 'TOGGLE_SELECT_BOOK',
  payload: bookId,
});
