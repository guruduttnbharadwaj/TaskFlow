import { useState, useEffect } from 'react'
import { User, Lock, LogOut, Plus, Trash2, Check, Search, Calendar, LayoutDashboard, ChevronRight } from 'lucide-react'

const API_URL = "http://localhost:5000/api";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState(token ? 'dashboard' : 'login');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  useEffect(() => {
    if (token) setView('dashboard');
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUsername('');
    setView('login');
  };

  return (
    <div className="app-wrapper">
      {/* Global Styles for Animations & Hover Effects */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        :root {
          --primary: #4f46e5;
          --primary-hover: #4338ca;
          --bg-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          --card-bg: rgba(255, 255, 255, 0.95);
          --text-main: #1f2937;
          --text-muted: #6b7280;
          --danger: #ef4444;
          --success: #10b981;
        }

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background: var(--bg-gradient);
          color: var(--text-main);
          min-height: 100vh;
        }

        .app-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .glass-card {
          background: var(--card-bg);
          border-radius: 16px;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.5);
          backdrop-filter: blur(12px);
          overflow: hidden;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
          transition: all 0.2s;
        }
        .btn-primary:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .btn-icon:hover {
          background: #f3f4f6;
          color: var(--primary);
        }

        .task-item {
          transition: all 0.2s;
        }
        .task-item:hover {
          background: #f9fafb;
          transform: scale(1.005);
        }

        .input-focus:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
      `}</style>

      {/* HEADER */}
      <header style={{ 
        width: '100%', 
        maxWidth: '800px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        padding: '1rem 0'
      }} className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'var(--primary)', 
            padding: '8px', 
            borderRadius: '10px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}>
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>TaskFlow</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Manage your day</span>
          </div>
        </div>
        
        {token && (
          <button onClick={handleLogout} className="btn-icon" style={{
            padding: '8px 16px',
            border: '1px solid #e5e7eb',
            background: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600',
            color: 'var(--text-muted)',
            transition: 'all 0.2s'
          }}>
            <LogOut size={16} /> Logout
          </button>
        )}
      </header>

      {/* VIEW ROUTING */}
      <main style={{ width: '100%', maxWidth: '800px' }} className="fade-in">
        {view === 'login' && (
          <AuthForm type="login" setToken={setToken} setUsername={setUsername} switchToRegister={() => setView('register')} />
        )}

        {view === 'register' && (
          <AuthForm type="register" setToken={setToken} setUsername={setUsername} switchToLogin={() => setView('login')} />
        )}

        {view === 'dashboard' && token && (
          <Dashboard token={token} username={username} />
        )}
      </main>
    </div>
  )
}

// --- AUTH FORM COMPONENT ---
function AuthForm({ type, setToken, setUsername, switchToRegister, switchToLogin }) {
  const [formUser, setFormUser] = useState('');
  const [formPass, setFormPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = type === 'login' ? '/login' : '/register';
    
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formUser, password: formPass })
      });
      
      const data = await res.json();
      if (!data.success && !data.token) throw new Error(data.error || "Action failed");

      if (type === 'register') {
        alert("Registration Successful! Please Login.");
        switchToLogin();
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        setToken(data.token);
        setUsername(data.username);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card fade-in" style={{ maxWidth: '400px', margin: '0 auto', padding: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          {type === 'login' ? 'Enter your details to access your workspace' : 'Start organizing your tasks today'}
        </p>
      </div>

      {error && (
        <div style={{ 
          background: '#fee2e2', 
          color: '#b91c1c', 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-focus" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: '#f9fafb', 
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '1rem',
          transition: 'all 0.2s'
        }}>
          <User size={20} style={{ color: '#9ca3af', minWidth: '20px' }} />
          <input 
            style={{ 
              border: 'none', 
              background: 'transparent', 
              outline: 'none', 
              marginLeft: '12px', 
              width: '100%',
              fontSize: '1rem',
              color: 'var(--text-main)'
            }} 
            placeholder="Username" 
            value={formUser} 
            onChange={e => setFormUser(e.target.value)} 
            required 
          />
        </div>

        <div className="input-focus" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: '#f9fafb', 
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '1.5rem',
          transition: 'all 0.2s'
        }}>
          <Lock size={20} style={{ color: '#9ca3af', minWidth: '20px' }} />
          <input 
            style={{ 
              border: 'none', 
              background: 'transparent', 
              outline: 'none', 
              marginLeft: '12px', 
              width: '100%',
              fontSize: '1rem',
              color: 'var(--text-main)'
            }} 
            type="password" 
            placeholder="Password" 
            value={formPass} 
            onChange={e => setFormPass(e.target.value)} 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '14px', 
            border: 'none', 
            borderRadius: '10px', 
            fontSize: '1rem', 
            fontWeight: '600', 
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Processing...' : (type === 'login' ? 'Sign In' : 'Create Account')}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {type === 'login' ? "New here? " : "Already have an account? "}
          <button 
            onClick={type === 'login' ? switchToRegister : switchToLogin} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--primary)', 
              fontWeight: '600', 
              cursor: 'pointer',
              padding: 0
            }}
          >
            {type === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

// --- DASHBOARD COMPONENT ---
function Dashboard({ token, username }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [search, setSearch] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, { headers: { 'Authorization': token } });
      const data = await res.json();
      setProfile(data);
    } catch (e) { console.error(e); }
  }

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`, { headers: { 'Authorization': token } });
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
    } catch (e) { console.error(e); }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify({ text: newTask })
    });
    setNewTask('');
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await fetch(`${API_URL}/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify({ completed: !task.completed })
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    if(!confirm("Delete this task?")) return;
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': token }
    });
    fetchTasks();
  };

  const filteredTasks = tasks.filter(t => 
    t.text.toLowerCase().includes(search.toLowerCase())
  );

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="fade-in">
      {/* Profile / Stats Card */}
      <div className="glass-card" style={{ 
        padding: '2rem', 
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
        color: 'white',
        border: 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>Hello, {username}!</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9 }}>
              <Calendar size={16} />
              <span style={{ fontSize: '0.9rem' }}>
                Member since {profile?.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : '...'}
              </span>
            </div>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '8px 16px', 
            borderRadius: '20px', 
            backdropFilter: 'blur(4px)',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            {completedCount} / {tasks.length} Tasks Done
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', opacity: 0.9 }}>
            <span>Progress</span>
            <span>{tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%`, 
              height: '100%', 
              background: 'white', 
              borderRadius: '3px',
              transition: 'width 0.5s ease-out'
            }} />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>My Tasks</h3>
            <div className="input-focus" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: '#f9fafb', 
              padding: '8px 12px', 
              borderRadius: '8px', 
              border: '1px solid #e5e7eb', 
              width: '200px'
            }}>
              <Search size={16} color="#9ca3af" />
              <input 
                style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '0.9rem' }} 
                placeholder="Search..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <form onSubmit={addTask} style={{ display: 'flex', gap: '12px' }}>
            <input 
              className="input-focus"
              style={{ 
                flex: 1, 
                padding: '12px', 
                borderRadius: '10px', 
                border: '1px solid #e5e7eb', 
                outline: 'none',
                background: '#f9fafb',
                fontSize: '1rem'
              }} 
              placeholder="Add a new task..." 
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ 
              width: '50px', 
              minWidth: '50px',
              borderRadius: '10px', 
              border: 'none', 
              cursor: 'pointer',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0 
            }}>
              <Plus size={24} />
            </button>
          </form>
        </div>

        <ul style={{ listStyle: 'none', padding: '0', margin: 0 }}>
          {filteredTasks.map(task => (
            <li key={task._id} className="task-item" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '1.2rem 2rem', 
              borderBottom: '1px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button 
                  onClick={() => toggleTask(task)}
                  style={{
                    border: task.completed ? 'none' : '2px solid #e5e7eb', 
                    background: task.completed ? 'var(--success)' : 'transparent', 
                    color: 'white',
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    cursor: 'pointer',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  {task.completed && <Check size={14} />}
                </button>
                <span style={{
                  fontSize: '1rem',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'var(--text-muted)' : 'var(--text-main)',
                  transition: 'all 0.2s'
                }}>
                  {task.text}
                </span>
              </div>
              
              <button 
                onClick={() => deleteTask(task._id)} 
                className="btn-icon"
                style={{ 
                  border: 'none', 
                  background: 'transparent', 
                  cursor: 'pointer', 
                  color: '#ef4444', 
                  padding: '8px', 
                  borderRadius: '6px',
                  opacity: 0.6,
                  transition: 'all 0.2s'
                }}
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
          {filteredTasks.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>No tasks found. Time to add some!</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App