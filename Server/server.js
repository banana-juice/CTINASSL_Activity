const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require('./COMPONENTS/config/dbconnect');

const userRoutes = require('./COMPONENTS/controller/userController');
app.use('/users', userRoutes);

const patientRoutes = require('./COMPONENTS/controller/patientController');
app.use('/patients', patientRoutes);

app.get('/', (request, response) => {
  response.status(200).send('Hello World!');
});

app.get('/greetings', (request, response) => {
    const { name, course, section } = request.query;
    response.status(200).json({
        name,
        course,
        section,
        message: `Hello ${name}, welcome to the ${course} course, section ${section}!`
    });
});
app.post('/greetings', (request, response) => {
    const { name, course, section } = request.body;
    console.log('Received data: ', { name, course, section });
    response.status(200).json({
        name,
        course,
        section,
        message: `Hello ${name}, welcome to the ${course} course, section ${section}!`
    });
});

app.post('/login', (request, response) => {
    const { username, password } = request.body;
    if (username === 'admin' && password === '1234') {
        response.status(200).json({ message: 'Login successful!' });
    } else {
        response.status(401).json({ message: 'Invalid username or password' });
    }
});
// Start the server only after MongoDB is connected, so every save really reaches the database
connectDB().then(() => {
  const server = app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
  });

  server.on('error', (error) => {
    console.error('Error starting server: ', error);
    process.exit(1);
  });
});