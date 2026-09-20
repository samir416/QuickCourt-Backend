import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmDanger = false,
  onConfirm,
  onCancel,
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
        animation: "fadeIn 0.15s ease-out"
      }}
      onClick={onCancel}
    >
      <div
        className="modal-container"
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "440px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid var(--line, #e5e7eb)",
          overflow: "hidden",
          animation: "scaleUp 0.15s ease-out"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {confirmDanger && (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#fee2e2",
                color: "#dc2626"
              }}>
                <AlertTriangle size={20} />
              </div>
            )}
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "var(--ink, #1d2821)" }}>
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "var(--muted, #666)",
              display: "flex"
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: "16px 24px 24px" }}>
          <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "var(--muted, #4b5563)" }}>
            {message}
          </p>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
            <button
              type="button"
              className="outline-button"
              onClick={onCancel}
              disabled={loading}
              style={{ padding: "8px 16px", fontSize: "13px" }}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={confirmDanger ? "button button-danger" : "button button-dark"}
              onClick={onConfirm}
              disabled={loading}
              style={{
                padding: "8px 18px",
                fontSize: "13px",
                backgroundColor: confirmDanger ? "#dc2626" : undefined,
                borderColor: confirmDanger ? "#dc2626" : undefined,
                color: "#ffffff"
              }}
            >
              {loading ? "Processing..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
