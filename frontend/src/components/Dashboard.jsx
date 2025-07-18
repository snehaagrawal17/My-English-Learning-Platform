import { useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ userStats, setCurrentView }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const performanceData = [
    { skill: 'Grammar', level: 'Advanced', progress: 85, trend: 'up' },
    { skill: 'Vocabulary', level: 'Intermediate', progress: 72, trend: 'up' },
    { skill: 'Pronunciation', level: 'Advanced', progress: 90, trend: 'stable' },
    { skill: 'Conversation', level: 'Intermediate', progress: 68, trend: 'up' }
  ];

  const recentSessions = [
    { 
      id: 1, 
      type: 'Business English', 
      duration: '45 min', 
      score: 92, 
      date: '2024-01-15',
      status: 'completed'
    },
    { 
      id: 2, 
      type: 'Grammar Assessment', 
      duration: '30 min', 
      score: 88, 
      date: '2024-01-14',
      status: 'completed'
    },
    { 
      id: 3, 
      type: 'Pronunciation Practice', 
      duration: '25 min', 
      score: 95, 
      date: '2024-01-13',
      status: 'completed'
    }
  ];

  const upcomingGoals = [
    { goal: 'Complete Advanced Grammar Module', deadline: '2024-01-20', progress: 75 },
    { goal: 'Achieve 95% Pronunciation Accuracy', deadline: '2024-01-25', progress: 90 },
    { goal: 'Master Business Vocabulary', deadline: '2024-02-01', progress: 45 }
  ];

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <h1>Learning Dashboard</h1>
            <p className="user-greeting">Welcome back, continue your progress</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => setCurrentView('practice')}>
              Start Practice
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentView('assessment')}>
              Take Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-nav">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`nav-tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
          <button 
            className={`nav-tab ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            Sessions
          </button>
          <button 
            className={`nav-tab ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
          >
            Goals
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="content-section">
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <h3>Current Level</h3>
                  <span className="metric-icon level-icon">L</span>
                </div>
                <div className="metric-value">{userStats.level}</div>
                <div className="metric-label">Intermediate</div>
              </div>
              
              <div className="metric-card">
                <div className="metric-header">
                  <h3>Study Streak</h3>
                  <span className="metric-icon streak-icon">S</span>
                </div>
                <div className="metric-value">{userStats.streak}</div>
                <div className="metric-label">Days consecutive</div>
              </div>
              
              <div className="metric-card">
                <div className="metric-header">
                  <h3>Total Points</h3>
                  <span className="metric-icon points-icon">P</span>
                </div>
                <div className="metric-value">{userStats.coins}</div>
                <div className="metric-label">Earned this month</div>
              </div>
              
              <div className="metric-card">
                <div className="metric-header">
                  <h3>Achievements</h3>
                  <span className="metric-icon achievement-icon">A</span>
                </div>
                <div className="metric-value">{userStats.badges.length}</div>
                <div className="metric-label">Badges unlocked</div>
              </div>
            </div>

            <div className="overview-grid">
              <div className="practice-options">
                <h3>Practice Options</h3>
                <div className="option-list">
                  <div className="option-item" onClick={() => setCurrentView('grammar')}>
                    <div className="option-info">
                      <h4>Grammar Mastery</h4>
                      <p>Advanced grammar rules and exercises</p>
                    </div>
                    <div className="option-meta">
                      <span className="difficulty">Advanced</span>
                      <span className="duration">30-45 min</span>
                    </div>
                  </div>
                  
                  <div className="option-item" onClick={() => setCurrentView('vocabulary')}>
                    <div className="option-info">
                      <h4>Vocabulary Builder</h4>
                      <p>Expand your word knowledge and usage</p>
                    </div>
                    <div className="option-meta">
                      <span className="difficulty">Intermediate</span>
                      <span className="duration">20-30 min</span>
                    </div>
                  </div>
                  
                  <div className="option-item" onClick={() => setCurrentView('pronunciation')}>
                    <div className="option-info">
                      <h4>Pronunciation Training</h4>
                      <p>Perfect your accent and speaking clarity</p>
                    </div>
                    <div className="option-meta">
                      <span className="difficulty">Advanced</span>
                      <span className="duration">25-35 min</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="quick-stats">
                <h3>Quick Statistics</h3>
                <div className="stats-list">
                  <div className="stat-item">
                    <span className="stat-label">This Week</span>
                    <span className="stat-value">12h 30m</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Average Session</span>
                    <span className="stat-value">35 minutes</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Completion Rate</span>
                    <span className="stat-value">87%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Best Streak</span>
                    <span className="stat-value">23 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="content-section">
            <div className="performance-grid">
              <div className="skill-analysis">
                <h3>Skill Analysis</h3>
                <div className="skill-list">
                  {performanceData.map((skill, index) => (
                    <div key={index} className="skill-item">
                      <div className="skill-info">
                        <h4>{skill.skill}</h4>
                        <span className="skill-level">{skill.level}</span>
                      </div>
                      <div className="skill-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${skill.progress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{skill.progress}%</span>
                      </div>
                      <div className={`trend-indicator ${skill.trend}`}>
                        {skill.trend === 'up' ? '↗' : skill.trend === 'down' ? '↘' : '→'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="achievement-showcase">
                <h3>Recent Achievements</h3>
                <div className="achievements-grid">
                  {userStats.badges.map((badge, index) => (
                    <div key={index} className="achievement-item">
                      <div className="achievement-badge">
                        <span className="badge-icon">★</span>
                      </div>
                      <div className="achievement-info">
                        <h4>{badge}</h4>
                        <p>Earned recently</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="content-section">
            <div className="sessions-container">
              <h3>Recent Learning Sessions</h3>
              <div className="sessions-table">
                <div className="table-header">
                  <div className="col-type">Type</div>
                  <div className="col-duration">Duration</div>
                  <div className="col-score">Score</div>
                  <div className="col-date">Date</div>
                  <div className="col-status">Status</div>
                </div>
                <div className="table-body">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="table-row">
                      <div className="col-type">{session.type}</div>
                      <div className="col-duration">{session.duration}</div>
                      <div className="col-score">
                        <span className="score-badge">{session.score}%</span>
                      </div>
                      <div className="col-date">{session.date}</div>
                      <div className="col-status">
                        <span className={`status-badge ${session.status}`}>
                          {session.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="content-section">
            <div className="goals-container">
              <h3>Learning Goals</h3>
              <div className="goals-list">
                {upcomingGoals.map((goal, index) => (
                  <div key={index} className="goal-item">
                    <div className="goal-content">
                      <h4>{goal.goal}</h4>
                      <p className="goal-deadline">Due: {goal.deadline}</p>
                      <div className="goal-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{goal.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;