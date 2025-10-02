import React from 'react';

function Trimmer({ trimTimes, setTrimTimes }) {
  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    // This validation ensures only numbers and colons can be typed
    if (/^[0-9:]*$/.test(value)) {
        setTrimTimes(prevTimes => ({
          ...prevTimes,
          [name]: value
        }));
    }
  };

  return (
    <div className="trimmer-container">
      <h4>Set Start and End Times</h4>
      <div className="time-inputs">
        <label>Start:</label>
        <input
          type="text"
          name="start"
          value={trimTimes.start}
          onChange={handleTimeChange}
          placeholder="e.g., 00:15"
        />
        <label>End:</label>
        <input
          type="text"
          name="end"
          value={trimTimes.end}
          onChange={handleTimeChange}
          placeholder="e.g., 00:25"
        />
      </div>
    </div>
  );
}

export default Trimmer;