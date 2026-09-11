import React from "react";
import { Frame, Check, Layers } from "lucide-react";

export const FRAMES = [
  {
    id: "frame-classic",
    name: "Clásico Tradicional",
    desc: "Doble filete con esquinas ornamentales",
    tag: "Atemporal",
    previewClass: "frame-classic"
  },
  {
    id: "frame-modern",
    name: "Minimalista Moderno",
    desc: "Líneas finas con detalle de acento",
    tag: "Limpio",
    previewClass: "frame-modern"
  },
  {
    id: "frame-corporate",
    name: "Formal Corporativo",
    desc: "Franjas ejecutivas azul marino institucional",
    tag: "Empresarial",
    previewClass: "frame-corporate"
  },
  {
    id: "frame-vintage",
    name: "Romántico / Vintage",
    desc: "Filete doble antiguo y atmósfera poética",
    tag: "Elegante",
    previewClass: "frame-vintage"
  },
  {
    id: "frame-royal",
    name: "Real Dorado (Royal)",
    desc: "Bordes dobles dorados de alta alcurnia",
    tag: "Lujo",
    previewClass: "frame-royal"
  },
  {
    id: "frame-none",
    name: "Sin Marco (Editorial)",
    desc: "Hoja limpia con generosos márgenes tipográficos",
    tag: "Sobrio",
    previewClass: "frame-none"
  }
];

export const PAPERS = [
  { id: "paper-white", name: "Blanco Puro", color: "#ffffff", border: "#e5e7eb" },
  { id: "paper-ivory", name: "Marfil Suave", color: "#faf7f2", border: "#e4ded4" },
  { id: "paper-parchment", name: "Pergamino Antiguo", color: "#fcf8f0", border: "#e8decb" },
  { id: "paper-cream", name: "Crema Cálido", color: "#fbf9f4", border: "#e5dfd5" },
  { id: "paper-softblue", name: "Azul Tenue Oficial", color: "#f3f6f9", border: "#d0dbe5" }
];

export default function FrameSelector({ data, onChange }) {
  return (
    <div className="editor-section-card">
      <div className="section-title-bar">
        <div className="flex items-center gap-2">
          <Frame size={17} className="text-amber-400" />
          <h3 className="section-title">Marco y Papel de la Carta</h3>
        </div>
        <span className="section-badge">Estilo</span>
      </div>

      {/* Selector de Marco */}
      <div className="form-group mb-3">
        <label className="form-label">
          <span>Diseño del marco</span>
        </label>
        <div className="frames-grid">
          {FRAMES.map((f) => {
            const isSelected = data.frameStyle === f.id;
            return (
              <button
                key={f.id}
                type="button"
                className={`frame-card-option ${isSelected ? "selected" : ""}`}
                onClick={() => onChange({ frameStyle: f.id })}
              >
                <div className="frame-card-header">
                  <span className="frame-card-name">{f.name}</span>
                  {isSelected && <Check size={14} className="text-amber-500" />}
                </div>
                <div className="frame-card-desc">{f.desc}</div>
                <span className="frame-card-tag">{f.tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector de Papel */}
      <div className="form-group">
        <label className="form-label">
          <span className="flex items-center gap-1.5">
            <Layers size={14} />
            Tonalidad del papel
          </span>
        </label>
        <div className="paper-swatches-grid">
          {PAPERS.map((p) => {
            const isSelected = data.paperTone === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`paper-swatch-item ${isSelected ? "selected" : ""}`}
                onClick={() => onChange({ paperTone: p.id })}
              >
                <span
                  className="paper-color-circle"
                  style={{ backgroundColor: p.color, borderColor: p.border }}
                />
                <span className="paper-name">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
