// Plantillas predeterminadas para redacción rápida de cartas

export const TEMPLATES = [
  {
    id: "formal",
    name: "Carta Formal / Laboral",
    badge: "Profesional",
    description: "Comunicación corporativa o institucional con tono formal y estructurado.",
    place: "Madrid",
    recipient: "Dra. Carmen Valenzuela\nDirectora de Recursos Humanos\nInnovación & Desarrollo S.A.",
    bodyHtml: `<p>Por medio de la presente, me dirijo a usted con el debido respeto para someter a su consideración mi postulación al cargo de <strong>Director de Proyectos Estratégicos</strong>, recientemente publicado por su prestigiosa institución.</p>
<p>A lo largo de mis más de ocho años de experiencia en el sector, he liderado iniciativas de transformación digital logrando:</p>
<ul>
  <li>Un incremento del <strong>35% en la eficiencia operativa</strong> de los procesos clave.</li>
  <li>La consolidación de equipos multidisciplinarios de alto rendimiento.</li>
  <li>La optimización de presupuestos manteniendo los más altos estándares de calidad.</li>
</ul>
<p>Agradezco de antemano el tiempo y atención dispensados a esta comunicación, y quedo a su entera disposición para ampliar cualquier información en una entrevista personal.</p>`,
    farewell: "Atentamente,",
    sender: "Ing. Alejandro Mendoza Ríos",
    senderTitle: "Consultor de Gestión y Estrategia",
    frameStyle: "frame-corporate",
    paperTone: "paper-white",
    fontFamily: "font-merriweather",
    fontSize: "15px",
    lineHeight: "1.75",
    signatureType: "cursive"
  },
  {
    id: "recomendacion",
    name: "Carta de Recomendación",
    badge: "Laboral",
    description: "Recomendación profesional destacando virtudes, ética y desempeño.",
    place: "Ciudad de México",
    recipient: "A quien corresponda:",
    bodyHtml: `<p>Es un auténtico placer extender mi más sincera recomendación en favor de la <strong>Lic. Sofía Navarro Morales</strong>, quien formó parte de nuestro equipo de trabajo durante los últimos cuatro años desempeñándose con distinción y excelencia.</p>
<p>Durante su trayectoria en la compañía, la Lic. Navarro demostró:</p>
<ul>
  <li><em>Intachable sentido ético</em> y compromiso con los objetivos organizacionales.</li>
  <li>Capacidad sobresaliente para resolver situaciones de alta complejidad con serenidad y asertividad.</li>
  <li>Extraordinarias habilidades de liderazgo colaborativo y empatía.</li>
</ul>
<p>Por tales virtudes, tengo la plena convicción de que aportará un valor incalculable a cualquier equipo o proyecto que decida integrar.</p>`,
    farewell: "Cordialmente,",
    sender: "Mtro. Fernando Castillo Ruiz",
    senderTitle: "Vicepresidente de Operaciones",
    frameStyle: "frame-classic",
    paperTone: "paper-ivory",
    fontFamily: "font-cormorant",
    fontSize: "16px",
    lineHeight: "1.8",
    signatureType: "cursive"
  },
  {
    id: "agradecimiento",
    name: "Carta de Agradecimiento",
    badge: "Cortesía",
    description: "Expresión cordial de gratitud por apoyo, hospitalidad o colaboración.",
    place: "Buenos Aires",
    recipient: "Estimada Familia Gutiérrez y Asociados,",
    bodyHtml: `<p>Deseo hacerles llegar mis más sinceras palabras de gratitud por el cálido recibimiento y el invaluable apoyo brindado durante las jornadas del reciente <strong>Encuentro Iberoamericano de Letras y Artes</strong>.</p>
<p>La generosidad y el entusiasmo que compartieron con todos nosotros han dejado una huella imborrable. <em>Los grandes proyectos solo son posibles cuando se construyen con personas con vocación genuina y corazón abierto.</em></p>
<p>Espero con ilusión la oportunidad de retribuir tanta amabilidad en un futuro cercano y continuar estrechando estos valiosos lazos de afecto y colaboración.</p>`,
    farewell: "Con aprecio y estima sincera,",
    sender: "Dra. Valentina Solís",
    senderTitle: "Cátedra de Humanidades",
    frameStyle: "frame-royal",
    paperTone: "paper-parchment",
    fontFamily: "font-playfair",
    fontSize: "15px",
    lineHeight: "1.75",
    signatureType: "cursive"
  },
  {
    id: "personal",
    name: "Carta Personal / Afecto",
    badge: "Emotiva",
    description: "Carta íntima, reflexiva y cercana con caligrafía cálida.",
    place: "",
    recipient: "Mi querido amigo Daniel,",
    bodyHtml: `<p>Te escribo estas líneas con la calma del atardecer, pensando en cuánto tiempo ha pasado desde nuestra última larga conversación frente a un buen café.</p>
<p>Quería recordarte lo mucho que valoro nuestra amistad y el apoyo incondicional que siempre me has brindado. <em>Hay amistades que el tiempo y la distancia no hacen más que fortalecer</em>, y la nuestra es sin duda uno de esos tesoros invaluables.</p>
<p>Espero que la vida te esté sonriendo con la misma generosidad con la que tú tratas a quienes te rodean. Cuídate mucho y hablemos pronto.</p>`,
    farewell: "Un abrazo muy fuerte y todo mi cariño,",
    sender: "Mateo",
    senderTitle: "",
    frameStyle: "frame-vintage",
    paperTone: "paper-parchment",
    fontFamily: "font-caveat",
    fontSize: "18px",
    lineHeight: "1.7",
    signatureType: "drawn"
  },
  {
    id: "renuncia",
    name: "Carta de Renuncia",
    badge: "Oficial",
    description: "Notificación de cese voluntario respetuoso y con agradecimiento.",
    place: "Bogotá D.C.",
    recipient: "Lic. Alberto Morales Gómez\nGerente General\nServicios Globales de Tecnología",
    bodyHtml: `<p>Sirva la presente para comunicarle formalmente mi decisión de <strong>renunciar irrevocablemente</strong> al cargo de <em>Especialista de Sistemas</em> que he venido desempeñando en esta organización.</p>
<p>Esta determinación responde exclusivamente a motivos de crecimiento profesional y personal. Mi último día de labores en la empresa será dentro de los plazos estipulados por la normativa vigente.</p>
<p>Quiero manifestar mi más profundo agradecimiento por la confianza depositada en mi persona, las oportunidades de aprendizaje y el excelente ambiente laboral compartido con mis compañeros.</p>`,
    farewell: "Sin otro particular, le saluda atentamente,",
    sender: "Sebastián Ortega Pineda",
    senderTitle: "C.C. 1.094.882.310",
    frameStyle: "frame-modern",
    paperTone: "paper-white",
    fontFamily: "font-inter",
    fontSize: "14px",
    lineHeight: "1.7",
    signatureType: "cursive"
  }
];

export const INITIAL_STATE = {
  date: new Date().toISOString().split("T")[0],
  dateFormat: "long", // 'long' (9 de septiembre de 2026) o 'short' (09/09/2026)
  place: "", // Sin texto preescrito
  recipient: "", // Sin texto preescrito
  bodyHtml: "", // Sin texto preescrito
  farewell: "Atentamente,",
  sender: "", // Sin texto preescrito
  senderTitle: "Testigo de Jehová", // Cargo establecido por el usuario
  frameStyle: "frame-classic",
  paperTone: "paper-ivory",
  fontFamily: "font-cormorant",
  textColor: "#2b2723",
  fontSize: "16px",
  lineHeight: "1.8",
  textAlign: "justify",
  signatureType: "cursive", // 'cursive' | 'drawn' | 'none'
  signatureDataUrl: null, // canvas drawing data url
  cursiveFont: "font-vibes"
};
