# AlgoHol!c

A fully production-ready **DSA Practice Platform** built to help users master Data Structures & Algorithms through curated problems, streaks, achievements, playlists, and an interactive code editor.

This project is deployed live at **[https://algoholic.site](https://algoholic.site)** and is designed to feel like a polished real-world product — fast, modern, and scalable.

---

## 🚀 Features

### ✅ **Curated Problem Library**

* Organized problems across multiple tags (arrays, strings, DP, recursion, etc.)
* Difficulty levels: Easy, Medium, Hard
* Advanced search and filtering

### ✅ **Interactive Code Editor**

* LeetCode-style code editor
* Supports multiple languages (extensible)
* Run code
* Submit solutions
* Track submission success

### ✅ **Daily Streak System**

* Track your daily problem-solving streak
* Motivation to maintain consistency
* Streak badges (3-day, 7-day, 14-day, 30-day, etc.)

### ✅ **Achievement Badges**

* First solve
* 10 solves
* Streak achievements
* Problem master badges
* And more

### ✅ **Custom Playlists**

* Create your own problem playlists
* Add/remove problems
* Ideal for interview prep or weekly goals

### ✅ **User Profiles**

* View solved count, streaks, achievements
* Activity history
* Personalized dashboard

### ✅ **Production-Ready Backend**

* Node.js + Express
* Prisma ORM
* PostgreSQL (Neon)
* Authentication with JWT/cookies
* Clear folder structure (controllers, routes, libs, middleware, utils)

---

## 🧱 Tech Stack

### **Frontend:**

* React.js (Vite)
* TailwindCSS
* Framer Motion 
* Zustand (state management)

### **Backend:**

* Node.js + Express
* Prisma ORM
* PostgreSQL (Neon)
* JWT + HttpOnly cookies
* Zod for validation

### **Deployment:**

* Frontend → Vercel
* Backend → Render
* Database → Neon

---

## 📁 Project Structure

### **Frontend (Vite + React)**

```
frontend/
 ├── public/
 ├── src/
 │   ├── assets/
 │   ├── components/
 │   ├── layout/
 │   ├── lib/
 │   ├── page/
 │   ├── store/
 │   ├── App.jsx
 │   ├── main.jsx
 │   ├── index.css
 └── vite.config.js
```

### **Backend (Node + Prisma + Express)**

```
backend/
 ├── prisma/
 ├── src/
 │   ├── controllers/
 │   ├── generated/
 │   ├── libs/
 │   ├── middleware/
 │   ├── routes/
 │   ├── utils/
 │   ├── index.js
 ├── .env
 ├── docker
 ├── package.json
```

---

