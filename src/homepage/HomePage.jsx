import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { PROFESSIONS } from '../constants';


function App() {
  const navigate = useNavigate();
  return (
    <div className="app-container">
      <header className="header">
        <h1>Андрей<span>Грам</span></h1>
      </header>

      <main className="main-content">
        <section className="hero">
          <h1>Добро пожаловать</h1>
          <p>Простая и безопасная аутентификация для ваших проектов</p>
        </section>
        
<div className="features">
  {PROFESSIONS.map((job) => (
    <div 
      key={job.id} 
      className="feature-card" 
      onClick={() => navigate(`/job/${job.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="feature-icon">{job.icon}</div>
      <h3>{job.name}</h3>
      <p>{job.desc}</p>
    </div>
  ))}
</div>
      </main>
    </div>
  );
}

export default App;