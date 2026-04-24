import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
     if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await api.get('/tasks');
    setTasks(res.data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    await api.post('/tasks', { title });
    setTitle('');
    fetchTasks();
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/tasks/${id}`, { status });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    console.log('Logout error', err);
  } finally {
    localStorage.removeItem('token');
    navigate('/login');
  }
};

  return (
    <div>
      <h2>Task Board</h2>
      <button onClick={logout}>Logout</button>

      <form onSubmit={addTask}>
        <input
          placeholder="New task..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      {tasks.map(task => (
        <div key={task.id}>
          <span>{task.title} — <b>{task.status}</b></span>
          <button onClick={() => updateStatus(task.id, 'in-progress')}>In Progress</button>
          <button onClick={() => updateStatus(task.id, 'done')}>Done</button>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}