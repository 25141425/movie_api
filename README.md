Overview

myFlix is a movie web application designed for movie enthusiasts who want to access information about different movies, directors, genres, and actors. The backend API allows users to register, update their personal information, and create a list of their favorite movies. Additionally, the API serves detailed information on movies, genres, directors, and allows users to manage their favorite movies list.

This project utilizes the MERN stack (MongoDB, Express, React, Node.js) and demonstrates full-stack JavaScript development, including RESTful API design, authentication, and database interaction.
Features
Essential Features

    List of All Movies: Retrieve a list of all available movies.
    Movie Details: Fetch detailed information about a specific movie, including description, genre, director, image URL, and whether it is featured.
    Genre Information: Get detailed information about a genre (e.g., "Thriller").
    Director Information: Retrieve director details (bio, birth year, death year).
    User Registration: New users can register for the application.
    User Information Update: Registered users can update their username, password, email, and date of birth.
    Favorite Movies: Users can add and remove movies to/from their favorite list.
    User Deregistration: Users can delete their accounts.

Technical Requirements

    Node.js & Express: The API is built with Node.js and Express to handle routing and server-side logic.
    REST API: The application follows REST architecture with defined endpoints for each feature.
    MongoDB: The application uses MongoDB as a NoSQL database to store movie data, user information, and favorites.
    Mongoose: Mongoose is used for business logic and interacting with MongoDB.
    User Authentication: The API supports user authentication using JWT (JSON Web Tokens).
    Data Security & Validation: Includes data validation logic and ensures secure data handling.
    Deployment: The API is deployed to Heroku, making it publicly accessible.
    Postman Testing: The API is tested and verified using Postman.

Setup
Prerequisites

    Node.js: Ensure that you have Node.js installed. If not, download and install from Node.js website.
    MongoDB: Make sure MongoDB is set up on your machine or use a cloud database (e.g., MongoDB Atlas).

API Endpoints

GET	/movies	Returns a list of all movies.
GET	/movies/:title	Returns details of a movie by title.
GET	/genres/:genre	Returns data about a genre.
GET	/directors/:directorName	Returns data about a director.
POST	/users/register	Registers a new user.
PUT	/users/:id	Updates user information.
DELETE	/users/:id	Deregisters a user.
POST	/users/favorites/:movieId	Adds a movie to user's favorites list.
DELETE	/users/favorites/:movieId	Removes a movie from user's favorites list.

Middleware

    body-parser: For parsing incoming request bodies.
    morgan: For logging HTTP requests.
    passport: For handling user authentication (Local Strategy & JWT).