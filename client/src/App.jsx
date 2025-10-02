import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Trimmer from './components/Trimmer';

function calculateDuration(start, end) {
  try {
    const startSeconds = start.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
    const endSeconds = end.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
    const duration = endSeconds - startSeconds;
    return duration > 0 ? duration : 0;
  } catch (e) {
    return 0;
  }
}

function App() {
  const [url, setUrl] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trimTimes, setTrimTimes] = useState({ start: '00:00', end: '00:05' });
  const [postProcessMessage, setPostProcessMessage] = useState(null);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    const duration = calculateDuration(trimTimes.start, trimTimes.end);
    if (selectedOption === 'gif' && duration > 6) {
      setWarningMessage('Note: For WhatsApp, clips over 6 seconds may not be shareable as a GIF.');
    } else {
      setWarningMessage('');
    }
  }, [trimTimes, selectedOption]);

  const stickerInstructions = (
    <div>
      <h3>Sticker File Created!</h3>
      <p>Your MP4 file has been downloaded. To create the sticker:</p>
      <ol>
        <li>Transfer the downloaded MP4 file to your phone.</li>
        <li>Open the "Sticker.ly" app and choose to create a new animated sticker.</li>
        <li>Select the MP4 file from your gallery and add it to WhatsApp.</li>
      </ol>
    </div>
  );

  const handleSubmit = async () => {
    if (!url || !selectedOption) {
      alert('Please enter a URL and select an option.');
      return;
    }
    setIsLoading(true);
    setPostProcessMessage(null);

    try {
      const response = await axios.post('http://localhost:4000/api/process', {
        youtubeUrl: url,
        format: selectedOption,
        trimTimes: trimTimes,
      }, {
        responseType: 'blob',
      });

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = fileURL;

      let downloadFormat = selectedOption;
      if (['gif', 'trimmer', 'sticker'].includes(selectedOption)) downloadFormat = 'mp4';
      if (selectedOption === 'ringtone') downloadFormat = 'mp3';
      
      link.setAttribute('download', `download.${downloadFormat}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (selectedOption === 'sticker') {
        setPostProcessMessage(stickerInstructions);
      }
      
    } catch (error) {
      console.error('Error sending data to backend:', error);
      alert('An error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setPostProcessMessage(null);
    setSelectedOption(null);
    setUrl('');
  };

  const needsTrimming = ['gif', 'sticker', 'trimmer', 'ringtone'].includes(selectedOption);

  return (
    <div className="container">
      <header className="app-header"><h1>YouTube Media Toolkit</h1></header>
      <div className="card">
        {postProcessMessage ? (
          <div className="success-message">
            {postProcessMessage}
            <button onClick={handleReset} className="process-button">Create Another</button>
          </div>
        ) : isLoading ? (
          <div>
            <p>Encoding your file for maximum compatibility... This may take a moment.</p>
          </div>
        ) : (
          <>
            <div className="input-group">
              <input type="text" placeholder="Paste YouTube URL here..." value={url} onChange={(e) => setUrl(e.target.value)} />
              <button onClick={handleSubmit}>Process</button>
            </div>
            <div className="options-grid">
              <button className={`option-button ${selectedOption === 'mp4' ? 'selected' : ''}`} onClick={() => setSelectedOption('mp4')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9a2.25 2.25 0 0 0-2.25 2.25v9A2.25 2.25 0 0 0 4.5 18.75Z" /></svg>
                to mp4
              </button>
              <button className={`option-button ${selectedOption === 'mp3' ? 'selected' : ''}`} onClick={() => setSelectedOption('mp3')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" /></svg>
                to mp3
              </button>
              <button className={`option-button ${selectedOption === 'gif' ? 'selected' : ''}`} onClick={() => setSelectedOption('gif')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 8.25v7.5m6-7.5h-3V12m0 3.75-3-1.5-3 1.5m-6-7.5h3.75v7.5H3.75z" /></svg>
                gif maker
              </button>
              <button className={`option-button ${selectedOption === 'sticker' ? 'selected' : ''}`} onClick={() => setSelectedOption('sticker')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm4.5 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z" /></svg>
                whatsapp sticker
              </button>
              <button className={`option-button ${selectedOption === 'trimmer' ? 'selected' : ''}`} onClick={() => setSelectedOption('trimmer')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m9.568 3.34 3.468 3.468m0 0-3.468 3.468m3.468-3.468H3.34m12.94-3.34h3.113c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125H3.34c-.621 0-1.125-.504-1.125-1.125V4.465c0-.621.504-1.125 1.125-1.125H6.55" /></svg>
                video trimmer
              </button>
              <button className={`option-button ${selectedOption === 'ringtone' ? 'selected' : ''}`} onClick={() => setSelectedOption('ringtone')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
                ringtone maker
              </button>
            </div>
            {needsTrimming && (
              <>
                <Trimmer trimTimes={trimTimes} setTrimTimes={setTrimTimes} />
                {warningMessage && <p className="warning-message">{warningMessage}</p>}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;