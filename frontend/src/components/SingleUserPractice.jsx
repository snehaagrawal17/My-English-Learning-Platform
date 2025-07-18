import { useState, useRef } from 'react';
import './SingleUserPractice.css';

const SingleUserPractice = ({ userStats, setUserStats }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentStep, setCurrentStep] = useState('ready');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      setAudioURL('');
      setTranscript('');
      setFeedback(null);
      setRecordingTime(0);
      setCurrentStep('recording');
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = "en-US";
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.maxAlternatives = 1;
        
        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (finalTranscript || interimTranscript) {
            const currentTranscript = (transcript + ' ' + finalTranscript + ' ' + interimTranscript).trim();
            setTranscript(currentTranscript);
          }
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please allow microphone access and try again.');
          }
        };
        
        recognitionRef.current.start();
      } else {
        alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      }

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
      setCurrentStep('ready');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsRecording(false);
    setCurrentStep('analyzing');

    setTimeout(() => {
      if (transcript && transcript.trim().length > 0) {
        handleAnalyzeAudio(transcript);
      } else {
        handleAnalyzeAudio("No speech detected. Please try speaking more clearly.");
      }
    }, 2000);
  };

  const handleAnalyzeAudio = async (text) => {
    setTranscript(text);
    setIsAnalyzing(true);
    
    try {
      const grammarResponse = await fetch("https://api.languagetoolplus.com/v2/check", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `text=${encodeURIComponent(text)}&language=en-US`
      });
      
      if (!grammarResponse.ok) {
        throw new Error(`API responded with status: ${grammarResponse.status}`);
      }
      
      const grammarResult = await grammarResponse.json();
      let correctedText = text;
      const grammarErrors = [];
      
      if (grammarResult.matches && grammarResult.matches.length > 0) {
        grammarResult.matches.forEach(match => {
          grammarErrors.push({
            error: match.message,
            suggestion: match.replacements?.[0]?.value || 'Consider rephrasing',
            offset: match.offset,
            length: match.length
          });
        });
      }

      const suggestions = generateSuggestions(text, grammarErrors);
      const score = Math.max(50, 100 - (grammarErrors.length * 10));
      
      const feedbackData = {
        originalText: text,
        correctedText: correctedText,
        grammarErrors: grammarErrors,
        suggestions: suggestions,
        score: score,
        recordingTime: recordingTime
      };
      
      setFeedback(feedbackData);
      setIsAnalyzing(false);
      setCurrentStep('results');
      
      setUserStats(prev => ({
        ...prev,
        coins: prev.coins + Math.floor(score / 10),
        streak: prev.streak + (score > 80 ? 1 : 0)
      }));
      
    } catch (error) {
      console.error('Error analyzing audio:', error);
      
      const fallbackAnalysis = performBasicGrammarCheck(text);
      
      const sampleFeedback = {
        originalText: text,
        correctedText: fallbackAnalysis.correctedText,
        grammarErrors: fallbackAnalysis.grammarErrors,
        suggestions: fallbackAnalysis.suggestions,
        score: fallbackAnalysis.score,
        recordingTime: recordingTime
      };
      
      setFeedback(sampleFeedback);
      setIsAnalyzing(false);
      setCurrentStep('results');
    }
  };

  const performBasicGrammarCheck = (text) => {
    const grammarErrors = [];
    let correctedText = text;
    
    const checks = [
      {
        pattern: /\b(i)\b/g,
        replacement: 'I',
        message: 'Capitalize "I" when referring to yourself',
        suggestion: 'Use "I" instead of "i"'
      },
      {
        pattern: /\b(im)\b/gi,
        replacement: "I'm",
        message: 'Use proper contraction',
        suggestion: 'Use "I\'m" instead of "im"'
      },
      {
        pattern: /\b(ur)\b/gi,
        replacement: "you're",
        message: 'Use proper contraction',
        suggestion: 'Use "you\'re" instead of "ur"'
      },
      {
        pattern: /\b(u)\b/gi,
        replacement: "you",
        message: 'Use proper word',
        suggestion: 'Use "you" instead of "u"'
      }
    ];
    
    checks.forEach(check => {
      if (check.pattern.test(text)) {
        grammarErrors.push({
          error: check.message,
          suggestion: check.suggestion
        });
        correctedText = correctedText.replace(check.pattern, check.replacement);
      }
    });
    
    if (!text.endsWith('.') && !text.endsWith('!') && !text.endsWith('?')) {
      grammarErrors.push({
        error: 'Missing punctuation',
        suggestion: 'Add appropriate punctuation at the end of your sentence'
      });
    }
    
    const words = text.split(' ').length;
    if (words < 3) {
      grammarErrors.push({
        error: 'Very short sentence',
        suggestion: 'Try to form more complete sentences'
      });
    }
    
    const suggestions = generateSuggestions(text, grammarErrors);
    const score = Math.max(50, 100 - (grammarErrors.length * 15));
    
    return {
      correctedText,
      grammarErrors,
      suggestions,
      score
    };
  };

  const generateSuggestions = (text, grammarErrors) => {
    const suggestions = [];
    
    if (text.length < 50) {
      suggestions.push("Try to speak for longer periods to practice more complex sentences");
    }
    
    if (text.toLowerCase().includes('um') || text.toLowerCase().includes('uh')) {
      suggestions.push("Try to reduce filler words like 'um' and 'uh' for more confident speech");
    }
    
    if (grammarErrors.length > 0) {
      suggestions.push("Focus on grammar rules, especially articles and verb tenses");
    }
    
    const words = text.split(' ').length;
    if (words < 10) {
      suggestions.push("Expand your vocabulary by using more descriptive words");
    }
    
    suggestions.push("Practice pronunciation of difficult words regularly");
    suggestions.push("Record yourself more often to track improvement");
    
    return suggestions;
  };

  const resetSession = () => {
    setTranscript('');
    setFeedback(null);
    setIsAnalyzing(false);
    setAudioURL('');
    setRecordingTime(0);
    setCurrentStep('ready');
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'fair';
    return 'needs-improvement';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'ready':
        return (
          <div className="step-content step-ready">
            <div className="step-header">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h2>Ready to Practice</h2>
              <p>Click the button below to start recording your speech and get instant feedback</p>
            </div>
            <button className="primary-btn start-btn" onClick={startRecording}>
              <span className="btn-icon">🎤</span>
              Start Recording
            </button>
          </div>
        );

      case 'recording':
        return (
          <div className="step-content step-recording">
            <div className="recording-visual">
              <div className="pulse-container">
                <div className="pulse-ring"></div>
                <div className="pulse-ring"></div>
                <div className="pulse-ring"></div>
                <div className="microphone-icon">🎤</div>
              </div>
            </div>
            <h2>Recording in Progress</h2>
            <div className="recording-timer">{formatTime(recordingTime)}</div>
            
            <div className="live-transcript">
              <div className="transcript-header">
                <div className="listening-indicator">
                  <div className="listening-dot"></div>
                  <span>Listening...</span>
                </div>
              </div>
              <div className="transcript-display">
                {transcript ? (
                  <p className="transcript-text">{transcript}</p>
                ) : (
                  <p className="transcript-placeholder">Start speaking and your words will appear here...</p>
                )}
              </div>
            </div>
            
            <button className="primary-btn stop-btn" onClick={stopRecording}>
              <span className="btn-icon">⏹️</span>
              Stop & Analyze
            </button>
          </div>
        );

      case 'analyzing':
        return (
          <div className="step-content step-analyzing">
            <div className="analyzing-visual">
              <div className="loader">
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
              </div>
            </div>
            <h2>Analyzing Your Speech</h2>
            <p>AI is checking grammar, pronunciation, and providing personalized feedback...</p>
            
            {transcript && (
              <div className="analyzing-preview">
                <h3>Analyzing:</h3>
                <div className="preview-text">"{transcript}"</div>
              </div>
            )}
          </div>
        );

      case 'results':
        return (
          <div className="step-content step-results">
            {feedback && (
              <>
                <div className="results-header">
                  <h2>Analysis Complete! 🎉</h2>
                  <div className={`score-badge ${getScoreColor(feedback.score)}`}>
                    <div className="score-number">{feedback.score}</div>
                    <div className="score-label">Score</div>
                  </div>
                </div>

                <div className="results-grid">
                  <div className="text-comparison-card">
                    <h3>📝 Text Comparison</h3>
                    <div className="comparison-content">
                      <div className="original-section">
                        <h4>What You Said:</h4>
                        <p className="text-original">{feedback.originalText}</p>
                      </div>
                      <div className="corrected-section">
                        <h4>Corrected Version:</h4>
                        <p className="text-corrected">{feedback.correctedText}</p>
                      </div>
                    </div>
                  </div>

                  {feedback.grammarErrors.length > 0 && (
                    <div className="grammar-card">
                      <h3>⚠️ Grammar Issues ({feedback.grammarErrors.length})</h3>
                      <div className="errors-list">
                        {feedback.grammarErrors.map((error, index) => (
                          <div key={index} className="error-item">
                            <div className="error-header">
                              <span className="error-type">Grammar</span>
                              <span className="error-title">{error.error}</span>
                            </div>
                            <p className="error-suggestion">{error.suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="suggestions-card">
                    <h3>💡 Improvement Tips</h3>
                    <div className="suggestions-list">
                      {feedback.suggestions.map((suggestion, index) => (
                        <div key={index} className="suggestion-item">
                          <div className="suggestion-icon">💡</div>
                          <p>{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {audioURL && (
                    <div className="audio-card">
                      <h3>🎵 Your Recording</h3>
                      <div className="audio-player">
                        <audio controls src={audioURL}>
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </div>
                  )}
                </div>

                <div className="results-actions">
                  <button className="primary-btn practice-again-btn" onClick={resetSession}>
                    <span className="btn-icon">🔄</span>
                    Practice Again
                  </button>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="single-practice">
      <div className="practice-container">
        <div className="progress-indicator">
          <div className={`progress-step ${currentStep === 'ready' ? 'active' : ''} ${['recording', 'analyzing', 'results'].includes(currentStep) ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span>Ready</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep === 'recording' ? 'active' : ''} ${['analyzing', 'results'].includes(currentStep) ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span>Recording</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep === 'analyzing' ? 'active' : ''} ${currentStep === 'results' ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <span>Analyzing</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep === 'results' ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <span>Results</span>
          </div>
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
};

export default SingleUserPractice;