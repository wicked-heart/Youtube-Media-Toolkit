import express from 'express';
import cors from 'cors';
import yt_dlp_wrap from 'yt-dlp-wrap';
const YTDlpWrap = yt_dlp_wrap.default;
import ffmpeg from 'fluent-ffmpeg';
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
    const downloadedFilePath = path.join(tempDir, `download_${timestamp}.mp4`);
    
    let finalFormat = format;
    if (['gif', 'trimmer', 'sticker'].includes(format)) finalFormat = 'mp4';
    if (format === 'ringtone') finalFormat = 'mp3';

    const processedFilePath = path.join(tempDir, `processed_${timestamp}.${finalFormat}`);

    console.log('Starting download...');
    await ytDlpWrap.execPromise([
      youtubeUrl,
      '--recode-video', 'mp4',
      '-o', downloadedFilePath,
    ]);
    console.log('Download complete.');

    const command = ffmpeg(downloadedFilePath);
    
    if (['gif', 'trimmer', 'sticker', 'ringtone'].includes(format)) {
      if (!trimTimes) return res.status(400).json({ error: 'Trim times are required.' });
      command.setStartTime(trimTimes.start).setDuration(calculateDuration(trimTimes.start, trimTimes.end));
    }
    
    if (format === 'mp4') {
        command.videoCodec('libx264').audioCodec('aac');
    } else if (format === 'mp3' || format === 'ringtone') {
        command.noVideo().audioCodec('libmp3lame');
    } else if (format === 'gif' || format === 'trimmer') {
        command.videoCodec('libx264').audioCodec('aac').noAudio(); // Muted for GIF
    } else if (format === 'sticker') {
        command.videoCodec('libx264').audioCodec('aac').noAudio()
          .outputOptions([
            '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2,fps=15',
            '-preset', 'fast'
        ]);
    }

    command
      .output(processedFilePath)
      .on('end', () => {
        console.log('Processing finished.');
        res.download(processedFilePath, (err) => {
          if (err) console.error('Error sending file:', err);
          fs.unlinkSync(downloadedFilePath);
fs.unlinkSync(processedFilePath);
          console.log('Temporary files deleted.');
        });
      })
      .on('error', (err) => {
        console.error('Error during processing:', err.message);
        fs.unlinkSync(downloadedFilePath);
        res.status(500).json({ error: 'Failed to process file.' });
      })
      .run();

  } catch (error) {
    console.error('--- YT-DLP process failed ---');
    console.error(error.stderr || error.message);
    res.status(500).json({ error: 'Failed to download video.' });
  }
});

function calculateDuration(start, end) {
  const startSeconds = start.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
  const endSeconds = end.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
  const duration = endSeconds - startSeconds;
  return duration > 0 ? duration : 0;
}

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));