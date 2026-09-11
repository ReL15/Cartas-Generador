import React from "react";

// Esquinas ornamentales vectoriales para marcos clásicos, vintage y reales
const CornerOrnament = ({ className = "", color = "currentColor" }) => (
  <svg
    className={`frame-ornament-corner ${className}`}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color }}
  >
    <path
      d="M2 2H48V8H8V48H2V2Z"
      fill="currentColor"
    />
    <path
      d="M12 12H38V16H16V38H12V12Z"
      fill="currentColor"
    />
    <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    <path
      d="M26 12C26 18 32 24 38 24V21C34 21 29 17 29 12H26Z"
      fill="currentColor"
    />
    <path
      d="M12 26C18 26 24 32 24 38H21C21 34 17 29 12 29V26Z"
      fill="currentColor"
    />
  </svg>
);

const VintageOrnament = ({ className = "", color = "#8c5b3f" }) => (
  <svg
    className={`frame-ornament-corner ${className}`}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color }}
  >
    <path
      d="M4 4C20 4 34 18 34 34H30C30 20 18 8 4 8V4Z"
      fill="currentColor"
    />
    <path
      d="M4 14C14 14 24 24 24 34H21C21 22 12 17 4 17V14Z"
      fill="currentColor"
    />
    <circle cx="8" cy="8" r="3" fill="currentColor" />
    <circle cx="36" cy="36" r="2" fill="currentColor" />
  </svg>
);

export default function LetterPreview({ data, letterRef }) {
  // Formatear la fecha según el formato elegido
  const formatLetterDate = (dateStr, format, place) => {
    if (!dateStr) return "";
    let formattedDate = dateStr;
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);

      if (format === "long") {
        formattedDate = dateObj.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });
      } else {
        formattedDate = dateObj.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
      }
    } catch {
      formattedDate = dateStr;
    }

    if (place && place.trim()) {
      return `${place.trim()}, ${formattedDate}`;
    }
    return formattedDate;
  };

  const headerDateString = formatLetterDate(data.date, data.dateFormat, data.place);

  const renderOrnaments = () => {
    if (data.frameStyle === "frame-classic") {
      return (
        <>
          <CornerOrnament className="corner-tl" color="#524233" />
          <CornerOrnament className="corner-tr" color="#524233" />
          <CornerOrnament className="corner-bl" color="#524233" />
          <CornerOrnament className="corner-br" color="#524233" />
        </>
      );
    }
    if (data.frameStyle === "frame-vintage") {
      return (
        <>
          <VintageOrnament className="corner-tl" color="#8c5b3f" />
          <VintageOrnament className="corner-tr" color="#8c5b3f" />
          <VintageOrnament className="corner-bl" color="#8c5b3f" />
          <VintageOrnament className="corner-br" color="#8c5b3f" />
        </>
      );
    }
    if (data.frameStyle === "frame-royal") {
      return (
        <>
          <CornerOrnament className="corner-tl" color="#b8860b" />
          <CornerOrnament className="corner-tr" color="#b8860b" />
          <CornerOrnament className="corner-bl" color="#b8860b" />
          <CornerOrnament className="corner-br" color="#b8860b" />
        </>
      );
    }
    return null;
  };

  return (
    <div
      ref={letterRef}
      id="letter-paper-preview"
      className={`letter-paper ${data.frameStyle || "frame-classic"} ${data.paperTone || "paper-ivory"}`}
    >
      {/* Esquinas decorativas vectoriales */}
      {renderOrnaments()}

      {/* 1. Encabezamiento: Fecha y Lugar */}
      <div className="letter-header-row">
        {headerDateString && (
          <div className={`letter-date-display ${data.fontFamily || "font-cormorant"}`}>
            {headerDateString}
          </div>
        )}
      </div>

      {/* 2. Encabezamiento: Destinatario */}
      {data.recipient && (
        <div className={`letter-recipient-display ${data.fontFamily || "font-cormorant"}`}>
          {data.recipient.split("\n").map((line, idx) => (
            <div key={idx} className={idx === 0 ? "recipient-primary" : "recipient-secondary"}>
              {line}
            </div>
          ))}
        </div>
      )}

      {/* 3. Cuerpo de la Carta (HTML enriquecido con formato) */}
      <div
        className={`letter-body-display ${data.fontFamily || "font-cormorant"}`}
        style={{
          color: data.textColor || "#2b2723",
          fontSize: data.fontSize || "16px",
          lineHeight: data.lineHeight || "1.8",
          textAlign: data.textAlign || "justify"
        }}
        dangerouslySetInnerHTML={{
          __html: data.bodyHtml && data.bodyHtml.trim()
            ? data.bodyHtml
            : '<p class="letter-placeholder-text">[Escribe aquí el cuerpo de la carta en el editor...]</p>'
        }}
      />

      {/* 4. Despedida, Firma y Remitente */}
      <div className={`letter-footer-display ${data.fontFamily || "font-cormorant"}`}>
        {data.farewell && (
          <div className="letter-farewell-text">
            {data.farewell}
          </div>
        )}

        {/* Zona de Firma */}
        <div className="letter-signature-area">
          {data.signatureType === "drawn" && data.signatureDataUrl ? (
            <div className="letter-signature-drawn">
              <img src={data.signatureDataUrl} alt="Firma digital" />
            </div>
          ) : data.signatureType === "cursive" && data.sender ? (
            <div className="letter-signature-cursive">
              {data.sender}
            </div>
          ) : (
            <div className="letter-signature-space" />
          )}
        </div>

        {/* Nombre del Creador de la carta */}
        {data.sender && (
          <div className="letter-sender-name">
            {data.sender}
          </div>
        )}

        {/* Cargo / Título */}
        {data.senderTitle && (
          <div className="letter-sender-title">
            {data.senderTitle}
          </div>
        )}
      </div>
    </div>
  );
}
