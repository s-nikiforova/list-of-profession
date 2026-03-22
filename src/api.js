const API_URL = 'https://open-api-eta-one.vercel.app';
const SECRET_KEY = 'sdmjk12uo1i3j12u3i21uj31y3wnwk2mk3h123k1j3k13123j123h123jk12viyuj3i78136213541526ubdseewwSSDqj13u21g3SHGADdsan';

export async function getJobs() {
  const res = await fetch(`${API_URL}/jobs/`);
  if (!res.ok) throw new Error('Ошибка загрузки списка');
  return res.json();
}

export async function getJob(id) {
  const res = await fetch(`${API_URL}/jobs/${id}`);
  if (!res.ok) throw new Error('Профессия не найдена');
  return res.json();
}

export async function createJob(jobData) {
  const res = await fetch(`${API_URL}/jobs/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'SECRET-API-KEY-Z': SECRET_KEY
    },
    body: JSON.stringify(jobData)
  });
  if (!res.ok) throw new Error('Ошибка создания');
  return res.json();
}

export async function updateJob(id, jobData) {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'SECRET-API-KEY-Z': SECRET_KEY
    },
    body: JSON.stringify(jobData)
  });
  if (!res.ok) throw new Error('Ошибка обновления');
  return res.json();
}

export async function deleteJob(id) {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'DELETE',
    headers: {
      'SECRET-API-KEY-Z': SECRET_KEY
    }
  });
  if (!res.ok) throw new Error('Ошибка удаления');
  return true;
}