import React from "react";
import { Calendar, MapPin, User, Sparkles } from "lucide-react";

export default function HeaderEditor({ data, onChange }) {
  const setToday = () => {
    const today = new Date().toISOString().split("T")[0];
    onChange({ date: today });
  };

  return (
    <div className="editor-section-card">
      <div className="section-title-bar">
        <div className="flex items-center gap-2">
          <Calendar size={17} className="text-amber-400" />
          <h3 className="section-title">Encabezamiento</h3>
        </div>
        <span className="section-badge">Paso 1</span>
      </div>

      {/* Fecha */}
      <div className="form-group">
        <div className="form-label">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            Fecha de la carta
          </span>
          <button
            type="button"
            className="text-btn-xs"
            onClick={setToday}
            title="Usar fecha actual"
          >
            <Sparkles size={11} />
            Poner hoy
          </button>
        </div>
        <div className="input-group-row">
          <input
            id="letter-date-input"
            type="date"
            className="form-input"
            value={data.date || ""}
            onChange={(e) => onChange({ date: e.target.value })}
          />
          <select
            id="letter-date-format-select"
            className="form-select"
            style={{ maxWidth: "160px" }}
            value={data.dateFormat || "long"}
            onChange={(e) => onChange({ dateFormat: e.target.value })}
          >
            <option value="long">Texto largo (ej. 9 de sept.)</option>
            <option value="short">Numérico (ej. 09/09/2026)</option>
          </select>
        </div>
      </div>

      {/* Lugar (Opcional) */}
      <div className="form-group">
        <label htmlFor="letter-place-input" className="form-label">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} />
            Lugar de emisión
          </span>
          <span className="form-label-optional">(Opcional)</span>
        </label>
        <input
          id="letter-place-input"
          type="text"
          className="form-input"
          placeholder="Direccion del publicador"
          value={data.place || ""}
          onChange={(e) => onChange({ place: e.target.value })}
        />
      </div>

      {/* Destinatario */}
      <div className="form-group">
        <label htmlFor="letter-recipient-input" className="form-label">
          <span className="flex items-center gap-1.5">
            <User size={14} />
            Destinatario
          </span>
        </label>
        <textarea
          id="letter-recipient-input"
          rows={3}
          className="form-textarea"
          placeholder="A quien esta dirija la carta"
          value={data.recipient || ""}
          onChange={(e) => onChange({ recipient: e.target.value })}
        />
        <span className="input-hint">
          Puedes incluir varias líneas para especificar título, departamento o empresa.
        </span>
      </div>
    </div>
  );
}
