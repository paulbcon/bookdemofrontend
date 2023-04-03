import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const BACKEND_URI = `http://localhost:8080/api`;

function App() {

  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    publishedYear: '',
  });
  const [modal, setModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [updatedBook, setUpdatedBook] = useState({
    title: '',
    author: '',
    publishedYear: '',
  });

  useEffect(() => {
    axios.get(BACKEND_URI+'/books')
      .then(response => setBooks(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleInputChange = event => {
    setNewBook({ ...newBook, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    axios.post(BACKEND_URI+'/books', newBook)
      .then(response => {
        setBooks([...books, response.data]);
        setNewBook({ title: '', author: '', publishedYear: '' });
      })
      .catch(error => console.log(error));
  };

  const handleDeleteBook = id => {
    axios.delete(BACKEND_URI+`/books/${id}`)
      .then(response => {
        const updatedBooks = books.filter(book => book.id !== id);
        setBooks(updatedBooks);
      })
      .catch(error => console.log(error));
  };

  const toggleModal = (book = null) => {
    setModal(!modal);
    setSelectedBook(book);
    if (book) {
      setUpdatedBook(book);
    }
  };

  const handleUpdateBook = () => {
    axios.put(BACKEND_URI+`/books/${selectedBook.id}`, updatedBook)
      .then(response => {
        const updatedBooks = books.map(book => {
          if (book.id === selectedBook.id) {
            return response.data;
          }
          return book;
        });
        setBooks(updatedBooks);
        toggleModal();
      })
      .catch(error => console.log(error));
  };

  const handleModalInputChange = event => {
    setUpdatedBook({ ...updatedBook, [event.target.name]: event.target.value });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Book Collection</h1>
      <form onSubmit={handleFormSubmit} className="row g-3 mb-3">
        <div className="col-md-4">
          <label htmlFor="title" className="form-label">Title:</label>
          <input
            type="text"
            name="title"
            value={newBook.title}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="author" className="form-label">Author:</label>
          <input
            type="text"
            name="author"
            value={newBook.author}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="publishedYear" className="form-label">Published Year:</label>
          <input
            type="number"
            name="publishedYear"
            value={newBook.publishedYear}
            onChange={handleInputChange}
            className="form-control"
            required
            />
            </div>
            <div className="col-md-12 d-grid gap-2">
            <button type="submit" className="btn btn-primary btn-block">Add Book</button>
            </div>
            </form>
            <table className="table table-bordered table-striped">
            <thead>
            <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published Year</th>
            <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {books.map(book => (
            <tr key={book.id}>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.publishedYear}</td>
            <td> <button className="btn btn-sm btn-info me-2" onClick={() => toggleModal(book)}>Edit</button>
<button className="btn btn-sm btn-danger" onClick={() => handleDeleteBook(book.id)}>Delete</button>
</td>
</tr>
))}
</tbody>
</table>
<Modal isOpen={modal} toggle={toggleModal}>
<ModalHeader toggle={toggleModal}>Edit Book</ModalHeader>
<ModalBody>
<form>
<div className="mb-3">
<label htmlFor="title" className="form-label">Title:</label>
<input type="text" className="form-control" name="title" value={updatedBook.title} onChange={handleModalInputChange} required />
</div>
<div className="mb-3">
<label htmlFor="author" className="form-label">Author:</label>
<input type="text" className="form-control" name="author" value={updatedBook.author} onChange={handleModalInputChange} required />
</div>
<div className="mb-3">
<label htmlFor="publishedYear" className="form-label">Published Year:</label>
<input type="number" className="form-control" name="publishedYear" value={updatedBook.publishedYear} onChange={handleModalInputChange} required />
</div>
</form>
</ModalBody>
<ModalFooter>
<Button color="primary" onClick={handleUpdateBook}>Save</Button>{' '}
<Button color="secondary" onClick={toggleModal}>Cancel</Button>
</ModalFooter>
</Modal>
</div>
);
}

export default App;