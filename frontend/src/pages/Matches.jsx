import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Users } from "lucide-react";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', sport: '', location: '', matchTime: '', maxPlayers: 4
  });

  // State to track join/leave loading per match
  const [actionLoading, setActionLoading] = useState({});

  const { user } = useAuth();

  const fetchMatches = async (showLoading = true) => {
    if (!user) return;
    try {
      if (showLoading) setLoading(true);
      const data = await apiFetch(`/matches?userId=${user.id}`);
      setMatches(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [user]);

  const [actionMsg, setActionMsg] = useState(null);
  const [actionErr, setActionErr] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setActionErr(null);
      setActionMsg(null);
      const payload = {
          ...formData,
          matchTime: new Date(formData.matchTime).toISOString(), maxPlayers: parseInt(formData.maxPlayers, 10)
      };
      await apiFetch(`/matches?userId=${user.id}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setShowForm(false);
      setActionMsg("Match created successfully!");
      fetchMatches();
    } catch (err) {
      setActionErr("Failed to create match: " + err.message);
    }
  };

  const handleAction = async (matchId, action) => {
    try {
      setActionErr(null);
      setActionMsg(null);
      setActionLoading(prev => ({ ...prev, [matchId]: true }));
      await apiFetch(`/matches/${matchId}/${action}?userId=${user.id}`, { method: 'POST' });
      setActionMsg(`Successfully ${action === 'join' ? 'joined' : 'left'} the match.`);
      await fetchMatches(false);
    } catch (err) {
      setActionErr("Failed to " + action + " match: " + err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [matchId]: false }));
    }
  };

  if (!user) {
    return <main className="site-main" style={{padding: '100px 5%', textAlign: 'center'}}>
        <h2>Please log in to view matches</h2>
        <Link to="/logsign" className="button button-dark">Log in</Link>
    </main>;
  }

  return (
    <main className="site-main" style={{padding: '40px 5%'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '30px'}}>
          <div>
            <p className="eyebrow">Community</p>
            <h1>Local Matches</h1>
          </div>
          <button className="button button-dark" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Create Match'}
          </button>
      </div>

      {actionMsg && <p style={{ color: '#16a34a', background: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', border: '1px solid #dcfce7', marginBottom: '20px' }}>{actionMsg}</p>}
      {actionErr && <p style={{ color: '#dc2626', background: '#fef2f2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fee2e2', marginBottom: '20px' }}>{actionErr}</p>}

      {showForm && (
        <form onSubmit={handleCreate} className="account-form" style={{marginBottom: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '8px'}}>
          <h3>Create a Match</h3>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
            <label className="field-label">Title <input required value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="Sunday Morning Badminton" /></label>
            <label className="field-label">Sport <input required value={formData.sport} onChange={e=>setFormData({...formData, sport: e.target.value})} placeholder="Badminton" /></label>
            <label className="field-label">Location <input required value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} placeholder="Skyline Club" /></label>
            <label className="field-label">Time <input type="datetime-local" required value={formData.matchTime} onChange={e=>setFormData({...formData, matchTime: e.target.value})} /></label>
            <label className="field-label">Max Players <input type="number" min="2" required value={formData.maxPlayers} onChange={e=>setFormData({...formData, maxPlayers: e.target.value})} /></label>
          </div>
          <button className="button button-dark" style={{marginTop:'15px'}}>Publish Match</button>
        </form>
      )}

      {loading && <p>Loading matches...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
        {!loading && !error && matches.map(m => {
          const isActionLoading = actionLoading[m.id];
          const isFull = m.currentPlayers >= m.maxPlayers;
          
          return (
            <div key={m.id} style={{border: '1px solid #eee', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'border 0.2s', cursor: 'default'}} onMouseOver={e => e.currentTarget.style.borderColor = '#ccc'} onMouseOut={e => e.currentTarget.style.borderColor = '#eee'}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span className="status" style={{textTransform: 'capitalize'}}>{m.sport}</span>
                    <span style={{fontSize: '12px', color: '#666'}}><Calendar size={12} style={{marginRight: '4px', verticalAlign: 'text-bottom'}}/>{new Date(m.matchTime).toLocaleString()}</span>
                </div>
                <h3 style={{margin: 0}}>{m.title}</h3>
                <p style={{margin: 0, color: '#666', fontSize: '14px'}}><MapPin size={14} style={{marginRight: '4px', verticalAlign: 'text-bottom'}} /> {m.location}</p>
                <p style={{margin: 0, fontSize: '14px'}}>Organized by <strong>{m.creatorName}</strong></p>
                
                <div style={{marginTop: '10px', background: '#f8f9fa', padding: '10px', borderRadius: '4px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px'}}>
                        <span><Users size={14} style={{marginRight: '4px', verticalAlign: 'text-bottom'}} /> Players</span>
                        <span>{m.currentPlayers} / {m.maxPlayers}</span>
                    </div>
                    <div style={{width: '100%', height: '6px', background: '#ddd', borderRadius: '3px', overflow: 'hidden'}}>
                        <div style={{width: `${(m.currentPlayers / m.maxPlayers) * 100}%`, height: '100%', background: 'var(--ink)', transition: 'width 0.3s ease'}}></div >
                    </div>
                </div>

                <div style={{marginTop: 'auto', paddingTop: '15px'}}>
                    {m.isParticipant ? (
                        <button className="outline-button" style={{width: '100%'}} onClick={() => handleAction(m.id, 'leave')} disabled={isActionLoading}>
                           {isActionLoading ? 'Leaving...' : 'Joined (Click to Leave)'}
                        </button>
                    ) : (
                        <button className="button button-dark" style={{width: '100%'}} disabled={isFull || isActionLoading} onClick={() => handleAction(m.id, 'join')}>
                            {isActionLoading ? 'Joining...' : (isFull ? 'Match Full' : 'Join Match')}
                        </button>
                    )}
                </div>
            </div>
          );
        })}
        {!loading && !error && matches.length === 0 && <p>No matches available right now.</p>}
      </div>
    </main>
  );
}
