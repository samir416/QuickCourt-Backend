import React, { useState } from "react";
import { API_BASE_URL } from "../services/api";

export function getInitials(name) {
  if (!name || typeof name !== "string") return "QC";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "QC";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name, image, size = 40, className = "" }) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);

  // If image URL is a relative API path, prepend base URL
  let fullImageUrl = null;
  if (image && !imgError) {
    if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) {
      fullImageUrl = image;
    } else if (image.startsWith("/api")) {
      fullImageUrl = `${API_BASE_URL.replace(/\/api$/, "")}${image}`;
    } else {
      fullImageUrl = `${API_BASE_URL}/${image.replace(/^\//, "")}`;
    }
  }

  const dimension = typeof size === "number" ? `${size}px` : size;

  if (fullImageUrl) {
    return (
      <span
        className={`avatar ${className}`}
        style={{
          width: dimension,
          height: dimension,
          minWidth: dimension,
          borderRadius: "50%",
          overflow: "hidden",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--lime, #bbf246)",
          color: "var(--ink, #1d2821)",
          fontWeight: 700
        }}
      >
        <img
          src={fullImageUrl}
          alt={name || "User"}
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      </span>
    );
  }

  return (
    <span
      className={`avatar ${className}`}
      style={{
        width: dimension,
        height: dimension,
        minWidth: dimension,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--lime, #bbf246)",
        color: "var(--ink, #1d2821)",
        fontWeight: 700,
        fontSize: typeof size === "number" ? `${Math.max(12, Math.floor(size * 0.38))}px` : "14px",
        userSelect: "none"
      }}
    >
      {initials}
    </span>
  );
}
