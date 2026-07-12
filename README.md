# 🎓 EduQuiz Manager

> A modern Full-Stack Student Management & Quiz Platform powered by React, TypeScript, Vite, Tailwind CSS, and Internet Computer (ICP) with Motoko.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.x-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38BDF8?logo=tailwindcss)
![Motoko](https://img.shields.io/badge/Motoko-Backend-orange)
![Internet Computer](https://img.shields.io/badge/ICP-DFINITY-blueviolet)
![License](https://img.shields.io/badge/License-MIT-green)

---

# 📖 Overview

EduQuiz Manager is a modern educational platform designed to simplify student management and online assessments. It enables administrators to create and manage subjects, quizzes, questions, students, certificates, and results through an intuitive dashboard, while students can securely log in to attend quizzes, track progress, view certificates, and monitor their performance.

The application follows a modern full-stack architecture using React with TypeScript for the frontend and Motoko canisters deployed on the Internet Computer (ICP) for the backend, providing scalability, security, and decentralized data management.

---

# ✨ Features

## 👨‍💼 Admin Module

- Dashboard Overview
- Student Management
- Subject Management
- Quiz Creation
- Question Management
- Result Monitoring
- Certificate Management
- AI Settings
- Leaderboard Management

---

## 👨‍🎓 Student Module

- Secure Login
- Student Dashboard
- Attempt Quizzes
- View Results
- Download Certificates
- Public Certificate Verification
- Leaderboard
- Profile Management
- Quiz History

---

## 🤖 AI Features

- AI Assisted Quiz Support
- Smart Question Management
- Future AI Recommendations
- Intelligent Learning Assistance

---

# 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | Shadcn UI |
| Backend | Motoko |
| Blockchain | Internet Computer (ICP) |
| Package Manager | PNPM |
| State Management | React Hooks |
| Deployment | Vercel (Frontend) + ICP (Backend) |

---

# 🏗 Project Architecture

```
                User
                  │
                  ▼
        React + TypeScript
                  │
                  ▼
            Vite Frontend
                  │
                  ▼
      Internet Computer Canister
                  │
                  ▼
          Motoko Backend Logic
                  │
                  ▼
          Decentralized Storage
```

---

# 📁 Project Structure

```
eduquiz-manager
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── lib
│   │   ├── mocks
│   │   ├── pages
│   │   ├── types
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── src
│   ├── backend
│   │   ├── main.mo
│   │   ├── migration.mo
│   │   ├── students.mo
│   │   ├── subjects.mo
│   │   ├── quiz.mo
│   │   ├── questions.mo
│   │   └── certificates.mo
│   │
│   └── declarations
│
├── package.json
├── README.md
└── caffeine.toml
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/eduquiz-manager.git
```

Move into the project

```bash
cd eduquiz-manager
```

Install dependencies

```bash
pnpm install
```

Start the development server

```bash
pnpm dev
```

---

# 📸 Application Modules

- Login Page
- Admin Dashboard
- Student Dashboard
- Quiz Management
- Subject Management
- Questions Management
- Student Profile
- Certificates
- Public Certificate Verification
- Leaderboard
- Quiz Results

---

# 🔐 Authentication

The platform supports secure authentication with separate access for:

- Administrator
- Student

Each role has dedicated dashboards and permissions.

---

# 🎯 Key Functionalities

- Manage Students
- Manage Subjects
- Create Quizzes
- Manage Questions
- Publish Results
- Generate Certificates
- Public Certificate Verification
- Student Performance Tracking
- Leaderboard Ranking
- AI-assisted Learning

---

# 📊 Benefits

- Modern User Interface
- Responsive Design
- Fast Performance
- Secure Architecture
- Decentralized Backend
- Easy Management
- Scalable System
- Clean Code Structure

---

# 🌐 Deployment

### Frontend

Deploy using **Vercel**

### Backend

Deploy Motoko canisters on the **Internet Computer (ICP)** using the DFINITY SDK.

---

# 🔮 Future Enhancements

- AI Chatbot for Students
- Attendance Management
- Assignment Module
- Notification System
- Email Integration
- Analytics Dashboard
- Mobile Application
- Real-time Quiz Monitoring
- Multi-language Support
- Role-based Access Control Enhancements

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Create a Pull Request.

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Vis**

AI & Data Science Student

Passionate about Full Stack Development, Artificial Intelligence, and Building Scalable Applications.

---

## ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub to support the project.
