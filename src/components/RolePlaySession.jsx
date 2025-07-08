
import { useState, useEffect } from 'react';
import './RolePlaySession.css';

const RolePlaySession = ({ userCount }) => {
  const [currentScenario, setCurrentScenario] = useState(null);
  const [sessionPhase, setSessionPhase] = useState('setup'); // setup, active, feedback
  const [timer, setTimer] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(false);
  const [userRoles, setUserRoles] = useState({});
  const [sessionFeedback, setSessionFeedback] = useState(null);

  const scenarios = [
    {
      id: 'interview',
      title: 'Job Interview',
      description: 'Practice professional interview skills',
      roles: ['Interviewer', 'Candidate', 'Observer'],
      icon: '💼'
    },
    {
      id: 'restaurant',
      title: 'Restaurant Ordering',
      description: 'Practice ordering food and dining conversation',
      roles: ['Customer', 'Waiter', 'Friend'],
      icon: '🍽️'
    },
    {
      id: 'shopping',
      title: 'Shopping Experience',
      description: 'Practice shopping and negotiation skills',
      roles: ['Customer', 'Shopkeeper', 'Assistant'],
      icon: '🛍️'
    },
    {
      id: 'travel',
      title: 'Travel & Tourism',
      description: 'Practice travel-related conversations',
      roles: ['Tourist', 'Guide', 'Local'],
      icon: '✈️'
    }
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (!isActive || timer === 0) {
      if (timer === 0 && sessionPhase === 'active') {
        handleSessionEnd();
      }
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer, sessionPhase]);

  const selectScenario = (scenario) => {
    setCurrentScenario(scenario);
    // Auto-assign roles based on user count
    const roles = {};
    for (let i = 0; i < userCount; i++) {
      roles[`User ${i + 1}`] = scenario.roles[i] || 'Participant';
    }
    setUserRoles(roles);
  };

  const startSession = () => {
    setSessionPhase('active');
    setIsActive(true);
    setTimer(300); // Reset to 5 minutes
  };

  const handleSessionEnd = () => {
    setIsActive(false);
    setSessionPhase('feedback');
    
    // Generate sample feedback
    const feedback = {
      overallScore: Math.floor(Math.random() * 30) + 70,
      individual: Object.keys(userRoles).map(user => ({
        name: user,
        role: userRoles[user],
        score: Math.floor(Math.random() * 30) + 70,
        strengths: ['Good pronunciation', 'Clear communication'],
        improvements: ['Use more varied vocabulary', 'Practice fluency']
      })),
      suggestions: [
        'Practice more natural conversation flow',
        'Work on role-specific vocabulary',
        'Focus on active listening skills'
      ]
    };
    
    setSessionFeedback(feedback);
  };

  const resetSession = () => {
    setCurrentScenario(null);
    setSessionPhase('setup');
    setTimer(300);
    setIsActive(false);
    setUserRoles({});
    setSessionFeedback(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (sessionPhase === 'feedback' && sessionFeedback) {
    return (
      <div className="roleplay-session">
        <div className="feedback-header">
          <h2>🎉 Session Complete!</h2>
          <p>Here's your performance summary</p>
        </div>

        <div className="overall-score">
          <div className="score-card">
            <div className="score-circle">
              <span className="score-number">{sessionFeedback.overallScore}%</span>
            </div>
            <div className="score-details">
              <h3>Overall Team Performance</h3>
              <p>Great job working together!</p>
            </div>
          </div>
        </div>

        <div className="individual-feedback">
          <h3>Individual Performance</h3>
          <div className="feedback-grid">
            {sessionFeedback.individual.map((user, index) => (
              <div key={index} className="user-feedback">
                <div className="user-header">
                  <h4>{user.name}</h4>
                  <span className="user-role">{user.role}</span>
                  <span className="user-score">{user.score}%</span>
                </div>
                <div className="feedback-details">
                  <div className="strengths">
                    <h5>✅ Strengths</h5>
                    <ul>
                      {user.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="improvements">
                    <h5>🎯 Areas for Improvement</h5>
                    <ul>
                      {user.improvements.map((improvement, i) => (
                        <li key={i}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="session-suggestions">
          <h3>💡 Group Suggestions</h3>
          <div className="suggestions-list">
            {sessionFeedback.suggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-item">
                <span className="suggestion-icon">💡</span>
                <p>{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button className="new-session-button" onClick={resetSession}>
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  if (sessionPhase === 'active' && currentScenario) {
    return (
      <div className="roleplay-session">
        <div className="active-session">
          <div className="session-header">
            <div className="scenario-info">
              <span className="scenario-icon">{currentScenario.icon}</span>
              <h2>{currentScenario.title}</h2>
            </div>
            <div className="timer">
              <span className="timer-icon">⏰</span>
              <span className="time">{formatTime(timer)}</span>
            </div>
          </div>

          <div className="role-assignments">
            <h3>Role Assignments</h3>
            <div className="roles-grid">
              {Object.entries(userRoles).map(([user, role]) => (
                <div key={user} className="role-card">
                  <span className="user-name">{user}</span>
                  <span className="user-role">{role}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="session-controls">
            <div className="recording-status">
              <div className="recording-indicator active"></div>
              <span>Session in Progress</span>
            </div>
            <button className="end-button" onClick={handleSessionEnd}>
              End Session
            </button>
          </div>

          <div className="scenario-guidance">
            <h3>Scenario Guidance</h3>
            <p>{currentScenario.description}</p>
            <div className="tips">
              <h4>💡 Tips for this scenario:</h4>
              <ul>
                <li>Stay in character throughout the conversation</li>
                <li>Use role-appropriate language and tone</li>
                <li>Listen actively to other participants</li>
                <li>Don't be afraid to ask questions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="roleplay-session">
      <div className="session-setup">
        <div className="setup-header">
          <h2>🎭 Role Play Session</h2>
          <p>Choose a scenario and start practicing real-life conversations</p>
          <div className="user-count-info">
            <span>👥 {userCount} participants</span>
          </div>
        </div>

        <div className="scenarios-grid">
          {scenarios.map((scenario) => (
            <div 
              key={scenario.id}
              className={`scenario-card ${currentScenario?.id === scenario.id ? 'selected' : ''}`}
              onClick={() => selectScenario(scenario)}
            >
              <div className="scenario-icon">{scenario.icon}</div>
              <h3>{scenario.title}</h3>
              <p>{scenario.description}</p>
              <div className="available-roles">
                <h4>Available Roles:</h4>
                <div className="roles-list">
                  {scenario.roles.slice(0, userCount).map((role, index) => (
                    <span key={index} className="role-tag">{role}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentScenario && (
          <div className="role-preview">
            <h3>Role Assignments Preview</h3>
            <div className="preview-grid">
              {Object.entries(userRoles).map(([user, role]) => (
                <div key={user} className="preview-role">
                  <span className="preview-user">{user}</span>
                  <span className="preview-arrow">→</span>
                  <span className="preview-role-name">{role}</span>
                </div>
              ))}
            </div>
            <button className="start-roleplay-button" onClick={startSession}>
              Start Role Play (5 min)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolePlaySession;
