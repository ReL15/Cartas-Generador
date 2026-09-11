import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  FileText,
  Edit3,
  Frame,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Sliders,
  Eye,
  Download,
  Share2,
  Printer
} from "lucide-react";

import HeaderEditor from "./components/HeaderEditor";
import RichTextEditor from "./components/RichTextEditor";
import FooterEditor from "./components/FooterEditor";
import FrameSelector from "./components/FrameSelector";
import LetterPreview from "./components/LetterPreview";
import ActionToolbar from "./components/ActionToolbar";
import TemplatesModal from "./components/TemplatesModal";

import { INITIAL_STATE } from "./utils/defaultTemplates";
import { generateLetterPdf } from "./utils/exportPdf";
import { shareLetterViaWhatsApp } from "./utils/shareWhatsapp";

import "./styles/frames.css";
import "./App.css";
import "./styles/print.css";

const STORAGE_KEY = "creador_cartas_draft_v2";
const THEME_STORAGE_KEY = "creador_cartas_theme_pref";

export default function App() {
  // 1. Estado de Tema (Claro / Oscuro / Sistema)
  const [themePreference, setThemePreference] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || "system";
    } catch {
      return "system";
    }
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  // Escuchar cambios en el tema del sistema operativo / dispositivo
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      setSystemPrefersDark(e.matches);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Calcular el tema activo ('dark' o 'light')
  const activeTheme =
    themePreference === "system"
      ? systemPrefersDark
        ? "dark"
        : "light"
      : themePreference;

  // Aplicar tema en el elemento html/root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", activeTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themePreference);
    } catch (e) {
      console.warn("No se pudo guardar tema:", e);
    }
  }, [activeTheme, themePreference]);

  const handleCycleTheme = () => {
    setThemePreference((prev) => {
      if (prev === "system") return "light";
      if (prev === "light") return "dark";
      return "system";
    });
  };

  // 2. Estado de los Datos de la Carta
  const [letterData, setLetterData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          // Asegurar campos limpios según solicitud
          place: parsed.place || "",
          recipient: parsed.recipient || "",
          sender: parsed.sender || "",
          senderTitle: parsed.senderTitle || "Testigo de Jehová"
        };
      }
    } catch (e) {
      console.warn("No se pudo cargar borrador de localStorage:", e);
    }
    return INITIAL_STATE;
  });

  // Pestaña activa en el sidebar de edición
  const [activeTab, setActiveTab] = useState("all");

  // Modo de visualización en pantallas móviles o tablets: 'editor' | 'preview'
  const [mobileView, setMobileView] = useState("editor");

  // Nivel de zoom inicial adaptativo (en móviles se reduce automáticamente para que quepa la hoja)
  const [zoom, setZoom] = useState(() => {
    if (typeof window !== "undefined") {
      const w = window.innerWidth;
      if (w < 480) return 46;
      if (w < 768) return 60;
      if (w < 1024) return 75;
    }
    return 100;
  });

  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const letterRef = useRef(null);

  // Auto-guardado debounced en localStorage para escritura fluida y sin bloqueos de disco
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(letterData));
      } catch (e) {
        console.warn("No se pudo guardar en localStorage:", e);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [letterData]);

  // Guardado inmediato en caso de cerrar o recargar la pestaña
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(letterData));
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [letterData]);

  const updateLetterData = (updates) => {
    setLetterData((prev) => ({
      ...prev,
      ...updates
    }));
  };

  const handleSelectTemplate = (template) => {
    setLetterData((prev) => ({
      ...prev,
      ...template,
      date: new Date().toISOString().split("T")[0] // Conservar o actualizar fecha de hoy
    }));
  };

  const handleReset = () => {
    if (window.confirm("¿Deseas reiniciar la carta y comenzar con un borrador nuevo?")) {
      setLetterData(INITIAL_STATE);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleZoom = (delta) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 35), 160));
  };

  const handleResetZoom = () => {
    if (window.innerWidth < 480) setZoom(46);
    else if (window.innerWidth < 768) setZoom(60);
    else if (window.innerWidth < 1024) setZoom(75);
    else setZoom(100);
  };

  return (
    <div className="app-container">
      {/* Barra Superior con Acciones y Selector de Tema */}
      <ActionToolbar
        letterRef={letterRef}
        data={letterData}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        onReset={handleReset}
        themePreference={themePreference}
        activeTheme={activeTheme}
        onCycleTheme={handleCycleTheme}
      />

      {/* Selector de Vista en Teléfonos y Tablets (Editar / Ver Carta) */}
      <div className="mobile-view-tabs no-print">
        <button
          type="button"
          className={`mobile-tab-btn ${mobileView === "editor" ? "active" : ""}`}
          onClick={() => setMobileView("editor")}
        >
          <Edit3 size={15} />
          <span>1. Redactar</span>
        </button>
        <button
          type="button"
          className={`mobile-tab-btn ${mobileView === "preview" ? "active" : ""}`}
          onClick={() => setMobileView("preview")}
        >
          <Eye size={15} />
          <span>2. Ver Carta ({zoom}%)</span>
        </button>
      </div>

      {/* Contenedor Principal (Split Screen en Escritorio, Pestañas en Móvil) */}
      <div className={`studio-layout mobile-view-${mobileView}`}>
        {/* ================================================================
            Panel de Edición (Izquierda)
            ================================================================ */}
        <aside className="studio-sidebar no-print">
          {/* Pestañas de Navegación del Editor */}
          <nav className="editor-nav-tabs">
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <Sliders size={14} />
              <span>Todo</span>
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === "header" ? "active" : ""}`}
              onClick={() => setActiveTab("header")}
            >
              <Calendar size={14} />
              <span>1. Encabezado</span>
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === "body" ? "active" : ""}`}
              onClick={() => setActiveTab("body")}
            >
              <FileText size={14} />
              <span>2. Cuerpo</span>
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === "footer" ? "active" : ""}`}
              onClick={() => setActiveTab("footer")}
            >
              <Edit3 size={14} />
              <span>3. Despedida</span>
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === "frame" ? "active" : ""}`}
              onClick={() => setActiveTab("frame")}
            >
              <Frame size={14} />
              <span>Marco & Papel</span>
            </button>
          </nav>

          {/* Formulario Scrollable */}
          <div className="sidebar-scroll-content">
            {(activeTab === "all" || activeTab === "header") && (
              <HeaderEditor data={letterData} onChange={updateLetterData} />
            )}

            {(activeTab === "all" || activeTab === "body") && (
              <RichTextEditor data={letterData} onChange={updateLetterData} />
            )}

            {(activeTab === "all" || activeTab === "footer") && (
              <FooterEditor data={letterData} onChange={updateLetterData} />
            )}

            {(activeTab === "all" || activeTab === "frame") && (
              <FrameSelector data={letterData} onChange={updateLetterData} />
            )}
          </div>
        </aside>

        {/* ================================================================
            Viewport de Vista Previa Realista (Derecha)
            ================================================================ */}
        <main className="preview-container">
          {/* Controles de Zoom y Estado de Página */}
          <div className="preview-toolbar no-print">
            <div className="preview-meta">
              <span className="badge badge-gold">
                <Sparkles size={12} />
                Hoja A4 Oficial
              </span>
              <span className="meta-dim">210 × 297 mm</span>
              <span className="meta-sep">•</span>
              <span className="meta-save" style={{ color: "var(--text-muted)" }}>
                Guardado automático
              </span>
            </div>

            <div className="preview-zoom-controls">
              <button
                type="button"
                className="zoom-btn"
                onClick={() => handleZoom(-10)}
                title="Reducir zoom"
              >
                <ZoomOut size={14} />
              </button>
              <span className="zoom-level-text">{zoom}%</span>
              <button
                type="button"
                className="zoom-btn"
                onClick={() => handleZoom(10)}
                title="Aumentar zoom"
              >
                <ZoomIn size={14} />
              </button>
              <button
                type="button"
                className="zoom-btn"
                onClick={handleResetZoom}
                title="Ajustar al tamaño de pantalla"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          {/* Área de Visualización Centrada */}
          <div className="preview-viewport">
            <div
              className="paper-zoom-wrapper"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                transition: "transform 0.15s ease-out"
              }}
            >
              <LetterPreview data={letterData} letterRef={letterRef} />
            </div>
          </div>

          {/* Barra de Acciones Flotante Móvil (visible en vista previa en dispositivos móviles) */}
          <div className="mobile-preview-actions-bar no-print">
            <button
              type="button"
              className="btn btn-whatsapp flex-1"
              onClick={async () => {
                if (!letterRef.current) return;
                await shareLetterViaWhatsApp(letterRef.current, letterData);
              }}
            >
              <Share2 size={15} />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              className="btn btn-primary flex-1"
              onClick={async () => {
                if (!letterRef.current) return;
                const filename = `Carta_${letterData.recipient ? letterData.recipient.split("\n")[0].replace(/[^a-zA-Z0-9]/g, "_").slice(0, 20) : "Oficial"}.pdf`;
                await generateLetterPdf(letterRef.current, filename, true);
              }}
            >
              <Download size={15} />
              <span>Guardar PDF</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-icon-only"
              onClick={() => window.print()}
              title="Imprimir"
            >
              <Printer size={16} />
            </button>
          </div>
        </main>
      </div>

      {/* Modal de Plantillas */}
      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
