# 🚗 G/G1/G2 Driving Test Booking System

A full-stack backend application designed to automate and streamline the Ontario **G/G1/G2 driving test booking process**.  
Built with **Node.js**, **Express**, and **MongoDB**, it allows users to search, schedule, cancel, and manage driving test appointments in real time.  

The project focuses on **API-first design**, **scalable backend architecture**, and **cloud deployment** using **Microsoft Azure** with **Redis caching** for optimal performance.

---

## 🌟 Features

- **User Authentication & Role Management**
  - Secure login/register using JWT tokens.
  - Role-based access control for applicants, admins, and examiners.

- **Driving Test Slot Management**
  - Real-time test slot availability and booking.
  - Automated scheduling and rescheduling of appointments.
  - Cancellation and refund API endpoints.

- **Smart Slot Finder**
  - Notifies users via email when new slots open.
  - Uses Redis-based job queue for periodic checks.

- **API Documentation**
  - Fully documented using **Swagger/OpenAPI**.
  - Interactive API testing supported via Swagger UI.

- **Cloud Deployment**
  - Hosted on **Azure App Service**.
  - **Azure Cosmos DB (Mongo API)** for persistence.
  - **Redis Cache** for performance optimization and rate-limiting.

- **DevOps & Monitoring**
  - CI/CD pipeline with **GitHub Actions** for automated testing and deployment.
  - Integrated logging and metrics with **Azure Application Insights**.

---

## 🧩 Tech Stack

| Layer | Technologies |
|--------|----------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Azure Cosmos DB |
| **Cache/Queue** | Redis |
| **Authentication** | JWT, bcrypt |
| **Documentation** | Swagger / OpenAPI |
| **CI/CD** | GitHub Actions, Docker |
| **Cloud** | Microsoft Azure App Service |
| **Testing** | Jest, Mocha, Postman |

---

## 🚀 Installation & Setup

```bash
# 1️⃣ Clone the repository
git clone git@github.com:jayrajdabhi/DrivingLicence.git

# 2️⃣ Install dependencies
cd DrivingLicence
npm install

# 3️⃣ Set up environment variables
cp .env.example .env
# Add MongoDB URI, Redis URL, JWT Secret, Email Service Credentials

# 4️⃣ Start the development server
npm run dev

# 5️⃣ Open Swagger UI for API testing
http://localhost:5000/api-docs
