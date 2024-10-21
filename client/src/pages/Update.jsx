import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Update = () => {
  const [book, setBook] = useState({
    title: '',
    desc: '',
    price: null,
    cover: '',
  });

  const [error, setError] = useState(false);

  // The useLocation hook is a React hook provided by the React Router library. It allows you to access and retrieve information about the current location (URL) in your React components.

  const location = useLocation();
  const navigate = useNavigate();

  console.log('location', location.pathname.split('/'));
  console.log(location.pathname); // Prints the current path of the URL
  console.log(location.search); // Prints the query parameters of the URL

  const bookId = location.pathname.split('/')[2];

  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

    useEffect(() => {
      const fetchBooksDetails = async () => {
        try {
          const res = await axios.get(`http://localhost:8800/books/${bookId}`);
          setBook(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchBooksDetails();
    }, []);

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8800/books/${bookId}`, book);
      navigate('/');
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className='form'>
      <h1>Update the Book</h1>
      <input
        type='text'
        placeholder='Book title'
        name='title'
        onChange={handleChange}
        value={book.title}
      />
      <textarea
        rows={5}
        type='text'
        placeholder='Book desc'
        name='desc'
        onChange={handleChange}
        value={book.desc}
      />
      <input
        type='number'
        placeholder='Book price'
        name='price'
        onChange={handleChange}
        value={book.price}
      />
      <input
        type='text'
        placeholder='Book cover'
        name='cover'
        onChange={handleChange}
        value={book.cover}
      />
      <button onClick={handleClick}>Update</button>
      {error && 'Something went wrong!'}
      <Link to='/'>See all books</Link>
    </div>
  );
};

export default Update;
