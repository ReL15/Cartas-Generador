import React, { useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Type,
  RemoveFormatting,
  FileText
} from "lucide-react";

export const FONT_OPTIONS = [
  { id: "font-cormorant", name: "Cormorant Garamond (Clásica Literaria)", family: "'Cormorant Garamond', Georgia, serif" },
  { id: "font-playfair", name: "Playfair Display (Editorial / Lujo)", family: "'Playfair Display', Georgia, serif" },
  { id: "font-merriweather", name: "Merriweather (Lectura Formal)", family: "'Merriweather', serif" },
  { id: "font-inter", name: "Inter (Moderno / Minimalista)", family: "'Inter', sans-serif" },
  { id: "font-outfit", name: "Outfit (Geométrico Contemporáneo)", family: "'Outfit', sans-serif" },
  { id: "font-caveat", name: "Caveat (Manuscrito Cálido)", family: "'Caveat', cursive" },
  { id: "font-dancing", name: "Dancing Script (Caligrafía Cursiva)", family: "'Dancing Script', cursive" },
  { id: "font-courier", name: "Courier Prime (Máquina de Escribir)", family: "'Courier Prime', monospace" }
];

export const INK_COLORS = [
  { label: "Carbón Clásico", value: "#1f2937" },
  { label: "Negro Tinta", value: "#0a0a0a" },
  { label: "Azul Marino", value: "#1e3a8a" },
  { label: "Burdeos / Vino", value: "#881337" },
  { label: "Verde Bosque", value: "#14532d" },
  { label: "Sepia / Nogal", value: "#582f0e" },
  { label: "Gris Pizarra", value: "#475569" }
];

export default function RichTextEditor({ data, onChange }) {
  const editorRef = useRef(null);
  // Rastreador del último HTML originado dentro del editor para evitar bucles infinitos
  const lastHtmlRef = useRef(data.bodyHtml || "");

  // Sincronizar contenido del editor únicamente cuando proviene del exterior
  // (por ejemplo: carga de plantilla, reinicio o montaje inicial)
  useEffect(() => {
    if (editorRef.current && data.bodyHtml !== lastHtmlRef.current) {
      editorRef.current.innerHTML = data.bodyHtml || "";
      lastHtmlRef.current = data.bodyHtml || "";
    }
  }, [data.bodyHtml]);

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    lastHtmlRef.current = html;
    onChange({ bodyHtml: html });
  };

  const executeCommand = (command, value = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleApplyColor = (color) => {
    executeCommand("foreColor", color);
    onChange({ textColor: color });
  };

  // Conteo de palabras y caracteres en memoria sin forzar reflujo síncrono del DOM (innerText)
  const cleanText = (data.bodyHtml || "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = cleanText ? cleanText.split(" ").length : 0;
  const charCount = cleanText.length;

  return (
    <div className="editor-section-card">
      <div className="section-title-bar">
        <div className="flex items-center gap-2">
          <FileText size={17} className="text-amber-400" />
          <h3 className="section-title">Cuerpo de la Carta</h3>
        </div>
        <span className="section-badge">Paso 2</span>
      </div>

      {/* Barra de Herramientas de Formato */}
      <div className="editor-toolbar" id="editor-formatting-toolbar">
        {/* Tipografía Principal */}
        <div className="toolbar-group">
          <div className="toolbar-select-wrap" title="Tipografía del documento">
            <Type size={14} className="text-muted" />
            <select
              id="letter-font-select"
              className="toolbar-select"
              value={data.fontFamily || "font-cormorant"}
              onChange={(e) => onChange({ fontFamily: e.target.value })}
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tamaño de Fuente e Interlineado */}
        <div className="toolbar-group">
          <select
            id="letter-font-size-select"
            className="toolbar-select-sm"
            title="Tamaño de letra"
            value={data.fontSize || "16px"}
            onChange={(e) => onChange({ fontSize: e.target.value })}
          >
            <option value="13px">13 px</option>
            <option value="14px">14 px</option>
            <option value="15px">15 px</option>
            <option value="16px">16 px</option>
            <option value="17px">17 px</option>
            <option value="18px">18 px</option>
            <option value="20px">20 px</option>
          </select>

          <select
            id="letter-line-height-select"
            className="toolbar-select-sm"
            title="Interlineado"
            value={data.lineHeight || "1.8"}
            onChange={(e) => onChange({ lineHeight: e.target.value })}
          >
            <option value="1.5">1.5x (Compacto)</option>
            <option value="1.75">1.75x (Normal)</option>
            <option value="2.0">2.0x (Espaciado)</option>
          </select>
        </div>

        {/* Estilos de Texto: Negrita, Cursiva, Subrayado */}
        <div className="toolbar-group">
          <button
            id="toolbar-btn-bold"
            type="button"
            className="tool-btn"
            title="Negrita (Ctrl+B)"
            onClick={() => executeCommand("bold")}
          >
            <Bold size={15} />
          </button>
          <button
            id="toolbar-btn-italic"
            type="button"
            className="tool-btn"
            title="Cursiva (Ctrl+I)"
            onClick={() => executeCommand("italic")}
          >
            <Italic size={15} />
          </button>
          <button
            id="toolbar-btn-underline"
            type="button"
            className="tool-btn"
            title="Subrayado (Ctrl+U)"
            onClick={() => executeCommand("underline")}
          >
            <Underline size={15} />
          </button>
        </div>

        {/* Listas */}
        <div className="toolbar-group">
          <button
            id="toolbar-btn-bullet-list"
            type="button"
            className="tool-btn"
            title="Lista con viñetas"
            onClick={() => executeCommand("insertUnorderedList")}
          >
            <List size={15} />
          </button>
          <button
            id="toolbar-btn-ordered-list"
            type="button"
            className="tool-btn"
            title="Lista numerada"
            onClick={() => executeCommand("insertOrderedList")}
          >
            <ListOrdered size={15} />
          </button>
        </div>

        {/* Alineación */}
        <div className="toolbar-group">
          <button
            id="toolbar-btn-align-left"
            type="button"
            className={`tool-btn ${data.textAlign === "left" ? "active" : ""}`}
            title="Alinear a la izquierda"
            onClick={() => {
              executeCommand("justifyLeft");
              onChange({ textAlign: "left" });
            }}
          >
            <AlignLeft size={15} />
          </button>
          <button
            id="toolbar-btn-align-center"
            type="button"
            className={`tool-btn ${data.textAlign === "center" ? "active" : ""}`}
            title="Centrar"
            onClick={() => {
              executeCommand("justifyCenter");
              onChange({ textAlign: "center" });
            }}
          >
            <AlignCenter size={15} />
          </button>
          <button
            id="toolbar-btn-align-right"
            type="button"
            className={`tool-btn ${data.textAlign === "right" ? "active" : ""}`}
            title="Alinear a la derecha"
            onClick={() => {
              executeCommand("justifyRight");
              onChange({ textAlign: "right" });
            }}
          >
            <AlignRight size={15} />
          </button>
          <button
            id="toolbar-btn-align-justify"
            type="button"
            className={`tool-btn ${data.textAlign === "justify" ? "active" : ""}`}
            title="Justificar texto"
            onClick={() => {
              executeCommand("justifyFull");
              onChange({ textAlign: "justify" });
            }}
          >
            <AlignJustify size={15} />
          </button>
        </div>

        {/* Paleta de Colores de Tinta */}
        <div className="toolbar-group color-palette-group">
          <Palette size={14} className="text-muted" title="Color de tinta" />
          <div className="color-dots-row">
            {INK_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                className={`color-dot ${data.textColor === c.value ? "active" : ""}`}
                style={{ backgroundColor: c.value }}
                title={c.label}
                onClick={() => handleApplyColor(c.value)}
              />
            ))}
            {/* Selector de color nativo */}
            <label className="color-picker-label" title="Color personalizado">
              <input
                type="color"
                className="color-picker-input"
                value={data.textColor || "#1f2937"}
                onChange={(e) => handleApplyColor(e.target.value)}
              />
              <span className="color-picker-indicator" style={{ backgroundColor: data.textColor || "#1f2937" }} />
            </label>
          </div>
        </div>

        {/* Limpiar formato */}
        <div className="toolbar-group">
          <button
            type="button"
            className="tool-btn text-muted"
            title="Limpiar formato de selección"
            onClick={() => executeCommand("removeFormat")}
          >
            <RemoveFormatting size={14} />
          </button>
        </div>
      </div>

      {/* Área Editable WYSIWYG */}
      <div className="rich-editor-wrapper">
        <div
          ref={editorRef}
          id="rich-text-content-editable"
          className={`rich-editor-content ${data.fontFamily || "font-cormorant"}`}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={handleInput}
          style={{
            color: data.textColor || "#2b2723",
            fontSize: data.fontSize || "16px",
            lineHeight: data.lineHeight || "1.8",
            textAlign: data.textAlign || "justify"
          }}
          placeholder="Escriba aquí el cuerpo de la carta..."
        />
      </div>

      {/* Pie con Estadísticas */}
      <div className="editor-stats-bar">
        <span>
          <strong>{wordCount}</strong> palabras
        </span>
        <span className="bullet-sep">•</span>
        <span>
          <strong>{charCount}</strong> caracteres
        </span>
        <span className="bullet-sep">•</span>
        <span>
          Lectura aprox. <strong>{Math.ceil(wordCount / 180) || 1} min</strong>
        </span>
      </div>
    </div>
  );
}
