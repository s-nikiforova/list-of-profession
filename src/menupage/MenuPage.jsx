import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob } from '../api/api.jsx';

const MenuPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJob(id);
        setJob(data);
      } catch (err) {
        setError('Не удалось загрузить профессию');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <div className="menu-page-wrapper">Загрузка...</div>;
  if (error) return <div className="menu-page-wrapper">{error}</div>;

  return (
    <div className="menu-page-wrapper">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Назад
      </button>
      <div className="job-details-container">
        <div className="job-visual">
          {job.image ? (
            <img src={job.image} alt={job.name} className="job-big-img" />
          ) : (
            <div className="job-big-img" style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
              🖥️
            </div>
          )}
        </div>
        <div className="job-content">
          <div className="job-header">
            <h2>{job.name}</h2>
          </div>
          <div className="job-description">
            <p>{job.description || 'Описание отсутствует'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;