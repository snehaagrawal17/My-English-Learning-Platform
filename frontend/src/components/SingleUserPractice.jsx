
import { useState, useRef } from 'react';
import './SingleUserPractice.css';

const SingleUserPractice = ({ userStats, setUserStats }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentStep, setCurrentStep] = useState('ready'); // ready, recording, analyzing, results
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      // Reset states
      setAudioURL('');
      setTranscript('');
      setFeedback(null);
      setRecordingTime(0);
      setCurrentStep('recording');
      audioChunksRef.current = [];

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up MediaRecorder for audio recording
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

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Set up speech recognition with better initialization
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = "en-US";
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.maxAlternatives = 1;
        
        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started successfully');
        };
        
        recognitionRef.current.onresult = (event) => {
          console.log('Speech recognition result received:', event.results);
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
          
          // Show both final and interim results in real-time
          if (finalTranscript || interimTranscript) {
            const currentTranscript = (transcript + ' ' + finalTranscript + ' ' + interimTranscript).trim();
            console.log('Current transcript (including interim):', currentTranscript);
            setTranscript(currentTranscript);
          }
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please allow microphone access and try again.');
          }
        };
        
        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
        };
        
        // Start speech recognition
        try {
          recognitionRef.current.start();
          console.log('Speech recognition start() called');
        } catch (error) {
          console.error('Error starting speech recognition:', error);
        }
      } else {
        console.error('Speech recognition not supported');
        alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      }

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
      setCurrentStep('ready');
    }
  };

  const stopRecording = () => {
    console.log('Stopping recording...');
    console.log('Current transcript before stopping:', transcript);
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log('Speech recognition stopped');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsRecording(false);
    setCurrentStep('analyzing');

    // Wait a bit longer for speech recognition to finish processing
    setTimeout(() => {
      console.log('Final transcript for analysis:', transcript);
      if (transcript && transcript.trim().length > 0) {
        console.log('Analyzing actual transcript:', transcript);
        handleAnalyzeAudio(transcript);
      } else {
        console.log('No transcript detected, using fallback');
        // Only use fallback if no speech was detected
        handleAnalyzeAudio("No speech detected. Please try speaking more clearly.");
      }
    }, 2000); // Increased delay to ensure speech recognition finishes
  };

  const handleAnalyzeAudio = async (text) => {
    console.log('Starting analysis for text:', text);
    setTranscript(text);
    setIsAnalyzing(true);
    
    try {
      console.log('Attempting to call LanguageTool API...');
      // Grammar check using LanguageTool API
      const grammarResponse = await fetch("https://api.languagetoolplus.com/v2/check", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `text=${encodeURIComponent(text)}&language=en-US`
      });
      
      console.log('API Response status:', grammarResponse.status);
      
      if (!grammarResponse.ok) {
        throw new Error(`API responded with status: ${grammarResponse.status}`);
      }
      
      const grammarResult = await grammarResponse.json();
      console.log('Grammar result:', grammarResult);
      
      // Generate corrected text
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

      // Generate improvement suggestions based on analysis
      const suggestions = generateSuggestions(text, grammarErrors);
      
      // Calculate score based on grammar errors
      const score = Math.max(50, 100 - (grammarErrors.length * 10));
      
      const feedbackData = {
        originalText: text,
        correctedText: correctedText,
        grammarErrors: grammarErrors,
        suggestions: suggestions,
        score: score,
        recordingTime: recordingTime
      };
      
      console.log('Setting feedback data:', feedbackData);
      setFeedback(feedbackData);
      setIsAnalyzing(false);
      setCurrentStep('results');
      
      // Update user stats
      setUserStats(prev => ({
        ...prev,
        coins: prev.coins + Math.floor(score / 10),
        streak: prev.streak + (score > 80 ? 1 : 0)
      }));
      
    } catch (error) {
      console.error('Error analyzing audio:', error);
      console.log('Using fallback analysis...');
      
      // Enhanced fallback analysis with basic grammar checking
      const fallbackAnalysis = performBasicGrammarCheck(text);
      
      const sampleFeedback = {
        originalText: text,
        correctedText: fallbackAnalysis.correctedText,
        grammarErrors: fallbackAnalysis.grammarErrors,
        suggestions: fallbackAnalysis.suggestions,
        score: fallbackAnalysis.score,
        recordingTime: recordingTime
      };
      
      console.log('Setting fallback feedback:', sampleFeedback);
      setFeedback(sampleFeedback);
      setIsAnalyzing(false);
      setCurrentStep('results');
    }
  };

  // Basic grammar checking function for fallback
  const performBasicGrammarCheck = (text) => {
    const grammarErrors = [];
    let correctedText = text;
    
    // Check for common grammar issues
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
      },
      {
        pattern: /\b(2)\b/g,
        replacement: "to",
        message: 'Use proper word',
        suggestion: 'Use "to" instead of "2"'
      },
      {
        pattern: /\b(4)\b/g,
        replacement: "for",
        message: 'Use proper word',
        suggestion: 'Use "for" instead of "4"'
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
    
    // Check for sentence structure
    if (!text.endsWith('.') && !text.endsWith('!') && !text.endsWith('?')) {
      grammarErrors.push({
        error: 'Missing punctuation',
        suggestion: 'Add appropriate punctuation at the end of your sentence'
      });
    }
    
    // Check for very short sentences
    const words = text.split(' ').length;
    if (words < 3) {
      grammarErrors.push({
        error: 'Very short sentence',
        suggestion: 'Try to form more complete sentences'
      });
    }
    
    // Generate suggestions
    const suggestions = generateSuggestions(text, grammarErrors);
    
    // Calculate score
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
    
    // Analyze text length
    if (text.length < 50) {
      suggestions.push("Try to speak for longer periods to practice more complex sentences");
    }
    
    // Check for common issues
    if (text.toLowerCase().includes('um') || text.toLowerCase().includes('uh')) {
      suggestions.push("Try to reduce filler words like 'um' and 'uh' for more confident speech");
    }
    
    if (grammarErrors.length > 0) {
      suggestions.push("Focus on grammar rules, especially articles and verb tenses");
    }
    
    // Vocabulary suggestions
    const words = text.split(' ').length;
    if (words < 10) {
      suggestions.push("Expand your vocabulary by using more descriptive words");
    }
    
    // Pronunciation suggestions
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

  const renderStep = () => {
    switch (currentStep) {
      case 'ready':
        return (
          <div className="step-ready">
            <div className="step-icon">🎤</div>
            <h2>Ready to Practice</h2>
            <p>Click the button below to start recording your speech</p>
            <button className="start-recording-btn" onClick={startRecording}>
              Start Recording
            </button>
          </div>
        );

      case 'recording':
        return (
          <div className="step-recording">
            <div className="recording-animation">
              <div className="pulse-circle"></div>
              <div className="pulse-circle"></div>
              <div className="pulse-circle"></div>
            </div>
            <h2>Recording...</h2>
            <p className="recording-time">{formatTime(recordingTime)}</p>
            
            {/* Real-time transcript display like Google Translate */}
            <div className="realtime-transcript">
              <div className="transcript-header">
                <span className="mic-icon">🎤</span>
                <span className="status-text">Listening...</span>
              </div>
              <div className="transcript-content">
                {transcript ? (
                  <p className="transcript-text">{transcript}</p>
                ) : (
                  <p className="placeholder-text">Start speaking...</p>
                )}
              </div>
            </div>
            
            <button className="stop-recording-btn" onClick={stopRecording}>
              Stop & Analyze
            </button>
          </div>
        );

      case 'analyzing':
        return (
          <div className="step-analyzing">
            <div className="analyzing-animation">
              <div className="spinner"></div>
            </div>
            <h2>Analyzing Your Speech</h2>
            <p>Checking grammar and providing suggestions...</p>
            
            {/* Show what we're analyzing */}
            {transcript && (
              <div className="analyzing-transcript">
                <h3>Analyzing this text:</h3>
                <p>"{transcript}"</p>
              </div>
            )}
          </div>
        );

      case 'results':
        return (
          <div className="step-results">
            {feedback && (
              <>
                <div className="results-header">
                  <h2>Analysis Complete!</h2>
                  <div className="score-display">
                    <span className="score-label">Your Score:</span>
                    <span className="score-value">{feedback.score}%</span>
                  </div>
                </div>

                <div className="results-content">
                  <div className="text-comparison">
                    <div className="original-text">
                      <h3>What You Said:</h3>
                      <p>{feedback.originalText}</p>
                    </div>
                    <div className="corrected-text">
                      <h3>Corrected Version:</h3>
                      <p>{feedback.correctedText}</p>
                    </div>
                  </div>

                  {feedback.grammarErrors.length > 0 && (
                    <div className="grammar-errors">
                      <h3>Grammar Issues Found:</h3>
                      {feedback.grammarErrors.map((error, index) => (
                        <div key={index} className="error-item">
                          <span className="error-icon">⚠️</span>
                          <div className="error-content">
                            <strong>{error.error}</strong>
                            <p>{error.suggestion}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="improvement-suggestions">
                    <h3>💡 Improvement Tips:</h3>
                    {feedback.suggestions.map((suggestion, index) => (
                      <div key={index} className="suggestion-item">
                        <span className="suggestion-icon">💡</span>
                        <p>{suggestion}</p>
                      </div>
                    ))}
                  </div>

                  {audioURL && (
                    <div className="audio-playback">
                      <h3>🎵 Your Recording:</h3>
                      <audio controls src={audioURL} style={{ width: '100%', marginTop: '10px' }} />
                    </div>
                  )}

                  {/* Manual transcript input as backup */}
                  {!transcript || transcript.trim() === '' ? (
                    <div className="manual-transcript">
                      <h3>📝 Manual Transcript</h3>
                      <p>Speech recognition didn't capture your words. Please type what you said:</p>
                      <textarea 
                        className="transcript-input"
                        placeholder="Type what you said here..."
                        rows="3"
                        onChange={(e) => setTranscript(e.target.value)}
                      />
                      <button 
                        className="analyze-manual-btn"
                        onClick={() => {
                          if (transcript && transcript.trim()) {
                            handleAnalyzeAudio(transcript);
                          }
                        }}
                      >
                        Analyze My Text
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="results-actions">
                  <button className="new-session-btn" onClick={resetSession}>
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
        {renderStep()}
      </div>
    </div>
  );
};

export default SingleUserPractice;