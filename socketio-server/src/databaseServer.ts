//setup requirements for server to start
import { Request, Response } from 'express';
import { RowDataPacket, createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


//use the database credentials in .env file for login
dotenv.config();

//use the secret key for JWT authentication
const SECRET_KEY = process.env.JWT_SECRET;

//creating a database pool to connect
const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

//asynchronous function called when login button is pressed 
export const loginRoute = async (req: Request, res: Response) => {

  //create a variable to hold the email, username and password
  const { email, username, password } = req.body;

  //if statement to ensure email, username or password is not empty
  if (!email || !username || !password) {

    //error message to end user
    res.status(400).json({ message: 'Please provide email, username, and password' });
    return;
  }

  //statement to ensure email is a valid email address
  if (!email || !email.match(/\S+@\S+\.\S+/)) {
    res.status(400).json({ message: 'Invalid or missing email' });
    return;
  }

  //putting extra parameters on username for security using character limit
  if (!username || username.length < 3 || username.length > 30) {
    res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
    return;
  }

  //putting extra parameters on passwords for security using regex
  if (!password || password.length < 8 || !password.match(/[0-9]/) || !password.match(/[\!\@\#\$\%\^\&\*]/)) {
    res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one number and one special character' });
    return;
  }

  try {

    //query to the database to check if the user is there already
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM registered_users WHERE email = ? AND username = ?', [email, username]);

    //checks if there is someone with the credentials
    if (rows.length > 0) {

      const user = rows[0];

      // Check if the hashed password matches the input password
      const match = await bcrypt.compare(password, user.password);

      if (match) {

        // Generate JWT
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token: token, user: user });

      } else {

        // Passwords do not match
        res.status(401).json({ message: 'Invalid email, username, or password' });

      }
    } else {

      // User not found
      res.status(401).json({ message: 'Invalid email, username, or password' });

    }
  } catch (error) {

    //display error to end user if query couldnt be made
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });

  }

  //display the incoming message on the console for debugging
  console.log('Incoming login request:', req.body);
};



//asynchronous function called when register button is pressed
export const registerRoute = async (req: Request, res: Response) => {

  //variable to hold the users email, username and password
  const { email, username, password } = req.body;

  //if statement to ensure end user input isnt empty
  if (!email || !username || !password) {

    //display error if they are empty
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  //if statement to ensure email, username or password is not empty
  if (!email || !username || !password) {

    //error message to end user
    res.status(400).json({ message: 'Please provide email, username, and password' });
    return;
  }

  //statement to ensure email is a valid email address
  if (!email || !email.match(/\S+@\S+\.\S+/)) {
    res.status(400).json({ message: 'Invalid or missing email' });
    return;
  }

  //putting extra parameters on username for security 
  if (!username || username.length < 3 || username.length > 30) {
    res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
    return;
  }

  //putting extra parameters on passwords for security
  if (!password || password.length < 8 || !password.match(/[0-9]/) || !password.match(/[\!\@\#\$\%\^\&\*]/)) {
    res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one number and one special character' });
    return;
  }

  try {

    // Hash the password before storing it in the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //query to the database to checking if user information is already in database
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM registered_users WHERE email = ? OR username = ?', [email, username]);

    //if the query comes back with anything greater than 0
    if (rows.length > 0) {

      //display an error message saying user exists
      res.status(409).json({ message: 'Email or username already exists' });
      return;

    }

    //query to insert the user to the database if there is no one already in there
    await pool.query('INSERT INTO registered_users (email, username, password) VALUES (?, ?, ?)', [email, username, hashedPassword]);

    //display successful registration message
    res.json({ message: 'Registration successful' });

  } catch (error) {

    //display error if no query could be made
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

  //display incoming register request on console for debugging purposes
  console.log('Incoming register request:', req.body);

};

export const authenticateJWT = (req, res, next) => {

  const token = req.headers.authorization;

  let secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  if (typeof secret !== 'string') {
    throw new Error('JWT_SECRET is not a string');
  }

  if (token) {
    jwt.verify(token, secret as string, (err, user) => {

      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

