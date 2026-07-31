# Employee Tracking Workflow & Productivity Monitoring Application

A full-stack employee workflow tracking and productivity monitoring application designed to help organizations monitor employee activities, attendance, productivity, workflow, payroll, and performance through a centralized admin dashboard.

## 🚀 Features

### 👤 Employee Management

* Employee registration and authentication
* Secure login with Employee ID or Email
* Employee profile management
* Employee status management
* Role-based access control

### 📊 Employee Dashboard

* Daily activity overview
* Attendance information
* Working hours
* Productive hours
* Idle time
* Break time
* Productivity percentage
* Task/workflow tracking

### 🖥️ Activity & Workflow Tracking

* Real-time employee activity tracking
* Mouse and keyboard activity monitoring
* Active and idle time calculation
* Break tracking
* Screen inactivity tracking
* System lock duration tracking
* Productive time calculation
* Automatic productivity calculation

### 🛠️ Admin Dashboard

* Total employee statistics
* Active and idle employee monitoring
* Attendance overview
* Productivity analytics
* Department performance
* Workflow management
* Team performance monitoring
* Live employee activity tracking

### ⏰ Attendance & Payroll

* Employee check-in/check-out
* Attendance status
* Working hours calculation
* Overtime calculation
* Leave management
* Payroll calculation
* Payslip management
* Attendance policy configuration

### 🔔 Notification System

* Real-time notifications
* Employee activity notifications
* Idle-time notifications
* Admin announcements
* Notification read/unread management

### 📈 Reports & Analytics

* Attendance reports
* Productivity reports
* Login/logout reports
* Employee performance reports
* Team performance reports
* Department reports
* Workflow reports
* Payroll reports
* PDF report generation

### ⚡ Real-Time Features

* Real-time employee activity updates
* Live employee monitoring
* Socket.IO based communication
* Real-time notifications

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* Tailwind CSS
* Lucide React
* Axios
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JWT Authentication

### Development Tools

* Git
* GitHub
* VS Code
* Postman

---

## 📁 Project Structure

```text
Employee-Tracking-workflow-application/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

> Folder names may vary depending on the project configuration.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd Employee-Tracking-workflow-application
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
```

### 4. Install Backend Dependencies

Open another terminal and run:

```bash
cd server
npm install
```

### 5. Configure Environment Variables

Create a `.env` file inside the `server` directory.

You can use `.env.example` as a reference:

```bash
cp .env.example .env
```

Add your own environment variables and credentials to `.env`.

**Do not commit `.env` to GitHub.**

### 6. Start the Backend

```bash
cd server
npm run dev
```

### 7. Start the Frontend

```bash
cd client
npm run dev
```

The application can then be accessed through the local development URL shown by Vite.

---

## 🔐 Environment Variables

The application requires environment variables for services such as:

```env
ADMIN_EMAIL=
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
SMTP_USER=
SMTP_PASS=
SENDER_EMAIL=
```

For security reasons, actual credentials are not included in this repository.

---

## 🔄 Application Workflow

```text
Employee Login
      ↓
Employee Dashboard
      ↓
Activity Tracking
      ↓
Active / Idle / Break Monitoring
      ↓
Productivity Calculation
      ↓
Attendance & Payroll
      ↓
Admin Dashboard
      ↓
Reports & Analytics
```

---

## 📊 Productivity Monitoring

The application tracks employee activity and calculates productivity based on working time, productive time, idle time, and break duration.

The system can monitor:

* Active time
* Idle time
* Break time
* Productive time
* Working hours
* Productivity percentage
* Screen inactivity
* System lock duration

Administrators can use these metrics to understand employee workflow and overall team performance.

---

## 🔔 Real-Time Communication

Socket.IO is used to provide real-time functionality including:

* Employee activity updates
* Live employee status
* Productivity updates
* Real-time notifications
* Admin live monitoring

---

## 🔒 Security

The project follows basic security practices including:

* JWT-based authentication
* Role-based authorization
* Protected API routes
* Environment variable configuration
* Sensitive credentials excluded from Git
* Passwords and API keys not committed to the repository

---

## 📱 Responsive Design

The application UI is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile devices

---

## 🎯 Project Objective

The main objective of this project is to provide organizations with a centralized platform for monitoring employee workflows, attendance, productivity, and performance while providing administrators with real-time insights and detailed reports.

---

## 👩‍💻 Developer

**Vanshika Khandelwal**

Full Stack / MERN Stack Developer

### Technologies

`React` `Node.js` `Express.js` `MongoDB` `JavaScript` `Tailwind CSS` `Socket.IO` `Git` `GitHub`

---

## 📌 Future Enhancements

* Advanced productivity analytics
* AI-powered performance insights
* Advanced employee activity visualization
* Automated email reports
* More detailed payroll management
* Advanced role and permission management
* Cloud deployment improvements

---

## ⭐ Project Status

**Completed**

This project was developed as a full-stack employee workflow tracking and productivity monitoring solution.
