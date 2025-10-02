YouTube Media Toolkit
A full-stack web application that allows users to download and process YouTube videos into various formats like MP4, MP3, and create trimmed clips for GIFs and stickers.

Features
Convert to MP4: Download a full-length YouTube video as an MP4 file.

Convert to MP3: Extract the audio from a YouTube video and save it as an MP3 file.

GIF Maker: Create a shareable, muted MP4 clip from a section of a video, perfect for social media.

WhatsApp Sticker Maker: Generate a 512x512 MP4 file from a video clip, ready to be imported into a sticker maker app like Sticker.ly.

Video Trimmer: Download a specific trimmed section of a video as an MP4.

Ringtone Maker: Create a custom ringtone by trimming the audio from a video and saving it as an MP3.

Tech Stack
Frontend: React (Vite)

Backend: Node.js, Express

Core Tools: yt-dlp, ffmpeg

Styling: Vanilla CSS

Prerequisites
Before you can run this project locally, you must have the following command-line tools installed on your system:

Node.js (which includes npm)

yt-dlp

ffmpeg

The easiest way to install yt-dlp and ffmpeg on Windows is with Chocolatey:

choco install yt-dlp ffmpeg

Local Development Setup
Follow these steps to run the project on your local machine.

1. Clone the Repository
git clone <https://github.com/wicked-heart/Youtube-Media-Toolkit.git >
cd yt-website

2. Install Dependencies
You need to install the packages for both the server and the client.

Install server dependencies:

cd server
npm install

Install client dependencies:

cd ../client
npm install

3. Start the Servers
You will need two separate terminals to run both the backend and frontend servers simultaneously.

Terminal 1: Start the Backend Server

cd server
node index.js

The backend server will start on http://localhost:4000.

Terminal 2: Start the Frontend Client

cd client
npm run dev

The frontend application will be available at http://localhost:5173.