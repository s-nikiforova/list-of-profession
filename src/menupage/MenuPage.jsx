import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob } from '../api.js';


function MenuPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const data = await getJob(id);
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);
        

  const handleGoBack = () => {
    navigate(-1); 
  };

  if (loading) {
    return (
      <div className="menu-page-wrapper">
        <button className="back-button" onClick={handleGoBack}>← Назад</button>
        <div className="job-details-container">
          <div className="job-visual">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-page-wrapper">
        <button className="back-button" onClick={handleGoBack}>← Назад</button>
        <div className="job-details-container">
          <div className="job-visual">Ошибка: {error}</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="menu-page-wrapper">
        <button className="back-button" onClick={handleGoBack}>← Назад</button>
        <div className="job-details-container">
          <div className="job-visual">Профессия не найдена</div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page-wrapper">
      <button className="back-button" onClick={handleGoBack}>← Назад</button>
      <div className="job-details-container">
        <div className="job-visual">
          <img 
            className="job-big-img" 
            src={job.image || 'https://via.placeholder.com/600x400?text=Нет+изображения'} 
            alt={job.name} 
          />
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