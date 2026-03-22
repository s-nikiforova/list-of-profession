import React, { useState, useEffect } from 'react';
import { getJobs, createJob, updateJob, deleteJob } from '../api.js';
import { useNavigate } from 'react-router-dom';
import './App.css';


function HomePage() {
  const navigate = useNavigate();

  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const data = await getJobs();   // ← вызываем функцию
        setProfessions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, image: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', image: '' });
    setEditingJob(null);
    setSelectedFile(null);
  };

  const handleAddClick = () => resetForm();

  const handleEditClick = (job, e) => {
    e.stopPropagation();
    setEditingJob(job);
    setFormData({
      name: job.name,
      desc: job.description,
      image: job.image || '' 
    });
    setSelectedFile(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.desc.trim()) return alert('Заполните поля');

    const jobData = {
      name: formData.name,
      desc: formData.desc,
      image: formData.image || 'https://via.placeholder.com/150'
    };

    try {
      if (editingJob) {
        const updated = await updateJob(editingJob.id, jobData); // ← обновление
        setProfessions(prev => prev.map(j => j.id === updated.id ? updated : j));
      } else {
        const created = await createJob(jobData); // ← создание
        setProfessions(prev => [...prev, created]);
      }
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };
        

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Точно удалить?')) return;
    try {
      await deleteJob(id); // ← удаление
      setProfessions(prev => prev.filter(j => j.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="app-container">Загрузка...</div>;
  if (error) return <div className="app-container">Ошибка: {error}</div>;

  return (
    <div className="app-container">
      <header className="header">
        <h1>Список <span>профессий</span></h1>
      </header>

      <main className="main-content">
        <button className="add-button" onClick={handleAddClick}>
          Добавить профессию
        </button>

        {(editingJob !== null || formData.name || formData.description || formData.image || selectedFile) && (
          <form className="job-form" onSubmit={handleSave}>
            <h3>{editingJob ? 'Редактировать' : 'Добавить'} профессию</h3>

            <input
              type="text"
              name="name"
              placeholder="Название"
              value={formData.name}
              onChange={handleFormChange}
              required
            />

            <textarea
              name="description"
              placeholder="Описание"
              value={formData.description}
              onChange={handleFormChange}
              required
            />

            <div className="file-input">
              <label>Изображение (выберите файл):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {selectedFile && <span>Выбран файл: {selectedFile.name}</span>}
            </div>

            {formData.image && (
              <div className="preview">
                <p>Превью:</p>
                <img src={formData.image} alt="preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
              </div>
            )}

            <div className="form-buttons">
              <button type="submit">Сохранить</button>
              <button type="button" onClick={resetForm}>Отмена</button>
            </div>
          </form>
        )}

        <div className="features">
          {professions.map((job) => (
            <div
              key={job.id}
              className="feature-card"
              onClick={() => navigate(`/job/${job.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="feature-image">
                {/* Используем поле image (или imageUrl, если оно так называется) */}
                <img src={job.image || 'https://via.placeholder.com/150'} alt={job.name} />
              </div>
              <h3>{job.name}</h3>
              <p>{job.description}</p>
              <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                <button className="edit-btn" onClick={(e) => handleEditClick(job, e)}>✏️</button>
                <button className="delete-btn" onClick={(e) => handleDelete(job.id, e)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default HomePage;