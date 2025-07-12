
import { useState } from 'react';
import RolePlaySession from './RolePlaySession';
import './MultiUserSetup.css';

const MultiUserSetup = () => {
  const [selectedUserCount, setSelectedUserCount] = useState(null);
  const [sessionType, setSessionType] = useState(null);
  const [currentView, setCurrentView] = useState('setup');

  const userOptions = [2, 3, 4];
  const sessionTypes = [
    {
      id: 'discussion',
      title: 'Group Discussion',
      description: 'Open discussion on various topics',
      icon: '💬'
    },
    {
      id: 'debate',
      title: 'Debate Session',
      description: 'Structured debate with different viewpoints',
      icon: '🎯'
    },
    {
      id: 'roleplay',
      title: 'Role Play',
      description: 'Interactive role-playing scenarios',
      icon: '🎭'
    }
  ];

  const handleStartSession = () => {
    if (sessionType === 'roleplay') {
      setCurrentView('roleplay');
    } else {
      alert(`${sessionType} session coming soon! Currently showing Role Play demo.`);
      setCurrentView('roleplay');
    }
  };

  if (currentView === 'roleplay') {
    return <RolePlaySession userCount={selectedUserCount || 2} />;
  }

  return (
    <div className="multi-setup">
      <div className="setup-header">
        <h2>Group Practice Setup</h2>
        <p>Choose your group size and session type to start practicing with others</p>
      </div>

      {/* User Count Selection */}
      <div className="setup-card">
        <div className="card-header">
          <h3>👥 Select Group Size</h3>
        </div>
        <div className="user-options">
          {userOptions.map((count) => (
            <button
              key={count}
              className={`user-option ${selectedUserCount === count ? 'selected' : ''}`}
              onClick={() => setSelectedUserCount(count)}
            >
              <div className="user-icons">
                {Array.from({ length: count }).map((_, i) => (
                  <span key={i} className="user-icon">👤</span>
                ))}
              </div>
              <span className="user-count">{count} Users</span>
            </button>
          ))}
        </div>
      </div>

      {/* Session Type Selection */}
      {selectedUserCount && (
        <div className="setup-card">
          <div className="card-header">
            <h3>Choose Session Type</h3>
          </div>
          <div className="session-types">
            {sessionTypes.map((type) => (
              <div 
                key={type.id}
                className={`session-type ${sessionType === type.id ? 'selected' : ''}`}
                onClick={() => setSessionType(type.id)}
              >
                <div className="session-icon">{type.icon}</div>
                <div className="session-content">
                  <h4>{type.title}</h4>
                  <p>{type.description}</p>
                  <div className="session-status">
                    {type.id === 'roleplay' ? (
                      <span className="status available">Available Now</span>
                    ) : (
                      <span className="status coming-soon">Coming Soon</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start Session */}
      {selectedUserCount && sessionType && (
        <div className="setup-card ready-card">
          <div className="ready-content">
            <h3>Ready to Start!</h3>
            <div className="selected-options">
              <span className="option-badge">{selectedUserCount} Users</span>
              <span className="option-badge">
                {sessionTypes.find(t => t.id === sessionType)?.title}
              </span>
            </div>
            <button className="start-button" onClick={handleStartSession}>
              Start Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiUserSetup;
