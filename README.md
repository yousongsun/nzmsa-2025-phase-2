# MSA 2025 Phase 2 - Travel Networking App

Welcome to my submission for the Microsoft Student Accelerator 2025 Phase 2! This project is a full-stack web application designed to connect travelers, share experiences, and plan trips together.

## 🚀 Project Overview

This application is a travel-centric social networking platform that allows users to create and share their travel plans, post updates from their journeys, and follow other travelers. It's built with a modern tech stack, featuring a React frontend and a .NET 8.0 backend, to deliver a seamless and engaging user experience.

### How it Relates to the Theme: **Networking**

The core of this application is built around the theme of **networking**. It's designed to connect people with shared interests in travel, fostering a community where users can:
-   **Follow** other travelers and stay updated on their journeys.
-   **Share** trip itineraries and experiences with friends and followers.
-   **Collaborate** on future trips by inviting friends to join their travel plans.

By providing a platform for travelers to connect and interact, the app encourages the formation of new friendships and travel groups, turning solo journeys into shared adventures.

## ✨ Advanced Features Implemented

As required, this project implements at least three advanced features to enhance its functionality and user experience:

-   [x] **Storybook for UI Component Development**: Storybook is integrated to develop, test, and document UI components in isolation, improving maintainability and collaboration across the team.
-   [x] **Theme Switching (Light/Dark Mode)**: Users can switch between light and dark themes to suit their preferences, with the selected theme persisted across sessions.
-   [x] **Dockerization**: The entire application is containerized using Docker, allowing for easy setup and deployment.
-   [x] **Redux for State Management**: The frontend uses Redux Toolkit for robust and predictable state management, ensuring data consistency across the application.


## 🎬 Demo Video

https://pharma.host/nzmsa-2025-phase-2-presentation

## 🛠️ Tech Stack

### Frontend
-   **React**: A popular JavaScript library for building user interfaces.
-   **TypeScript**: Provides static typing to enhance code quality and maintainability.
-   **Vite**: A fast and modern build tool for frontend development.
-   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
-   **Redux Toolkit**: For efficient and predictable state management.
-   **React Router**: For client-side routing and navigation.
-   **shadcn/ui**: A collection of beautifully designed, accessible UI components.

### Backend
-   **C# with .NET 8**: A powerful and modern framework for building web APIs.
-   **Entity Framework Core**: An object-relational mapper (ORM) for data access.
-   **SQL Server**: A robust and scalable relational database.
-   **JWT for Authentication**: Secure authentication using JSON Web Tokens.

## 📋 Basic Requirements Checklist

### Frontend
-   [x] Built with React and TypeScript
-   [x] Visually appealing and responsive UI, both computer and mobile
-   [x] Use Tailwind CSS for styling
-   [x] Navigation with React Router
-   [x] Clear and regular Git commit history
-   [x] Deployed frontend on Azure ([Live App](https://nzmsa.pharma.host))

### Backend
-   [x] Built with C# and .NET 8
-   [x] Uses Entity Framework Core with Memory, SQLite and SQL Server
-   [x] Data persistence with SQL Server
-   [x] Implements CRUD operations
-   [x] Clear and regular Git commit history
-   [x] Deployed backend on Azure ([Live App](https://nzmsa.pharma.host))

## 🚀 Getting Started

To run this project locally, you'll need to have Docker and Docker Compose installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yousongsun/nzmsa-2025-phase-2
    cd nzmsa-2025-phase-2
    ```

2.  **Run with Docker Compose:**
    ```bash
    docker compose up --build

    ```
    Access Using: `http://localhost:3000`


3.  **Run locally:**
    -   Start the backend
        ```bash
        cd backend
        dotnet run
        ```
    -   Start the frontend
        ```bash
        cd frontend
        npm install
        npm run dev
        ```
    Access Using: `http://localhost:5173`


4.  **Access the deployed application:**
    -   Deployed: [https://nzmsa.pharma.host](https://nzmsa.pharma.host)


5. **Demo Users**

    Here are five demo user accounts you can use to test the app:

    **User 1**  
    Email: `user1@nzmsa.co.nz`  
    Password: `password123`

    **User 2**  
    Email: `user2@nzmsa.co.nz`  
    Password: `password123`

    **User 3**  
    Email: `user3@nzmsa.co.nz`  
    Password: `password123`

    **User 4**  
    Email: `user4@nzmsa.co.nz`  
    Password: `password123`

    **User 5**  
    Email: `user5@nzmsa.co.nz`  
    Password: `password123`


5. **Running Storybook**

    ```
    cd frontend
    npm install
    npm run storybook
    ```
