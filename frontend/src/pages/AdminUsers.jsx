import AdminSidebar from "../components/AdminSidebar";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const { user } = useAuth();
  
  const [historyUser, setHistoryUser] = useState(null);
  const [historyBookings, setHistoryBookings] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchUsers = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const q = new URLSearchParams();
      if (search) q.append("search", search);
      if (role) q.append("role", role);
      if (status) q.append("status", status);
      
      let endpoint = `/admin/users/filter?${q.toString()}`;
      if (!search && !role && !status) {
        endpoint = `/admin/users?adminId=${user.id}`;
      }

      const data = await apiFetch(endpoint);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user, search, role, status]);

  const [actionMsg, setActionMsg] = useState(null);
  const [actionErr, setActionErr] = useState(null);

  const handleAction = async (userId, action) => {
    try {
      setActionErr(null);
      setActionMsg(null);
      await apiFetch(`/admin/users/${userId}/${action}?adminId=${user.id}`, { method: 'PUT' });
      setActionMsg(`User ${action}ed successfully.`);
      fetchUsers();
    } catch (err) {
      setActionErr(`Failed to ${action} user: ` + err.message);
    }
  };

  const loadHistory = async (u) => {
    setHistoryUser(u);
    try {
      setHistoryLoading(true);
      setActionErr(null);
      const data = await apiFetch(`/bookings/user/${u.id}`);
      setHistoryBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setActionErr("Failed to load booking history: " + err.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <main className="account-page">
      <AdminSidebar active="users" />
      <section className="account-content">
        <p className="eyebrow">Management</p>
        <h2>User Management</h2>
        
        {actionMsg && <p style={{ color: '#16a34a', background: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', border: '1px solid #dcfce7', marginBottom: '15px' }}>{actionMsg}</p>}
        {actionErr && <p style={{ color: '#dc2626', background: '#fef2f2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fee2e2', marginBottom: '15px' }}>{actionErr}</p>}
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search name or email" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', flex: 1, minWidth: '200px' }}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <option value="">All Roles</option>
            <option value="PLAYER">Player</option>
            <option value="FACILITY_OWNER">Facility Owner</option>
            <option value="ADMIN">Admin</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="BANNED">Banned</option>
          </select>
        </div>

        {loading && <p>Loading users...</p>}
        {error && <p style={{color: 'red'}}>{error}</p>}

        {!loading && !error && users.length > 0 ? (
          <div className="table-responsive"><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '15px 10px' }}>Name</th>
                <th style={{ padding: '15px 10px' }}>Email</th>
                <th style={{ padding: '15px 10px' }}>Role</th>
                <th style={{ padding: '15px 10px' }}>Status</th>
                <th style={{ padding: '15px 10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px 10px' }}>{u.name}</td>
                  <td style={{ padding: '15px 10px' }}>{u.email}</td>
                  <td style={{ padding: '15px 10px' }}>{u.role}</td>
                  <td style={{ padding: '15px 10px' }}>{u.active !== false ? 'Active' : 'Banned'}</td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      {u.active !== false ? (
                          <button className="button-danger" style={{ fontSize: "12px", padding: "6px 12px" }} onClick={() => handleAction(u.id, 'ban')}>Ban</button>
                      ) : (
                          <button className="button button-dark" style={{ fontSize: "12px", padding: "6px 12px" }} onClick={() => handleAction(u.id, 'unban')}>Unban</button>
                      )}
                      <button className="outline-button" style={{ fontSize: "12px", padding: "6px 12px" }} onClick={() => loadHistory(u)}>History</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : !loading && !error ? (
           <p>No users found.</p>
        ) : null}

        {historyUser && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Booking History - {historyUser.name}</h3>
                <button onClick={() => setHistoryUser(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
              </div>
              
              {historyLoading ? <p>Loading history...</p> : historyBookings.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #ccc' }}>
                      <th style={{ padding: '10px' }}>Venue</th>
                      <th style={{ padding: '10px' }}>Date</th>
                      <th style={{ padding: '10px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyBookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}>{b.venueName} - {b.courtName}</td>
                        <td style={{ padding: '10px' }}>{b.bookingDate} {b.startTime}</td>
                        <td style={{ padding: '10px' }}>{b.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No booking history found.</p>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
