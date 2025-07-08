
import { useState, useRef } from 'react';
import './SingleUserPractice.css';

const SingleUserPractice = ({ userStats, setUserStats }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      handleAnalyzeAudio("This is sample recorded text for analysis.");
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      // Simulate audio processing
      setTimeout(() => {
        handleAnalyzeAudio("This is sample uploaded audio text for analysis.");
      }, 1000);
    }
  };

  const handleAnalyzeAudio = (text) => {
    setTranscript(text);
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const sampleFeedback = {
        originalText: text,
        correctedText: "This is a sample corrected text for analysis.",
        grammarErrors: [
          { error: "Missing article", suggestion: "Add 'a' before 'sample'" },
          { error: "Word order", suggestion: "Consider rephrasing for clarity" }
        ],
        suggestions: [
          "Try using more varied vocabulary",
          "Practice pronunciation of difficult words",
          "Work on sentence structure"
        ],
        score: 78
      };
      
      setFeedback(sampleFeedback);
      setIsAnalyzing(false);
      
      // Update user stats
      setUserStats(prev => ({
        ...prev,
        coins: prev.coins + 10,
        streak: prev.streak + (Math.random() > 0.5 ? 1 : 0)
      }));
    }, 2000);
  };

  const resetSession = () => {
    setAudioFile(null);
    setTranscript('');
    setFeedback(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="single-practice">
      <div className="practice-header">
        <h2>Solo Practice Session</h2>
        <p>Record or upload audio to get AI-powered feedback</p>
      </div>

      <div className="practice-grid">
        {/* Recording Section */}
        <div className="practice-card">
          <div className="card-header">
            <h3>🎤 Record Audio</h3>
          </div>
          <div className="recording-section">
            {!isRecording ? (
              <button className="record-button" onClick={startRecording}>
                <span className="record-icon">🎤</span>
                Start Recording
              </button>
            ) : (
              <div className="recording-active">
                <div className="recording-indicator"></div>
                <p>Recording in progress...</p>
                <button className="stop-button" onClick={stopRecording}>
                  Stop Recording
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div className="practice-card">
          <div className="card-header">
            <h3>📁 Upload Audio</h3>
          </div>
          <div className="upload-section">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button 
              className="upload-button"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="upload-icon">📎</span>
              Choose Audio File
            </button>
            {audioFile && (
              <div className="file-info">
                <p>📄 {audioFile.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transcript Section */}
      {transcript && (
        <div className="practice-card">
          <div className="card-header">
            <h3>📝 Transcript</h3>
          </div>
          <div className="transcript-content">
            <p>{transcript}</p>
          </div>
        </div>
      )}

      {/* Analysis Loading */}
      {isAnalyzing && (
        <div className="practice-card">
          <div className="loading-section">
            <div className="spinner"></div>
            <p>Analyzing your speech...</p>
          </div>
        </div>
      )}

      {/* Feedback Section */}
      {feedback && (
        <div className="feedback-section">
          <div className="practice-card">
            <div className="card-header">
              <h3>🎯 Grammar & Spelling Corrections</h3>
            </div>
            <div className="corrections">
              <div className="text-comparison">
                <div className="original-text">
                  <h4>Original:</h4>
                  <p>{feedback.originalText}</p>
                </div>
                <div className="corrected-text">
                  <h4>Corrected:</h4>
                  <p>{feedback.correctedText}</p>
                </div>
              </div>
              
              <div className="errors-list">
                <h4>Grammar Errors Found:</h4>
                {feedback.grammarErrors.map((error, index) => (
                  <div key={index} className="error-item">
                    <span className="error-type">{error.error}:</span>
                    <span className="error-suggestion">{error.suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="practice-card">
            <div className="card-header">
              <h3>💡 Improvement Suggestions</h3>
            </div>
            <div className="suggestions-list">
              {feedback.suggestions.map((suggestion, index) => (
                <div key={index} className="suggestion-item">
                  <span className="suggestion-icon">💡</span>
                  <p>{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="practice-card">
            <div className="card-header">
              <h3>📊 Your Score</h3>
            </div>
            <div className="score-section">
              <div className="score-circle">
                <span className="score-number">{feedback.score}%</span>
              </div>
              <div className="score-details">
                <p>Great job! Keep practicing to improve further.</p>
                <div className="rewards">
                  <span className="reward-item">+10 coins earned! 🪙</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      {(transcript || feedback) && (
        <div className="action-section">
          <button className="reset-button" onClick={resetSession}>
            Start New Session
          </button>
        </div>
      )}
    </div>
  );
};

export default SingleUserPractice;