import AdminSidebar from "../components/AdminSidebar";
import ConfirmModal from "../components/ConfirmModal";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AdminApprovals() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const { user } = useAuth();

  const fetchPending = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await apiFetch(
        `/admin/venues/pending?adminId=${encodeURIComponent(user.id)}`
      );

      setVenues(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load pending venues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [user?.id]);

  const openConfirmation = (venue, action) => {
    setSelectedVenue(venue);
    setSelectedAction(action);
    setConfirmOpen(true);
    setActionError("");
    setActionSuccess("");
  };

  const handleAction = async () => {
    if (!selectedVenue || !selectedAction || !user?.id) return;

    try {
      setActionLoading(true);
      setActionError("");
      setActionSuccess("");

      await apiFetch(
        `/admin/venues/${selectedVenue.id}/${selectedAction}`,
        {
          method: "PUT",
          body: JSON.stringify({
            adminId: user.id,
            comment: `${selectedAction === "approve" ? "Approved" : "Rejected"} by admin`
          })
        }
      );

      setConfirmOpen(false);
      setSelectedVenue(null);
      setSelectedAction("");

      setActionSuccess(
        `Venue ${selectedAction === "approve" ? "approved" : "rejected"} successfully.`
      );

      await fetchPending();
    } catch (err) {
      setActionError(
        err.message ||
          `Failed to ${selectedAction === "approve" ? "approve" : "reject"} venue.`
      );
      setConfirmOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="account-page">
      <AdminSidebar active="approvals" />

      <section className="account-content">
        <p className="eyebrow">Management</p>
        <h2>Pending Venue Approvals</h2>

        {actionSuccess && (
          <div className="success-message">
            {actionSuccess}
          </div>
        )}

        {actionError && (
          <div className="error-message">
            {actionError}
          </div>
        )}

        {loading && <p>Loading pending venues...</p>}

        {error && !loading && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && !error && venues.length > 0 && (
          <div className="table-responsive">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left"
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #eee" }}>
                  <th style={{ padding: "15px 10px" }}>Venue Name</th>
                  <th style={{ padding: "15px 10px" }}>Owner ID</th>
                  <th style={{ padding: "15px 10px" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {venues.map((venue) => (
                  <tr
                    key={venue.id}
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <td style={{ padding: "15px 10px" }}>
                      {venue.name}
                    </td>

                    <td style={{ padding: "15px 10px" }}>
                      {venue.ownerId}
                    </td>

                    <td style={{ padding: "15px 10px" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          gap: "8px"
                        }}
                      >
                        <button
                          type="button"
                          className="button button-dark"
                          onClick={() =>
                            openConfirmation(venue, "approve")
                          }
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          className="outline-button"
                          onClick={() =>
                            openConfirmation(venue, "reject")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && venues.length === 0 && (
          <div className="empty-bookings">
            <h3>No pending venue approvals</h3>
            <p>
              New facility submissions requiring admin approval will appear
              here.
            </p>
          </div>
        )}

        <ConfirmModal
          isOpen={confirmOpen}
          title={
            selectedAction === "approve"
              ? "Approve Venue"
              : "Reject Venue"
          }
          message={
            selectedAction === "approve"
              ? `Approve "${selectedVenue?.name}" as an active venue?`
              : `Reject "${selectedVenue?.name}"?`
          }
          confirmText={
            selectedAction === "approve" ? "Approve Venue" : "Reject Venue"
          }
          cancelText="Cancel"
          confirmDanger={selectedAction === "reject"}
          loading={actionLoading}
          onConfirm={handleAction}
          onCancel={() => {
            if (!actionLoading) {
              setConfirmOpen(false);
              setSelectedVenue(null);
              setSelectedAction("");
            }
          }}
        />
      </section>
    </main>
  );
}