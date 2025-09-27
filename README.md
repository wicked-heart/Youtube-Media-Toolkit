# YouTube Media Toolkit
A web-based toolkit for managing and enhancing YouTube media content. This project allows users to process YouTube videos in various ways directly from links.

## Project Structure
root/
├── client/ # Frontend (React/Vue/HTML/CSS/JS)
├── server/ # Backend (Node.js/Express)
├── .gitignore
└── README.md

## Features
- Convert YouTube links to **MP4**
- Convert YouTube links to **MP3**
- Create **GIFs** from YouTube videos
- Generate **WhatsApp stickers** from YouTube links
- **Trim videos** from YouTube links
- Create **ringtones** from YouTube links

## Technologies Used
- **Backend:** Node.js, Express
- **Frontend:** JavaScript/HTML/CSS (or React if applicable)
- **Video/Audio Processing:** `yt-dlp`
- **System Tools:** Chocolatey for Windows package management

## Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- Windows (recommended, for Chocolatey support)

### Installation
1. Clone the repository:
git clone https://github.com/wicked-heart/Youtube-Media-Toolkit.git
cd Youtube-Media-Toolkit
Install dependencies:

# Frontend
cd client
npm install

# Backend
cd ../server
npm install
Install yt-dlp (if not already installed):
choco install yt-dlp

**Running the Project**

# Start backend server
cd server
npm start

# Start frontend client
cd ../client
npm start
Frontend usually runs at http://localhost:3000 and backend at http://localhost:5000.