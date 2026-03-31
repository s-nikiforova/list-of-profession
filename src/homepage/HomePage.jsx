// src/homepage/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchJobs, createJob, updateJob, deleteJob } from '../api/api';
import { SECRET_KEY } from '../api/constants';
import './App.css';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [imagePreview, setImagePreview] = useState('');
  
  // Состояние для пагинации
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const stored = sessionStorage.getItem('isAdmin');
    if (stored === 'true') setIsAdmin(true);
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const key = prompt('Введите секретный ключ:');
    if (key === SECRET_KEY) {
      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', 'true');
    } else if (key) alert('Неверный ключ');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
  };

  const openAddForm = () => {
    setEditingJob(null);
    setFormData({ name: '', description: '', image: '' });
    setImagePreview('');
    setShowForm(true);
  };

  const openEditForm = (job) => {
    setEditingJob(job);
    setFormData({
      name: job.name,
      description: job.description || '',
      image: job.image || '',
    });
    setImagePreview(job.image || '');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingJob(null);
    setImagePreview('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой (макс. 5 МБ)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setFormData({ ...formData, image: base64 });
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Название обязательно');
      return;
    }
    try {
      if (editingJob) {
        await updateJob(editingJob.id, {
          name: formData.name,
          description: formData.description || undefined,
          image: formData.image || undefined,
        }, SECRET_KEY);
      } else {
        await createJob({
          name: formData.name,
          description: formData.description || undefined,
          image: formData.image || undefined,
        }, SECRET_KEY);
      }
      await loadJobs();
      closeForm();
    } catch {
      alert('Ошибка сохранения');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить профессию?')) return;
    try {
      await deleteJob(id, SECRET_KEY);
      await loadJobs();
    } catch {
      alert('Ошибка удаления');
    }
  };

  const showMoreJobs = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  if (loading) return <div className="app-container">Загрузка...</div>;
  if (error) return <div className="app-container">{error}</div>;

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <span onClick={handleLogin} style={{ cursor: 'pointer' }}>
            Список профессий
          </span>
        </h1>
        {isAdmin && (
          <button className="logout-btn" onClick={handleLogout}>
            Выйти
          </button>
        )}
      </header>

      <div className="hero">
        <h2>IT-профессии ({jobs.length})</h2>
        {isAdmin && (
          <button className="add-button" onClick={openAddForm}>
            Добавить профессию
          </button>
        )}
      </div>

      <div className="features">
        {/* Добавлен .slice для отображения только нужного количества */}
        {jobs.slice(0, visibleCount).map((job) => (
          <div key={job.id} className="feature-card">
            <Link 
              to={`/job/${job.id}`} 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div className="feature-image">
                {job.image ? (
                  <img src={job.image} alt={job.name} />
                ) : (
                  <div style={{ fontSize: '2rem' }}>🖥️</div>
                )}
              </div>
              <h3>{job.name}</h3>
              {job.description && <p>{job.description}</p>}
            </Link>
            {isAdmin && (
              <div className="card-actions">
                <button
                  className="edit-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openEditForm(job);
                  }}
                >
                  Ред.
                </button>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(job.id);
                  }}
                >
                  Удал.
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Кнопка теперь ВНЕ цикла map, чтобы не дублироваться */}
      {visibleCount < jobs.length && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
          <button className="add-button" onClick={showMoreJobs}>
            Смотреть еще
          </button>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="job-form" onClick={(e) => e.stopPropagation()}>
            <h3>{editingJob ? 'Редактировать профессию' : 'Новая профессия'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Название *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Описание"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="file-input">
                <label>Изображение (загрузить файл)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {imagePreview && (
                  <div className="preview">
                    <p>Предпросмотр:</p>
                    <img src={imagePreview} alt="preview" style={{ maxWidth: '100%', maxHeight: '150px' }} />
                  </div>
                )}
              </div>
              <div className="form-buttons">
                <button type="submit">Сохранить</button>
                <button type="button" onClick={closeForm}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
