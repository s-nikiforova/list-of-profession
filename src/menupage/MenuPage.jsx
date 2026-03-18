import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PROFESSIONS } from '../constants';
import "../homepage/App.css"; 

function MenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const job = PROFESSIONS.find(p => p.id === parseInt(id));

  if (!job) {
    return <div className="error">Профессия не найдена</div>;
  }

  return (
    <div className="menu-page-wrapper">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Вернуться к списку
      </button>

      <div className="job-details-container">
        <div className="job-visual">
          <img src={job.image} alt={job.name} className="job-big-img" />
        </div>

        <div className="job-content">
          <div className="job-header">
            <h2>{job.name}</h2>
          </div>
          <div className="job-description">
            <p>{job.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuPage;