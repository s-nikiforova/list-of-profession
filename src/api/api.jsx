const API_BASE = import.meta.env.VITE_API_BASE;

const authHeaders = (key) => ({
  'Content-Type': 'application/json',
  ...(key && { 'SECRET-API-KEY-Z': key }),
});

export const fetchJobs = async () => {
  const res = await fetch(`${API_BASE}/jobs`);
  if (!res.ok) throw new Error('Ошибка загрузки');
  return res.json();
};

export const getJob = async (id) => {
  const res = await fetch(`${API_BASE}/jobs/${id}`);
  if (!res.ok) throw new Error('Ошибка загрузки профессии');
  return res.json();
};

export const createJob = async (jobData, adminKey) => {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: authHeaders(adminKey),
    body: JSON.stringify(jobData),
  });
  if (!res.ok) throw new Error('Ошибка создания');
  return res.json();
};

export const updateJob = async (id, jobData, adminKey) => {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    method: 'PATCH',
    headers: authHeaders(adminKey),
    body: JSON.stringify(jobData),
  });
  if (!res.ok) throw new Error('Ошибка обновления');
  return res.json();
};

export const deleteJob = async (id, adminKey) => {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    method: 'DELETE',
    headers: authHeaders(adminKey),
  });
  if (!res.ok) throw new Error('Ошибка удаления');
  return true;
};