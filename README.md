# 🎵 Vibely

> **Feel the music. Live the vibe.**

Vibely is a music discovery and streaming web application that allows users to search for music videos and play them through YouTube's embedded player.

The project is being developed as a full-stack learning project using modern web technologies.

## ✨ Features

### Current Features
- Dark-themed and Bright (Light) mode with seamless cross-page sync.
- Authentication system with **Google**, **Facebook**, **Guest mode**, and standard **Email/Password** registration & login.
- Save favorite songs with persistent storage (`localStorage`) and dedicated Favorites library.
- Responsive music dashboard and welcome landing page.
- Featured music cards.
- Local music playback & iTunes music search preview.
- Play and pause controls.
- Previous and next track controls.
- Volume control and seeking progress bar.

### Planned Features
- [ ] Search YouTube videos using YouTube Data API v3.
- [ ] Display video thumbnails, titles, and channel names.
- [ ] Play selected videos using the YouTube Embedded Player.
- [x] User registration and login (Email, Google, Facebook, Guest).
- [ ] Create and manage custom playlists.
- [x] Save favorite songs.
- [ ] Store user information in MySQL.
- [ ] Build a REST API using Express.js.

## 🛠️ Technologies

| Technology | Purpose |
|---|---|
| HTML5 | Web page structure |
| CSS3 | Styling and responsive design |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | Backend framework |
| MySQL | Database |
| YouTube Data API v3 | Search YouTube videos |
| YouTube IFrame Player API | Embedded video playback |
| Git & GitHub | Version control |

## 📁 Project Structure

```text
Vibely/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── assets/
│       ├── audio/
│       └── images/
│
├── backend/
│
├── database/
│
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Open the project

```bash
cd Vibely
```

### 3. Install dependencies

When the backend is initialized:

```bash
npm install
```

### 4. Run the frontend

Open `frontend/index.html` using the VS Code Live Server extension.

### 5. Configure the YouTube API

1. Create a project in Google Cloud Console.
2. Enable YouTube Data API v3.
3. Create an API key.
4. Store the key securely in the backend environment variables.

Never expose API keys or secrets in frontend JavaScript or public repositories.

## 🏗️ Application Architecture

```text
                 USER
                   |
                   v
             VIBELY FRONTEND
             HTML / CSS / JS
                   |
                   v
             EXPRESS BACKEND
                   |
                   v
             YOUTUBE DATA API
                   |
                   v
             SEARCH RESULTS
                   |
                   v
           YOUTUBE EMBEDDED PLAYER
                   |
                   v
              MUSIC PLAYBACK
```

MySQL will be integrated later to store user accounts, playlists, and favorite songs.

## 🔐 Security

- Keep API keys and secrets in environment variables.
- Never commit `.env` files.
- Validate user input on the backend.
- Restrict API key usage where supported.
- Follow YouTube API Services Terms and Developer Policies.

## 🎯 Project Goals

The main goals of Vibely are:

1. Build a functional music discovery application.
2. Learn how to integrate external APIs.
3. Understand frontend and backend communication.
4. Develop RESTful APIs using Express.js.
5. Practice database design and integration.
6. Improve software development and problem-solving skills.

## 📌 Project Status

**Currently in development.**

The frontend music dashboard and local audio player are implemented. YouTube API integration and backend development are the next stages.

## 👨‍💻 Developer

Developed as a Software Engineering learning project.

**Project:** Vibely  
**Tagline:** Feel the music. Live the vibe.

---

*Vibely — Discover music. Feel the moment.*