<p align="center">
  <img src="https://img.icons8.com/fluency/96/stethoscope.png" alt="Docure Logo" width="80" height="80"/>
</p>

<h1 align="center">Docure</h1>

<p align="center">
  <strong>Modern Telemedicine Platform for Seamless Healthcare</strong>
</p>

<p align="center">
  <a href="https://docure-web.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=vercel" alt="Live Demo"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/TypeScript-Typed-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/>
</p>

---

## Overview

**Docure** is a full-stack telemedicine platform that connects patients with doctors through seamless video consultations. Built with modern technologies, it provides a secure and intuitive healthcare experience.

<p align="center">
  <a href="https://docure-web.vercel.app/">
    <img src="https://img.shields.io/badge/🌐%20LIVE%20DEMO-docure--web.vercel.app-0070f3?style=for-the-badge" alt="Visit Live Site"/>
  </a>
</p>

---

## Features

### For Patients

| Feature                   | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| **Doctor Discovery**      | Browse and search verified doctors by specialization     |
| **Easy Booking**          | Book video/audio consultations with available time slots |
| **Video Consultations**   | HD video calls powered by ZegoCloud                      |
| **Digital Prescriptions** | Receive and download prescriptions after consultation    |
| **Secure Payments**       | Pay via Razorpay with automatic refunds on cancellation  |
| **Appointment History**   | Track upcoming, ongoing, and past appointments           |

### For Doctors

| Feature                 | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| **Dashboard**           | Overview of appointments, earnings, and patient stats |
| **Schedule Management** | Set availability and manage time slots                |
| **Patient Records**     | Access patient history and consultation notes         |
| **Prescription Upload** | Upload prescriptions as images or PDFs                |
| **Earnings Tracking**   | Monitor consultation fees and payout status           |

### Platform Features

- **Google OAuth** - One-click sign in with Google
- **Real-time Video Calls** - Powered by ZegoCloud WebRTC
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Role-based Access** - Separate flows for patients and doctors
- **Secure Authentication** - JWT-based auth with refresh tokens

---

## Tech Stack

### Frontend

```
Next.js 16      →  React Framework with App Router
React 19        →  UI Library
TypeScript      →  Type Safety
Tailwind CSS 4  →  Styling
Zustand         →  State Management
Radix UI        →  Accessible Components
ZegoCloud       →  Video Calling SDK
React Hook Form →  Form Handling
Zod             →  Schema Validation
```

### Backend

```
Node.js         →  Runtime Environment
Express 5       →  Web Framework
MongoDB         →  Database
Mongoose        →  ODM
Passport.js     →  Authentication
Razorpay        →  Payment Gateway
Cloudinary      →  Image/File Storage
JWT             →  Token Authentication
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- Cloudinary account
- Razorpay account
- ZegoCloud account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/docure.git
   cd docure
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   ```

   Create `.env` file:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Google OAuth
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret

   # Razorpay
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

3. **Setup Frontend**

   ```bash
   cd frontend
   npm install
   ```

   Create `.env` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_ZEGOCLOUD_APP_ID=your_app_id
   NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET=your_server_secret
   ```

4. **Run the application**

   Backend:

   ```bash
   cd backend && npm run dev
   ```

   Frontend:

   ```bash
   cd frontend && npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
docure/
├── frontend/                # Next.js frontend
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   ├── store/          # Zustand stores
│   │   └── service/        # API services
│   └── package.json
│
├── backend/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Entry point
│
└── README.md
```

---

## Screenshots

<p align="center">
  <i>Landing Page • Doctor List • Appointment Booking • Video Consultation</i>
</p>

---

## API Endpoints

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| `POST` | `/auth/register`          | Register new user    |
| `POST` | `/auth/login`             | User login           |
| `GET`  | `/auth/google`            | Google OAuth         |
| `GET`  | `/doctors`                | List all doctors     |
| `GET`  | `/doctors/:id`            | Get doctor details   |
| `POST` | `/appointment/book-slot`  | Book appointment     |
| `PUT`  | `/appointment/cancel/:id` | Cancel appointment   |
| `GET`  | `/appointment/patient`    | Patient appointments |
| `GET`  | `/appointment/doctor`     | Doctor appointments  |

---

## Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend && vercel
```

### Backend (Railway/Render)

- Connect your GitHub repository
- Set environment variables
- Deploy

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with care for better healthcare access</strong>
</p>

<p align="center">
  <a href="https://docure-web.vercel.app/">
    <img src="https://img.shields.io/badge/Try%20Docure%20Now-Visit%20Website-blue?style=for-the-badge" alt="Try Docure"/>
  </a>
</p>

<p align="center">
  <sub>If you found this project helpful, please consider giving it a star!</sub>
</p>
