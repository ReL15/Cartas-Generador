import React, { useRef, useState, useEffect } from "react";
import { Eraser, RotateCcw, Check, PenTool } from "lucide-react";

export default function SignaturePad({ initialDataUrl, onSave, onCancel }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [color, setColor] = useState("#1e293b");
  const [lineWidth, setLineWidth] = useState(2.5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Configurar resolución retina para mayor nitidez
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    if (initialDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
      };
      img.src = initialDataUrl;
    }
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasDrawn(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) {
      onSave(null);
      return;
    }
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div className="signature-modal-card">
      <div className="signature-modal-header">
        <div className="flex items-center gap-2">
          <PenTool size={18} className="text-amber-500" />
          <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)" }}>
            Dibuja tu firma con el ratón o pantalla táctil
          </h4>
        </div>
      </div>

      <div className="signature-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="signature-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="signature-baseline-guide" />
      </div>

      <div className="signature-controls">
        <div className="signature-toolbar-row">
          <div className="signature-colors">
            <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)" }}>Tinta:</span>
            {[
              { label: "Negro", val: "#0f172a" },
              { label: "Azul Real", val: "#1e3a8a" },
              { label: "Sepia", val: "#582f0e" }
            ].map((c) => (
              <button
                key={c.val}
                type="button"
                className={`color-dot-btn ${color === c.val ? "active" : ""}`}
                style={{ backgroundColor: c.val }}
                title={c.label}
                onClick={() => setColor(c.val)}
              />
            ))}
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={clearCanvas}
            title="Borrar todo el trazo"
          >
            <Eraser size={14} />
            <span>Borrar</span>
          </button>
        </div>

        <div className="signature-bottom-actions">
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary flex-1"
              onClick={onCancel}
            >
              Cancelar
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary flex-1"
            onClick={handleSave}
          >
            <Check size={16} />
            <span>Aplicar Firma</span>
          </button>
        </div>
      </div>
    </div>
  );
}
