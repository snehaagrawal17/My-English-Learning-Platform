
import { useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ userStats, setCurrentView }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      id: 'grammar',
      title: 'Grammar Check',
      description: 'Upload audio and get instant grammar corrections',
      icon: '📝',
      color: '#3b82f6'
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation',
      description: 'Practice speaking and improve your pronunciation',
      icon: '🗣️',
      color: '#10b981'
    },
    {
      id: 'vocabulary',
      title: 'Vocabulary',
      description: 'Learn new words and expand your vocabulary',
      icon: '📚',
      color: '#f59e0b'
    },
    {
      id: 'conversation',
      title: 'Conversation',
      description: 'Practice real-life conversations',
      icon: '💬',
      color: '#8b5cf6'
    }
  ];

  const recentActivities = [
    { type: 'Grammar Check', score: 85, time: '2 hours ago' },
    { type: 'Pronunciation', score: 92, time: '1 day ago' },
    { type: 'Group Discussion', score: 78, time: '2 days ago' }
  ];

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h2 className="welcome-title">Welcome back!</h2>
        <p className="welcome-subtitle">Continue your English learning journey</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>Level {userStats.level}</h3>
            <p>Keep going!</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{userStats.streak} Days</h3>
            <p>Current streak</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🪙</div>
          <div className="stat-content">
            <h3>{userStats.coins}</h3>
            <p>Total coins</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏅</div>
          <div className="stat-content">
            <h3>{userStats.badges.length}</h3>
            <p>Badges earned</p>
          </div>
        </div>
      </div>

      <div className="practice-modes">
        <h3>Practice Modes</h3>
        <div className="mode-grid">
          <div className="mode-card" onClick={() => setCurrentView('single')}>
            <div className="mode-icon">👤</div>
            <h4>Solo Practice</h4>
            <p>Practice on your own with AI feedback</p>
            <button className="mode-button">Start Solo</button>
          </div>
          
          <div className="mode-card" onClick={() => setCurrentView('multi')}>
            <div className="mode-icon">👥</div>
            <h4>Group Practice</h4>
            <p>Practice with friends and colleagues</p>
            <button className="mode-button">Join Group</button>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h3>Learning Features</h3>
        <div className="features-grid">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className={`feature-card ${selectedFeature === feature.id ? 'selected' : ''}`}
              onClick={() => setSelectedFeature(feature.id)}
              style={{ borderColor: feature.color }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {recentActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-info">
                <h4>{activity.type}</h4>
                <p>{activity.time}</p>
              </div>
              <div className="activity-score">
                <span className="score">{activity.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="badges-section">
        <h3>Your Badges</h3>
        <div className="badges-list">
          {userStats.badges.map((badge, index) => (
            <div key={index} className="badge-item">
              <span className="badge-icon">🏅</span>
              <span className="badge-name">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
