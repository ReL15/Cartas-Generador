import { generateLetterPdf } from "./exportPdf";

/**
 * Comparte la carta por WhatsApp:
 * 1. Intenta compartir directamente el archivo PDF mediante Web Share API (en móviles / navegadores compatibles).
 * 2. Si no es compatible con archivos, descarga el PDF y abre WhatsApp con un mensaje pre-formateado.
 * 
 * @param {HTMLElement} letterElement - Elemento de la carta
 * @param {Object} letterData - Datos de la carta (destinatario, remitente, lugar)
 * @returns {Promise<{ method: 'share_api' | 'whatsapp_link', success: boolean }>}
 */
export async function shareLetterViaWhatsApp(letterElement, letterData) {
  const filename = `Carta_${letterData.recipient ? letterData.recipient.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 20) : "Oficial"}.pdf`;

  try {
    // Generamos el archivo PDF
    const { file } = await generateLetterPdf(letterElement, filename, false);

    // 1. Verificar si el navegador soporta compartir archivos directamente (móviles y navegadores modernos)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: `Carta para ${letterData.recipient || "Destinatario"}`,
        text: `Hola, te comparto la carta generada para ${letterData.recipient || "Destinatario"} de parte de ${letterData.sender || "Remitente"}.`,
        files: [file]
      });
      return { method: "share_api", success: true };
    }
  } catch (err) {
    if (err.name === "AbortError") {
      // El usuario canceló el diálogo de compartir
      return { method: "share_api", success: false, cancelled: true };
    }
    console.warn("Web Share API no disponible o falló, recurriendo al enlace de WhatsApp:", err);
  }

  // 2. Fallback: Descarga el PDF y abre el enlace de WhatsApp Web / App
  try {
    await generateLetterPdf(letterElement, filename, true);
  } catch (e) {
    console.error("Error al descargar PDF fallback:", e);
  }

  const cleanRecipient = letterData.recipient ? letterData.recipient.split("\n")[0] : "Estimado/a";
  const messageText = `📄 *CARTA FORMAL*\n\n` +
    `*Para:* ${cleanRecipient}\n` +
    `*De:* ${letterData.sender || "Remitente"}\n` +
    (letterData.place ? `*Lugar:* ${letterData.place}\n` : "") +
    `\nAdjunto te envío el archivo PDF con la carta oficial en alta calidad.`;

  const encodedMessage = encodeURIComponent(messageText);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  return { method: "whatsapp_link", success: true };
}
