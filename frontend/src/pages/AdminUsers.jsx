import AdminSidebar from "../components/AdminSidebar";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchUsers = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await apiFetch(`/admin/users?adminId=${user.id}`);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const handleAction = async (userId, action) => {
    try {
      await apiFetch(`/admin/users/${userId}/${action}?adminId=${user.id}`, { method: 'PUT' });
      fetchUsers();
    } catch (err) {
      alert(`Failed to ${action} user: ` + err.message);
    }
  };

  return (
    <main className="account-page">
      <AdminSidebar active="users" />
      <section className="account-content">
        <p className="eyebrow">Management</p>
        <h2>User Management</h2>
        
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
                    {u.active !== false ? (
                        <button className="outline-button" onClick={() => handleAction(u.id, 'ban')}>Ban</button>
                    ) : (
                        <button className="outline-button" onClick={() => handleAction(u.id, 'unban')}>Unban</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : !loading && !error ? (
           <p>No users found.</p>
        ) : null}
      </section>
    </main>
  );
}
