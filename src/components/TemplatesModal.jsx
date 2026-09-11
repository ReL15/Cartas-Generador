import React from "react";
import { X, Check, BookOpen } from "lucide-react";
import { TEMPLATES } from "../utils/defaultTemplates";

export default function TemplatesModal({ isOpen, onClose, onSelectTemplate }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="templates-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-amber-400" />
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-main)" }}>
                Selecciona una Plantilla de Carta
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Comienza con un texto y diseño preconfigurado que puedes personalizar por completo.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-icon-only"
            onClick={onClose}
            title="Cerrar ventana"
          >
            <X size={18} />
          </button>
        </div>

        <div className="templates-grid-list">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="template-card"
              onClick={() => {
                onSelectTemplate(tmpl);
                onClose();
              }}
            >
              <div className="template-card-top">
                <span className="badge badge-gold">{tmpl.badge}</span>
                <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                  {tmpl.place || "Sin lugar"}
                </span>
              </div>
              <h4 className="template-card-title">{tmpl.name}</h4>
              <p className="template-card-description">{tmpl.description}</p>
              <div className="template-card-footer">
                <span className="template-card-sender">Por: {tmpl.sender}</span>
                <button type="button" className="btn btn-secondary btn-xs">
                  Usar plantilla
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
