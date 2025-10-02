import express from 'express';
import cors from 'cors';
import yt_dlp_wrap from 'yt-dlp-wrap';
const YTDlpWrap = yt_dlp_wrap.default;
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const ytDlpWrap = new YTDlpWrap();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.resolve(__dirname, 'temp');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Backend server is running correctly!'));

app.post('/api/process', async (req, res) => {
  const { youtubeUrl, format, trimTimes } = req.body;

  if (!youtubeUrl || !format) {
    return res.status(400).json({ error: 'URL and format are required.' });
  }

  try {
    const timestamp = new Date().getTime();
    
    let finalFormat = format;
    if (['gif', 'trimmer', 'sticker'].includes(format)) finalFormat = 'mp4';
    if (format === 'ringtone') finalFormat = 'mp3';
    
    const processedFilePath = path.join(tempDir, `processed_${timestamp}.${finalFormat}`);

    // --- KEY CHANGE HERE ---
    const options = [
      youtubeUrl,
      '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
      '-o', processedFilePath
    ];
    
    if (['gif', 'trimmer', 'sticker', 'ringtone'].includes(format)) {
      if (!trimTimes) return res.status(400).json({ error: 'Trim times are required.' });
      options.push('--download-sections', `*${trimTimes.start}-${trimTimes.end}`);
    }

    if (format === 'mp4' || format === 'trimmer') {
      options.push('--recode-video', 'mp4');
    } else if (format === 'mp3' || format === 'ringtone') {
      options.push('-x', '--audio-format', 'mp3');
    } else if (format === 'gif') {
      options.push('--recode-video', 'mp4', '--postprocessor-args', 'ffmpeg:-an -preset fast');
    } else if (format === 'sticker') {
      options.push('--recode-video', 'mp4', '--postprocessor-args', 'ffmpeg:-vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2,fps=15" -an -preset fast');
    }
    
    console.log('Executing local yt-dlp command with custom user agent...');
    await ytDlpWrap.execPromise(options);

    console.log('Processing complete.');

    res.download(processedFilePath, (err) => {
      if (err) console.error('Error sending file:', err);
      fs.unlink(processedFilePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
        else console.log('Temporary file deleted.');
      });
    });

  } catch (error) {
    console.error('--- YT-DLP process failed ---');
    console.error(error.stderr || error.message);
    res.status(500).json({ error: 'Failed to process video.' });
  }
});

function calculateDuration(start, end) {
  const startSeconds = start.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
  const endSeconds = end.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
  const duration = endSeconds - startSeconds;
  return duration > 0 ? duration : 0;
}

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));