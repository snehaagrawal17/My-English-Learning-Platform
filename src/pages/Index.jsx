
import { useState } from 'react';
import SingleUserPractice from '../components/SingleUserPractice';
import MultiUserSetup from '../components/MultiUserSetup';
import Dashboard from '../components/Dashboard';
import './Index.css';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userStats, setUserStats] = useState({
    coins: 150,
    streak: 7,
    level: 3,
    badges: ['Grammar Master', 'Speaking Pro']
  });

  const renderCurrentView = () => {
    switch (currentView) {
      case 'single':
        return <SingleUserPractice userStats={userStats} setUserStats={setUserStats} />;
      case 'multi':
        return <MultiUserSetup />;
      case 'dashboard':
      default:
        return <Dashboard userStats={userStats} setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">
                🎧
              </div>
              <h1 className="app-title">
                Speak Smart
              </h1>
            </div>
            
            <nav className="desktop-nav">
              <button 
                className={`nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentView('dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={`nav-button ${currentView === 'single' ? 'active' : ''}`}
                onClick={() => setCurrentView('single')}
              >
                Solo Practice
              </button>
              <button 
                className={`nav-button ${currentView === 'multi' ? 'active' : ''}`}
                onClick={() => setCurrentView('multi')}
              >
                Group Practice
              </button>
            </nav>

            <div className="user-stats">
              <div className="coins">
                <div className="coin-icon"></div>
                <span>{userStats.coins}</span>
              </div>
              <div className="streak">
                <span className="star">⭐</span>
                <span>{userStats.streak}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {renderCurrentView()}
      </main>

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <div className="mobile-nav-content">
          <button 
            className={`mobile-nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            <span className="icon">⭐</span>
            <span className="label">Dashboard</span>
          </button>
          <button 
            className={`mobile-nav-button ${currentView === 'single' ? 'active' : ''}`}
            onClick={() => setCurrentView('single')}
          >
            <span className="icon">👤</span>
            <span className="label">Solo</span>
          </button>
          <button 
            className={`mobile-nav-button ${currentView === 'multi' ? 'active' : ''}`}
            onClick={() => setCurrentView('multi')}
          >
            <span className="icon">👥</span>
            <span className="label">Group</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
