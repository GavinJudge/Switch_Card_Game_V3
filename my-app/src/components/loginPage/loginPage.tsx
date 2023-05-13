import React, { useState } from 'react';
import '../../App.css';
import { useNavigate } from 'react-router-dom';

//create an interface for the user form
interface UserForm {
  email: string;
  username: string;
  password: string;
}

// Function to process the login form
function LoginForm() {

  //create instance of useNavigate
  const navigate = useNavigate();

  //set the form to false initially
  const [showForm, setShowForm] = useState(false);

  //each form input variable set to blank
  const [user, setUser] = useState<UserForm>({
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  //asynchronous function to handle the submit button action
  const handleSubmit = async (event: React.FormEvent) => {

    //prevent the form from default submission
    event.preventDefault();

    try {

      //fetch the POST request made for the /api/login endpoint
      const response = await fetch('http://localhost:9000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        //take the information and store it in a JSON string element
        body: JSON.stringify(user),
      });

      //if the repsonse is received with no problems
      if (response.ok) {

        //take the response JSON element
        const data = await response.json();

        //display on console
        console.log(data);

        // Save the token in sessionStorage
        if (data.token) {
          sessionStorage.setItem('token', data.token);
        }

        //navigate the user to the next page
        navigate('/JoinRoom');

      } else {

        //take the response JSON element
        const errorData = await response.json();

        //display error to the end user
        setError(errorData.message || 'An unknown error occurred');
      }
    } catch (error) {

      //display error if query could not be made
      console.error(error);
      setError('An unknown error occurred');
    }
  };

  //the state of the form can be toggled
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  //sets the variables for the query when the end user enters them in the inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  //JSX element returned
  return (
    <div>
      <button onClick={toggleForm}>{showForm ? 'Login (hide)' : 'Login'}</button>
      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <label className="label">
            Email:
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
              className="input"
            />
          </label>
          <br />
          <label className="label">
            Username:
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
              className="input"
            />
          </label>
          <br />
          <label className="label">
            Password:
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
              className="input"
            />
          </label>
          <br />
          <button type="submit" className="button">
            Login
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      )}
    </div>
  );
}


// Function to process the register form
function RegisterForm() {
  // Create instance of useNavigate
  const navigate = useNavigate();

  // Set the form to false initially
  const [showForm, setShowForm] = useState(false);

  // Each form input variable set to blank
  const [user, setUser] = useState<UserForm>({
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Asynchronous function to handle the submit button action
  const handleSubmit = async (event: React.FormEvent) => {

    // Prevent the form from default submission
    event.preventDefault();

    try {
      // Fetch the POST request made for the /api/register endpoint
      const response = await fetch('http://localhost:9000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        // Take the information and store it in a JSON string element
        body: JSON.stringify(user),
      });

      // If the response is received with no problems
      if (response.ok) {
        // Take the response JSON element
        const data = await response.json();

        // Display on console
        console.log(data);

        // Save the token in sessionStorage
        if (data.token) {
          sessionStorage.setItem('token', data.token);
        }

        // Navigate the user to the next page
        navigate('/JoinRoom');
      } else {
        // Take the response JSON element
        const errorData = await response.json();

        // Display error to the end user
        setError(errorData.message || 'An unknown error occurred');
      }
    } catch (error) {
      // Display error if query could not be made
      console.error(error);
      setError('An unknown error occurred');
    }
  };

  // The state of the form can be toggled
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Sets the variables for the query when the end user enters them in the inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // JSX element returned
  return (
    <div>
      <button onClick={toggleForm}>{showForm ? 'Register (hide)' : 'Register'}</button>
      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <label className="label">
            Email:
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
              className="input"
            />
          </label>
          <label className="label">
            Username:
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
              className="input"
            />
          </label>
          <br />
          <label className="label">
            Password:
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
              className="input"
            />
          </label>
          <br />
          <button type="submit" className="button">
            Register
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      )}
    </div>
  );
}


// The function which is run and calls register and login functions
function LoginPage() {
  // Return JSX element
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
      <h1>Register</h1>
      <RegisterForm />
    </div>
  );
}

export default LoginPage;
