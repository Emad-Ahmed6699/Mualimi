# Mualimi (معلمي) - Learning Management & Examination System 🎓

![Mualimi Cover](./assets/img/cover.png) *(Optional: Add a cover image here)*

Mualimi is a robust, full-stack web application designed to streamline the examination and student management process for educational institutions, teachers, and students. With its modern UI and tailored workflows, it serves as a dedicated platform for conducting assessments, tracking performance, and generating actionable insights.

---

## ✨ Key Features

### 👨‍🏫 For Teachers:
*   **Intuitive Dashboard:** Get a bird's-eye view of your groups, active exams, and overall student performance.
*   **Group Management:** Create and manage student groups seamlessly.
*   **Advanced Quiz Creator:** Build interactive quizzes with dynamic question types and duration limits.
*   **Comprehensive Reporting:** View detailed student results and **export grades to Excel** with a single click.

### 👨‍🎓 For Students:
*   **Dedicated Student Portal:** A clean interface to view assigned quizzes and track personal grades.
*   **Secure Exam Environment:** Features an anti-cheating system (detects tab switching, window blurring, and prevents unauthorized shortcuts).
*   **Real-time Timer:** Keep track of remaining exam time directly from the interface.

---

## 🏗️ Project Architecture (Folder Structure)

The project is structured with a professional, scalable architecture separating the frontend views into distinct domain modules, and maintaining a clean backend entry point.

```
Mualimi/
├── assets/                  # Static assets (CSS, JS, Images)
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js           # Centralized API requests layer
│   │   └── main.js          # Global UI utilities (Modals, Alerts, Logout)
├── models/                  # MongoDB Data Models (Mongoose)
│   ├── Group.js
│   ├── Quiz.js
│   ├── Student.js
│   └── User.js
├── pages/                   # Frontend Views (Organized by domain)
│   ├── auth/                # Authentication views
│   │   ├── login.html
│   │   └── signup.html
│   ├── student/             # Student portal views
│   │   ├── dashboard.html
│   │   ├── grades.html
│   │   ├── quizzes.html
│   │   └── take-quiz.html
│   └── teacher/             # Teacher portal views
│   │   ├── dashboard.html
│   │   ├── groups.html
│   │   ├── quiz-creator.html
│   │   └── reports.html
├── index.html               # Landing Page
├── db.js                    # Database connection setup
├── server.js                # Express.js Backend Server & Routing
└── package.json             # Project metadata and dependencies
```

---

## 🚀 Tech Stack

**Frontend:**
*   **HTML5 / CSS3**
*   **Vanilla JavaScript (ES6+)**
*   **Bootstrap 5 (RTL):** For responsive, Arabic-first design.
*   **Chart.js:** For visualizing student performance data.
*   **SheetJS (xlsx):** For seamless Excel report generation and exporting.
*   **FontAwesome:** For rich iconography.

**Backend:**
*   **Node.js & Express.js:** Robust server-side framework.
*   **MongoDB & Mongoose:** NoSQL database for flexible data modeling.
*   **Bcryptjs:** For secure password hashing.
*   **CORS & Dotenv:** For security and environment configuration.

---

## 🛠️ Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Emad-Ahmed6699/Mualimi.git
    cd Mualimi
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add your MongoDB connection string:
    ```env
    MONGODB_URI=mongodb://127.0.0.1:27017/mualimi
    PORT=5000
    ```

4.  **Run the application:**
    *   For production:
        ```bash
        npm start
        ```
    *   For development (using nodemon):
        ```bash
        npm run dev
        ```

5.  **Access the App:**
    Open your browser and navigate to `http://localhost:5000`

---

## 🔒 Security Highlights

*   **Frontend Anti-Cheating:** Validates if the student switches tabs, opens developer tools, or right-clicks during an active exam.
*   **Role-Based Access (Client-side):** UI components are segmented by user roles (`teacher` vs `student`).
*   **Encrypted Passwords:** User credentials are encrypted using `bcryptjs` before hitting the database.

---

## 👨‍💻 Developer

Built with passion to elevate the E-learning experience.
**Senior Fullstack Developer** - [Emad Ahmed](https://github.com/Emad-Ahmed6699)
