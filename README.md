# Blog Application

This project is a comprehensive blog application built with React, offering a rich set of features for both readers and writers.

## Features

- User Authentication (Login, Register, Forgot Password)
- Create, Read, and Delete blog posts
- View posts by category
- Personal reading list
- User profiles
- Contact form
- Responsive design

## Technologies Used

- React
- React Router for navigation
- React Query for data fetching and caching
- Context API for state management (AuthProvider)

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm start`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Project Structure

The main application structure is set up in the App component, which includes:

- QueryClientProvider for React Query
- Router for navigation
- AuthProvider for user authentication state
- Various routes for different pages and features

## Routes

- `/login`: Login page
- `/register`: Registration page
- `/forgot-password`: Password recovery page
- `/contact-us`: Contact form
- `/`: Home page
- `/chart`: Chart view (possibly for analytics)
- `/:username/:slug`: Individual post view (protected route)
- `/category/:category`: Posts by category (protected route)
- `/new-story`: Create new post form (protected route)
- `/posts`: All posts view (protected route)
- `/reading-list`: User's reading list (protected route)
- `/:username`: User profile page (protected route)

## Protected Routes

Some routes are wrapped in a `PrivateRoute` component, ensuring that only authenticated users can access these pages.

## Learn More

To learn more about React, check out the [React documentation](https://reactjs.org/).

For more information about the libraries and tools used in this project, refer to their respective documentation:

- [React Router](https://reactrouter.com/)
- [React Query](https://react-query.tanstack.com/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
