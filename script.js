const business = {
  name: "CRIDALVID",
  whatsapp: "[NUMERO]",
  email: "[CORREO]",
  city: "[CIUDAD]",
  address: "[CIUDAD Y DIRECCION]"
};

const services = [
  ["Ventanas de aluminio", "Sistemas corredizos, abatibles o fijos fabricados a medida para viviendas y proyectos.", "Mayor entrada de luz, ventilacion y buen sellado."],
  ["Puertas de aluminio y vidrio", "Puertas resistentes y modernas para interiores, exteriores y locales comerciales.", "Accesos seguros con acabado limpio y duradero."],
  ["Mamparas y divisiones", "Soluciones para separar ambientes sin perder amplitud visual ni luminosidad.", "Espacios mas ordenados, funcionales y elegantes."],
  ["Divisiones de bano", "Mamparas para ducha y bano con vidrio a medida y herrajes adecuados al espacio.", "Banos mas practicos, modernos y faciles de mantener."],
  ["Fachadas y vitrinas comerciales", "Frentes en aluminio y vidrio pensados para negocios, exhibicion y alto transito.", "Una primera impresion profesional para tus clientes."],
  ["Barandas y pasamanos", "Elementos de seguridad con vidrio y aluminio para escaleras, balcones y terrazas.", "Proteccion con una presencia visual ligera."],
  ["Espejos", "Espejos decorativos y funcionales cortados segun las medidas del proyecto.", "Ambientes mas amplios, luminosos y bien terminados."],
  ["Vidrio a medida", "Cortes e instalaciones para mesas, divisiones, repisas y soluciones especiales.", "Piezas precisas para resolver necesidades puntuales."]
];

function whatsappUrl(message) {
  const number = business.whatsapp.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

function isPlaceholder(value) {
  return !value || /^\[.+\]$/.test(String(value).trim());
}

document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("site-nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const serviceGrid = document.getElementById("services-grid");
const serviceSelect = document.getElementById("service-select");
serviceSelect.innerHTML = '<option value="">Selecciona una opcion</option>';

services.forEach(([name, description, benefit], index) => {
  const article = document.createElement("article");
  article.className = "service-card";
  article.innerHTML = `
    <div class="service-visual visual-${(index % 4) + 1}" aria-hidden="true"></div>
    <h3>${name}</h3>
    <p>${description}</p>
    <strong>${benefit}</strong>
    <a href="${whatsappUrl(`Hola CRIDALVID, quiero cotizar: ${name}.`)}" target="_blank" rel="noreferrer">Cotizar este servicio</a>
  `;
  serviceGrid.appendChild(article);

  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  serviceSelect.appendChild(option);
});

document.querySelectorAll(".js-whatsapp").forEach((link) => {
  link.href = whatsappUrl("Hola CRIDALVID, quiero solicitar una cotizacion para un trabajo de aluminio y vidrio.");
  link.target = "_blank";
  link.rel = "noreferrer";
});

const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalWhatsapp = document.getElementById("modal-whatsapp");

document.querySelectorAll(".project-tile").forEach((tile) => {
  tile.addEventListener("click", () => {
    const project = tile.dataset.project;
    modalTitle.textContent = project;
    modalWhatsapp.href = whatsappUrl(`Hola CRIDALVID, quiero un proyecto similar a: ${project}.`);
    modal.hidden = false;
  });
});

document.querySelector(".modal-close").addEventListener("click", () => {
  modal.hidden = true;
});
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.hidden = true;
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") modal.hidden = true;
});

document.getElementById("quote-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const status = document.getElementById("quote-status");

  if (!form.get("consent")) {
    status.textContent = "Marca el consentimiento para poder continuar por WhatsApp.";
    return;
  }

  const phone = String(form.get("phone") || "").trim();
  if (phone.length < 7) {
    status.textContent = "Revisa el telefono. Debe tener al menos 7 digitos.";
    return;
  }

  const message = [
    "Hola CRIDALVID, quiero solicitar una cotizacion.",
    `Nombre: ${form.get("name")}`,
    `Telefono: ${form.get("phone")}`,
    `Servicio: ${form.get("service")}`,
    `Medidas aproximadas: ${form.get("measurements") || "Por definir"}`,
    `Ubicacion del proyecto: ${form.get("location")}`,
    `Descripcion: ${form.get("description")}`
  ].join("\n");

  status.textContent = "Listo. Se abrira WhatsApp con tu solicitud ordenada.";
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
});

document.getElementById("career-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const status = document.getElementById("career-status");
  const phone = String(form.get("phone") || "").trim();

  if (phone.length < 7) {
    status.textContent = "Revisa el telefono para que podamos contactarte.";
    return;
  }

  const message = [
    "Hola CRIDALVID, quiero postular para trabajar con ustedes.",
    `Nombre: ${form.get("name")}`,
    `Telefono: ${form.get("phone")}`,
    `Correo: ${form.get("email")}`,
    `Puesto: ${form.get("role")}`,
    `Experiencia: ${form.get("experience")}`,
    `Mensaje: ${form.get("message") || "Sin mensaje adicional"}`
  ].join("\n");

  status.textContent = "Perfecto. Se abrira WhatsApp con tu postulacion.";
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
});

if (!isPlaceholder(business.email)) {
  document.querySelectorAll('a[href="mailto:[CORREO]"]').forEach((link) => {
    link.href = `mailto:${business.email}`;
  });
}
