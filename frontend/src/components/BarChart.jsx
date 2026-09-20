import { useMemo } from "react";

export default function BarChart({
  data = [],
  labelKey = "label",
  valueKey = "value",
  formatValue = (v) => v,
  color = "#1d2821",
  height = 180
}) {
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    return data.map((item) => ({
      label: String(item[labelKey] || "-"),
      value: Number(item[valueKey]) || 0
    }));
  }, [data, labelKey, valueKey]);

  const maxValue = useMemo(() => {
    if (chartData.length === 0) return 10;
    const max = Math.max(...chartData.map((d) => d.value));
    return max > 0 ? max : 10;
  }, [chartData]);

  const isEmpty = chartData.length === 0 || chartData.every((d) => d.value === 0);

  return (
    <div className="qc-chart-container" style={{ width: "100%", marginTop: "16px" }}>
      <div
        className="qc-chart-plot"
        style={{
          height: `${height}px`,
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          gap: "12px",
          padding: "24px 8px 30px 45px",
          borderBottom: "1px solid var(--line, #e5e7eb)",
          background: "#faf8f5",
          borderRadius: "8px"
        }}
      >
        {/* Y-Axis Gridlines & Labels */}
        <div
          style={{
            position: "absolute",
            top: 24,
            bottom: 30,
            left: 8,
            width: "32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: "11px",
            color: "var(--muted, #888)",
            fontWeight: 500,
            pointerEvents: "none"
          }}
        >
          <span>{formatValue(maxValue)}</span>
          <span>{formatValue(Math.round(maxValue / 2))}</span>
          <span>{formatValue(0)}</span>
        </div>

        {/* Horizontal grid lines */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 45,
            right: 8,
            height: "1px",
            background: "rgba(0,0,0,0.06)",
            borderTop: "1px dashed rgba(0,0,0,0.08)",
            pointerEvents: "none"
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "calc(50% - 3px)",
            left: 45,
            right: 8,
            height: "1px",
            background: "rgba(0,0,0,0.06)",
            borderTop: "1px dashed rgba(0,0,0,0.08)",
            pointerEvents: "none"
          }}
        />

        {/* Bars */}
        {chartData.map((item, idx) => {
          const barHeight = Math.max((item.value / maxValue) * (height - 54), 4);
          return (
            <div
              key={idx}
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                position: "relative",
                zIndex: 2
              }}
            >
              {/* Value label on top of bar */}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: item.value > 0 ? "var(--ink, #1d2821)" : "var(--muted, #999)",
                  marginBottom: "4px"
                }}
              >
                {formatValue(item.value)}
              </span>

              {/* Bar element */}
              <div
                style={{
                  width: "100%",
                  maxWidth: "40px",
                  height: `${barHeight}px`,
                  backgroundColor: item.value > 0 ? color : "#e5e7eb",
                  borderRadius: "4px 4px 0 0",
                  transition: "height 0.3s ease, background-color 0.2s ease"
                }}
                title={`${item.label}: ${formatValue(item.value)}`}
              />

              {/* X-axis label */}
              <span
                style={{
                  position: "absolute",
                  bottom: "-24px",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "var(--muted, #666)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                  textAlign: "center"
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}

        {/* Empty state notice overlay */}
        {isEmpty && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(1px)",
              fontSize: "12px",
              color: "var(--muted, #777)",
              fontWeight: 500,
              zIndex: 3
            }}
          >
            No activity recorded yet for this period
          </div>
        )}
      </div>
    </div>
  );
}
