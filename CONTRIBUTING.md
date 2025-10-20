# Contributing to Simple Classified

Thank you for your interest in contributing to Simple Classified! We welcome contributions from the community and appreciate your efforts to improve this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Reporting Issues](#reporting-issues)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Coding Guidelines](#coding-guidelines)
- [Testing](#testing)
- [Git Workflow](#git-workflow)
- [Need Help?](#need-help)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Please be considerate and constructive in your communications.

## Getting Started

Simple Classified is a classified ads web application built with Node.js, Express, MongoDB, and Cloudinary for image storage. Before contributing, make sure you're familiar with:

- Node.js and Express
- MongoDB and Mongoose
- EJS templating
- RESTful API design
- JavaScript/ES6+

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 LTS or v20 LTS recommended)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas)
- [Cloudinary Account](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/dl7ux4wyyctegpw106ox?t=default)

### Installation Steps

1. **Fork and Clone the Repository**
   ```bash
   git clone git@github.com:YOUR_USERNAME/simple-classified.git
   cd simple-classified
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in the required environment variables in `.env`:
     ```
     SECRET=your_random_secret_string
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_KEY=your_cloudinary_api_key
     CLOUDINARY_SECRET=your_cloudinary_api_secret
     DB_URL=mongodb://localhost:27017/classified
     ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application should now be running at `http://localhost:3000`

## How to Contribute

There are many ways you can contribute to Simple Classified:

- **Report bugs** - Help us identify and fix issues
- **Suggest features** - Share ideas for new functionality
- **Improve documentation** - Help others understand the project better
- **Submit code** - Fix bugs or implement new features
- **Review pull requests** - Help maintain code quality

## Reporting Issues

Before creating a new issue, please:

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** to ensure it's not a usage question
3. **Verify the issue** in the latest version

When creating an issue, please include:

- A clear and descriptive title
- Detailed description of the problem
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots (if applicable)
- Your environment details (OS, Node.js version, browser, etc.)

## Submitting Pull Requests

### Before You Start

1. **Check existing issues and PRs** to avoid duplicate work
2. **Create or comment on an issue** to discuss your proposed changes
3. **Fork the repository** and create a new branch from `main`

### Pull Request Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow the coding guidelines below
   - Add comments for complex logic
   - Update documentation as needed

3. **Test Your Changes**
   - Ensure the application runs without errors
   - Test all affected functionality manually
   - Verify your changes don't break existing features

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Brief description of your changes"
   ```
   
   Write clear commit messages:
   - Use present tense ("Add feature" not "Added feature")
   - Be concise but descriptive
   - Reference issue numbers when applicable (e.g., "Fix #123")

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template with:
     - Clear title and description
     - Link to related issues
     - Screenshots/videos of UI changes
     - List of changes made

7. **Address Review Feedback**
   - Respond to comments and questions
   - Make requested changes
   - Push additional commits to the same branch

## Coding Guidelines

### JavaScript Style

This project is configured to use [Prettier](https://prettier.io/) and [StandardJS](https://standardjs.com/) for code formatting and linting via DeepSource. While local linting tools are not currently configured in the repository, contributors should follow these style guidelines:

**Key Guidelines:**

- Use 2 spaces for indentation (not tabs)
- Use semicolons
- Use single quotes for strings (unless template literals are needed)
- Use meaningful variable and function names
- Keep functions small and focused on a single task
- Avoid deeply nested code
- Use async/await instead of callbacks when possible

### File Organization

- **Models** - Place Mongoose models in `models/`
- **Routes** - Place Express routes in `routes/`
- **Controllers** - Place route handlers in `controllers/`
- **Views** - Place EJS templates in `views/`
- **Middleware** - Place custom middleware in `middleware.js` or create dedicated files
- **Utils** - Place utility functions in `utils/`
- **Public Assets** - Place static files (CSS, JS, images) in `public/`

### Security Best Practices

- Never commit sensitive data (API keys, passwords, etc.)
- Use environment variables for configuration
- Sanitize user inputs
- Validate and sanitize data before processing
- Follow OWASP guidelines for web security

### Database Operations

- Use Mongoose schemas with proper validation
- Include error handling for all database operations
- Use transactions when performing multiple related operations
- Avoid N+1 query problems

## Testing

Currently, this project doesn't have automated tests. However, when contributing:

### Manual Testing Checklist

- [ ] Application starts without errors
- [ ] All routes work as expected
- [ ] User registration and login work correctly
- [ ] Ad creation, editing, and deletion work properly
- [ ] Image uploads to Cloudinary work
- [ ] Error pages display correctly
- [ ] Security features (CSRF, rate limiting) work as expected
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Check responsive design on mobile devices

### Future Testing

We welcome contributions to add automated testing:
- Unit tests for models and utilities
- Integration tests for routes and controllers
- End-to-end tests for critical user flows

## Git Workflow

### Branching Strategy

- `main` - Production-ready code
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring

### Commit Messages

Follow these conventions:

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat: Add search functionality for ads

- Implement search by title and description
- Add search form to navigation
- Update ads route to handle search queries

Closes #42
```

## Need Help?

If you have questions or need assistance:

- Check the [README.md](README.md) for basic setup and usage
- Review existing issues and pull requests
- Create a new issue with the "question" label
- Connect with the maintainer [@zaselalk on Twitter](https://twitter.com/zaselalk)

---

Thank you for contributing to Simple Classified! Your efforts help make this project better for everyone. 🎉
