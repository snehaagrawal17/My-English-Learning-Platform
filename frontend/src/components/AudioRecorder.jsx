import React, { useRef, useState } from "react";

function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [transcript, setTranscript] = useState("");
  const [grammarResult, setGrammarResult] = useState(null);
  const recognitionRef = useRef(null);

  const startRecording = () => {
    setAudioURL("");
    setTranscript("");
    setGrammarResult(null);

    // Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        checkGrammar(text);
      };
      recognitionRef.current.start();
    } else {
      alert("Speech recognition not supported in this browser.");
    }
    setRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setRecording(false);
  };

  // Grammar check using LanguageTool API (free, demo purpose)
  const checkGrammar = async (text) => {
    const response = await fetch("https://api.languagetoolplus.com/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `text=${encodeURIComponent(text)}&language=en-US`
    });
    const result = await response.json();
    setGrammarResult(result.matches);
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
      {transcript && (
        <div>
          <h4>Your Speech:</h4>
          <p>{transcript}</p>
        </div>
      )}
      {grammarResult && (
        <div>
          <h4>Suggestions:</h4>
          <ul>
            {grammarResult.length === 0 && <li>No issues found!</li>}
            {grammarResult.map((match, idx) => (
              <li key={idx}>
                <strong>{match.message}</strong>
                <br />
                <em>Suggestion: {match.replacements.map(r => r.value).join(", ")}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;