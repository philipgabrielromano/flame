# Flame - Self-Hosted Start Page

## Overview
Flame is a self-hosted start page for your server. It allows you to organize and manage applications, bookmarks, and more from a customizable dashboard. The app features weather widgets, custom themes, and bookmark management.

## Project Architecture
- **Backend**: Node.js + Express.js server with SQLite database (Sequelize ORM)
- **Frontend**: React (TypeScript) with Redux, built with Create React App
- **Database**: SQLite stored in `./data/db.sqlite`
- **WebSockets**: Used for weather updates

### Directory Structure
- `/` - Server root (Express API, models, controllers, routes)
- `/client` - React frontend source code
- `/public` - Built React frontend (served by Express in production)
- `/data` - SQLite database and uploaded files
- `/db` - Database config, migrations, and utilities
- `/controllers` - API business logic
- `/routes` - Express API routes
- `/models` - Sequelize models
- `/utils` - Server utilities

## Configuration
- **Port**: 5000 (set via environment variable)
- **NODE_ENV**: production
- **PASSWORD**: Stored as Replit secret (for dashboard login)
- **SECRET**: Stored as Replit secret (JWT signing key)

## Running
- The server runs on port 5000, serving both the API and the built React frontend
- The React client is pre-built and copied to `/public` directory
- For deployment, the build step rebuilds the client and copies to public

## Recent Changes
- 2026-02-20: Added logo upload feature - users can upload/remove a custom logo from Settings > Interface, displayed above the greeting on the home page
- 2026-02-20: Initial Replit setup - configured environment variables, built React client, set up workflow on port 5000
