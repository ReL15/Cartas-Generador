import React, { useState } from "react";
import { Pen, Edit3, Type, X, Sparkles } from "lucide-react";
import SignaturePad from "./SignaturePad";

const FAREWELL_PRESETS = [
  "Atentamente,",
  "Cordialmente,",
  "Un cordial saludo,",
  "Con afecto y estima,",
  "Sin otro particular, le saluda atentamente,",
  "Con todo mi cariño,",
  "Quedo a su entera disposición,"
];

export default function FooterEditor({ data, onChange }) {
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const handleSaveDrawnSignature = (dataUrl) => {
    onChange({
      signatureDataUrl: dataUrl,
      signatureType: dataUrl ? "drawn" : "cursive"
    });
    setShowSignatureModal(false);
  };

  return (
    <div className="editor-section-card">
      <div className="section-title-bar">
        <div className="flex items-center gap-2">
          <Edit3 size={17} className="text-amber-400" />
          <h3 className="section-title">Despedida y Firma</h3>
        </div>
        <span className="section-badge">Paso 3</span>
      </div>

      {/* Fórmula de Despedida */}
      <div className="form-group">
        <label htmlFor="letter-farewell-input" className="form-label">
          <span>Fórmula de despedida</span>
        </label>
        <div className="input-group-row">
          <input
            id="letter-farewell-input"
            type="text"
            className="form-input"
            placeholder="Ej. Atentamente,"
            value={data.farewell || ""}
            onChange={(e) => onChange({ farewell: e.target.value })}
          />
          <select
            className="form-select"
            style={{ maxWidth: "160px" }}
            onChange={(e) => {
              if (e.target.value) {
                onChange({ farewell: e.target.value });
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>Elegir sugerencia...</option>
            {FAREWELL_PRESETS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Nombre del Creador de la Carta */}
      <div className="form-group">
        <label htmlFor="letter-sender-input" className="form-label">
          <span>Nombre del creador de la carta (Remitente)</span>
        </label>
        <input
          id="letter-sender-input"
          type="text"
          className="form-input"
          placeholder="Escriba su nombre"
          value={data.sender || ""}
          onChange={(e) => onChange({ sender: e.target.value })}
        />
      </div>

      {/* Cargo o Puesto (Opcional) */}
      <div className="form-group">
        <label htmlFor="letter-sender-title-input" className="form-label">
          <span>Cargo, profesión o empresa</span>
          <span className="form-label-optional">(Opcional)</span>
        </label>
        <input
          id="letter-sender-title-input"
          type="text"
          className="form-input"
          placeholder="Ej. Gerente de Operaciones / Lic. en Administración"
          value={data.senderTitle || ""}
          onChange={(e) => onChange({ senderTitle: e.target.value })}
        />
      </div>

      {/* Tipo de Firma */}
      <div className="form-group">
        <div className="form-label">
          <span>Estilo de Firma</span>
        </div>
        <div className="signature-type-selector">
          <button
            type="button"
            className={`signature-type-btn ${data.signatureType === "cursive" ? "active" : ""}`}
            onClick={() => onChange({ signatureType: "cursive" })}
          >
            <Sparkles size={15} />
            <div>
              <div className="sig-btn-title">Caligráfica Digital</div>
              <div className="sig-btn-desc">Trazo manuscrito elegante</div>
            </div>
          </button>

          <button
            type="button"
            className={`signature-type-btn ${data.signatureType === "drawn" ? "active" : ""}`}
            onClick={() => {
              setShowSignatureModal(true);
            }}
          >
            <Pen size={15} />
            <div>
              <div className="sig-btn-title">Dibujar a Mano</div>
              <div className="sig-btn-desc">Firma auténtica dibujada</div>
            </div>
          </button>

          <button
            type="button"
            className={`signature-type-btn ${data.signatureType === "none" ? "active" : ""}`}
            onClick={() => onChange({ signatureType: "none" })}
          >
            <Type size={15} />
            <div>
              <div className="sig-btn-title">Sin Firma Gráfica</div>
              <div className="sig-btn-desc">Solo nombre impreso</div>
            </div>
          </button>
        </div>
      </div>

      {/* Vista previa / Edición de firma dibujada si está activa */}
      {data.signatureType === "drawn" && data.signatureDataUrl && (
        <div className="drawn-signature-preview-box">
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Tu firma manuscrita actual:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-btn-xs"
                onClick={() => setShowSignatureModal(true)}
              >
                Volver a dibujar
              </button>
              <button
                type="button"
                className="text-btn-xs text-rose-400"
                onClick={() => onChange({ signatureDataUrl: null, signatureType: "cursive" })}
                title="Eliminar firma"
              >
                <X size={12} />
              </button>
            </div>
          </div>
          <div className="drawn-sig-img-wrap">
            <img src={data.signatureDataUrl} alt="Firma manuscrita" />
          </div>
        </div>
      )}

      {/* Modal para dibujar firma */}
      {showSignatureModal && (
        <div className="modal-overlay" onClick={() => setShowSignatureModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <SignaturePad
              initialDataUrl={data.signatureDataUrl}
              onSave={handleSaveDrawnSignature}
              onCancel={() => setShowSignatureModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
