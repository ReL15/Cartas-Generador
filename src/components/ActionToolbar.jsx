import React, { useState } from "react";
import {
  Download,
  Share2,
  Printer,
  BookOpen,
  RotateCcw,
  Loader2,
  CheckCircle2,
  Sun,
  Moon,
  Laptop
} from "lucide-react";
import { generateLetterPdf } from "../utils/exportPdf";
import { shareLetterViaWhatsApp } from "../utils/shareWhatsapp";

export default function ActionToolbar({
  letterRef,
  data,
  onOpenTemplates,
  onReset,
  themePreference = "system",
  activeTheme = "dark",
  onCycleTheme
}) {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isSharingWhatsApp, setIsSharingWhatsApp] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const showStatus = (msg, type = "success") => {
    setStatusMessage({ msg, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  // 1. Guardar como PDF
  const handleDownloadPdf = async () => {
    if (!letterRef.current) return;
    setIsExportingPdf(true);
    try {
      const filename = `Carta_${data.recipient ? data.recipient.split("\n")[0].replace(/[^a-zA-Z0-9]/g, "_").slice(0, 20) : "Oficial"}.pdf`;
      await generateLetterPdf(letterRef.current, filename, true);
      showStatus("¡PDF descargado con éxito!", "success");
    } catch (err) {
      console.error("Error al generar PDF:", err);
      showStatus("Hubo un problema al generar el PDF.", "error");
    } finally {
      setIsExportingPdf(false);
    }
  };

  // 2. Compartir por WhatsApp
  const handleShareWhatsApp = async () => {
    if (!letterRef.current) return;
    setIsSharingWhatsApp(true);
    try {
      const result = await shareLetterViaWhatsApp(letterRef.current, data);
      if (result.success) {
        if (result.method === "share_api") {
          showStatus("¡PDF compartido exitosamente!", "success");
        } else {
          showStatus("WhatsApp abierto. Puedes adjuntar el PDF descargado.", "info");
        }
      }
    } catch (err) {
      console.error("Error al compartir por WhatsApp:", err);
      showStatus("No se pudo iniciar el envío a WhatsApp.", "error");
    } finally {
      setIsSharingWhatsApp(false);
    }
  };

  // 3. Imprimir carta
  const handlePrint = () => {
    window.print();
  };

  const getThemeIcon = () => {
    if (themePreference === "system") {
      return <Laptop size={16} className="text-amber-400" />;
    }
    if (themePreference === "light") {
      return <Sun size={16} className="text-amber-500" />;
    }
    return <Moon size={16} className="text-blue-400" />;
  };

  const getThemeLabel = () => {
    if (themePreference === "system") {
      return `Sistema (${activeTheme === "dark" ? "Oscuro" : "Claro"})`;
    }
    return themePreference === "light" ? "Modo Claro" : "Modo Oscuro";
  };

  return (
    <header className="studio-header no-print">
      <div className="header-brand">
        <div className="brand-logo-badge">
          <span className="brand-icon">✍️</span>
        </div>
        <div className="brand-text-wrap">
          <h1 className="brand-title">Creador de Cartas</h1>
          <p className="brand-subtitle">Estudio de redacción y correspondencia fina</p>
        </div>
      </div>

      {statusMessage && (
        <div className={`status-toast status-${statusMessage.type}`}>
          <CheckCircle2 size={16} />
          <span>{statusMessage.msg}</span>
        </div>
      )}

      <div className="header-actions">
        {/* Alternador de Modo Claro / Oscuro / Sistema */}
        <button
          id="btn-toggle-theme"
          type="button"
          className="btn btn-secondary theme-toggle-btn"
          onClick={onCycleTheme}
          title={`Tema actual: ${getThemeLabel()}. Clic para cambiar.`}
        >
          {getThemeIcon()}
          <span className="theme-btn-label">{getThemeLabel()}</span>
        </button>

        {/* Plantillas */}
        <button
          id="btn-open-templates"
          type="button"
          className="btn btn-secondary"
          onClick={onOpenTemplates}
          title="Elegir una plantilla prediseñada"
        >
          <BookOpen size={16} className="text-amber-400" />
          <span className="btn-text-desktop">Plantillas</span>
        </button>

        {/* Reiniciar */}
        <button
          id="btn-reset-letter"
          type="button"
          className="btn btn-secondary btn-icon-only"
          onClick={onReset}
          title="Nueva carta en blanco"
        >
          <RotateCcw size={16} />
        </button>

        {/* Imprimir */}
        <button
          id="btn-print-letter"
          type="button"
          className="btn btn-secondary btn-print-header"
          onClick={handlePrint}
          title="Imprimir directamente en hoja física (Ctrl+P)"
        >
          <Printer size={16} />
          <span className="btn-text-desktop">Imprimir</span>
        </button>

        {/* Compartir WhatsApp */}
        <button
          id="btn-share-whatsapp"
          type="button"
          className="btn btn-whatsapp"
          onClick={handleShareWhatsApp}
          disabled={isSharingWhatsApp}
          title="Compartir el PDF de la carta por WhatsApp"
        >
          {isSharingWhatsApp ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Share2 size={16} />
          )}
          <span>WhatsApp</span>
        </button>

        {/* Guardar PDF */}
        <button
          id="btn-download-pdf"
          type="button"
          className="btn btn-primary"
          onClick={handleDownloadPdf}
          disabled={isExportingPdf}
          title="Exportar documento en archivo PDF listo para imprimir"
        >
          {isExportingPdf ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          <span>Guardar PDF</span>
        </button>
      </div>
    </header>
  );
}
