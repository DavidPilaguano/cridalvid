const { business } = window.CRIDA_CONFIG;
const services = window.CRIDA_SERVICES;
const projects = window.CRIDA_PROJECTS;

function whatsappUrl(message) {
  const number = business.whatsapp.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

function isPlaceholder(value) {
  return !value || /^\[.+\]$/.test(String(value).trim());
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value;
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
setText("[data-business-city]", business.city);
setText("[data-business-address]", business.address);
setText("[data-business-phone]", business.phonePrimary || business.whatsapp);
setText("[data-business-phone-secondary]", business.phoneSecondary);
setText("[data-business-email]", business.email);
setText("[data-business-schedule]", business.schedule);
setText("[data-business-coverage]", business.coverage);

function setSocialLink(selector, url, label) {
  document.querySelectorAll(selector).forEach((link) => {
    if (isPlaceholder(url) || !url) {
      link.href = "#";
      link.classList.add("is-disabled");
      link.setAttribute("aria-label", `${label} proximo a publicar`);
      link.setAttribute("title", `${label} proximo a publicar`);
      return;
    }
    link.href = url;
  });
}

setSocialLink(".js-instagram", business.instagram, "Instagram");
setSocialLink(".js-facebook", business.facebook, "Facebook");
document.querySelectorAll(".js-directions").forEach((link) => {
  link.href = business.directionsUrl;
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("site-nav");
if (menuToggle && nav) {
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
}

const serviceGrid = document.getElementById("services-grid");
const serviceSelect = document.getElementById("service-select");
if (serviceSelect) {
  serviceSelect.innerHTML = '<option value="">Selecciona una opcion</option>';
}

services.forEach((service, index) => {
  if (serviceGrid) {
    const article = document.createElement("article");
    article.className = "service-card";
    article.innerHTML = `
      <div class="service-visual visual-${(index % 4) + 1}" aria-hidden="true"></div>
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      <strong>${service.benefit}</strong>
      <a href="${whatsappUrl(`Hola CRIDALVID, quiero cotizar: ${service.name}.`)}" target="_blank" rel="noreferrer">Cotizar este servicio</a>
    `;
    serviceGrid.appendChild(article);
  }

  if (serviceSelect) {
    const option = document.createElement("option");
    option.value = service.name;
    option.textContent = service.name;
    serviceSelect.appendChild(option);
  }
});

document.querySelectorAll(".js-whatsapp").forEach((link) => {
  link.href = whatsappUrl("Hola CRIDALVID, quiero solicitar una cotizacion para un trabajo de aluminio y vidrio.");
  link.target = "_blank";
  link.rel = "noreferrer";
});

const projectGrid = document.getElementById("project-grid");
const projectFilters = document.getElementById("project-filters");
const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalMedia = document.getElementById("modal-media");
const modalWhatsapp = document.getElementById("modal-whatsapp");

function renderProjects(filter = "todos") {
  if (!projectGrid) return;
  const limit = Number(projectGrid.dataset.limit || 0);
  const visibleProjects = projects
    .filter((project) => filter === "todos" || project.category === filter)
    .slice(0, limit || projects.length);

  projectGrid.innerHTML = "";
  visibleProjects.forEach((project) => {
    const button = document.createElement("button");
    button.className = "project-tile";
    button.type = "button";
    button.dataset.project = project.title;
    button.dataset.src = project.src;
    button.dataset.media = project.media;
    button.innerHTML = `
      <span class="project-frame">
        ${
          project.media === "video"
            ? `<video src="${project.src}" muted playsinline preload="metadata"></video>`
            : `<img src="${project.src}" alt="${project.title}" loading="lazy" />`
        }
      </span>
      <strong>${project.title}</strong>
      <small>${project.type}</small>
    `;
    projectGrid.appendChild(button);
  });
}

if (projectGrid) {
  renderProjects();
  projectGrid.addEventListener("click", (event) => {
    const tile = event.target.closest(".project-tile");
    if (!tile || !modal) return;

    const project = tile.dataset.project;
    const src = tile.dataset.src;
    const media = tile.dataset.media;
    modalTitle.textContent = project;
    modalWhatsapp.href = whatsappUrl(`Hola CRIDALVID, quiero un proyecto similar a: ${project}.`);
    modalMedia.innerHTML =
      media === "video"
        ? `<video src="${src}" controls autoplay playsinline></video>`
        : `<img src="${src}" alt="${project}" />`;
    modal.hidden = false;
  });
}

if (projectFilters) {
  projectFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    projectFilters.querySelectorAll("[data-filter]").forEach((filterButton) => {
      filterButton.classList.remove("active");
      filterButton.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    renderProjects(button.dataset.filter);
  });
}

document.querySelector(".modal-close")?.addEventListener("click", () => {
  if (modal) {
    modal.hidden = true;
    modalMedia.innerHTML = "";
  }
});
modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.hidden = true;
    modalMedia.innerHTML = "";
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal) {
    modal.hidden = true;
    modalMedia.innerHTML = "";
  }
});

document.getElementById("quote-form")?.addEventListener("submit", (event) => {
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

document.getElementById("career-form")?.addEventListener("submit", (event) => {
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
