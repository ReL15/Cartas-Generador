import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Genera un PDF de alta resolución (300 DPI equivalente) a partir del elemento HTML de la carta.
 * Utiliza un sandbox aislado a escala 1:1 real (210mm x 297mm) para que el zoom de pantalla,
 * el scroll o la pestaña activa en móviles/tablets no recorten el marco ni la firma.
 * 
 * @param {HTMLElement} element - Elemento DOM de la carta (#letter-paper-preview)
 * @param {string} filename - Nombre del archivo a generar
 * @param {boolean} shouldDownload - Si debe activar la descarga directa en el navegador
 * @returns {Promise<{ blob: Blob, file: File, dataUri: string }>}
 */
export async function generateLetterPdf(element, filename = "carta.pdf", shouldDownload = true) {
  if (!element) {
    throw new Error("No se encontró el elemento de la carta para exportar.");
  }

  // 1. Crear un contenedor sandbox aislado en el DOM, invisible al usuario pero medible a escala 1:1
  const sandbox = document.createElement("div");
  sandbox.style.position = "fixed";
  sandbox.style.left = "0";
  sandbox.style.top = "0";
  sandbox.style.width = "210mm";
  sandbox.style.zIndex = "-99999";
  sandbox.style.pointerEvents = "none";
  sandbox.style.overflow = "visible";
  sandbox.style.margin = "0";
  sandbox.style.padding = "0";
  sandbox.style.backgroundColor = "transparent";

  // 2. Clonar la carta completa con todos sus elementos, marcos, esquinas vectoriales y textos
  const clone = element.cloneNode(true);
  clone.id = "letter-paper-export-sandbox";

  // Aplicar estilos exactos de la hoja A4 (210mm x 297mm) sin afección por zoom o scroll
  clone.style.position = "relative";
  clone.style.display = "flex";
  clone.style.flexDirection = "column";
  clone.style.boxSizing = "border-box";
  clone.style.width = "210mm";
  clone.style.minHeight = "297mm";
  clone.style.height = "auto";
  clone.style.boxShadow = "none";
  clone.style.margin = "0";
  clone.style.transform = "none";

  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  try {
    // 3. Capturar el clon en el sandbox libre de cualquier transformación CSS externa
    const canvas = await html2canvas(clone, {
      scale: 2.5, // 300 DPI equivalente para nitidez nítida en texto y adornos
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1440,
      windowHeight: 1800
    });

    const imgData = canvas.toDataURL("image/png");

    // 4. Crear documento PDF en formato estándar A4 (210 x 297 mm)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;
    const marginX = (pdfWidth - finalWidth) / 2;
    const marginY = 0;

    pdf.addImage(imgData, "PNG", marginX, marginY, finalWidth, finalHeight, undefined, "FAST");

    if (shouldDownload) {
      pdf.save(filename);
    }

    const pdfBlob = pdf.output("blob");
    const file = new File([pdfBlob], filename, { type: "application/pdf" });

    return {
      blob: pdfBlob,
      file,
      dataUri: pdf.output("datauristring")
    };
  } finally {
    // 5. Retirar el sandbox del DOM
    if (sandbox.parentElement) {
      sandbox.parentElement.removeChild(sandbox);
    }
  }
}
