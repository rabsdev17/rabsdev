/* ============================================================
   Richard Betancur — Portafolio
   ------------------------------------------------------------
   ★ CONFIGURA TUS DATOS AQUÍ ★
   Cambia estos valores y todos los enlaces del sitio
   (botón HABLEMOS, Email, WhatsApp) se actualizan solos.
   ============================================================ */
const CONFIG = {
  email: "tu-correo@ejemplo.com",      // ← tu correo real
  whatsapp: "573116370583",            // ← tu número con código de país, sin + ni espacios
  // Pega aquí tu enlace de Formspree (ej: "https://formspree.io/f/abcdwxyz").
  // Mientras esté vacío, el formulario envía los datos por WhatsApp.
  formspree: "https://formspree.io/f/xpppnyke",
  whatsappMsg: "Hola Richard, vi tu portafolio y tengo un proyecto en mente",
};
/* ============================================================ */

// --- Enlaces de contacto ---
document.querySelectorAll('[data-contact="email"]').forEach((el) => {
  el.setAttribute("href", "mailto:" + CONFIG.email);
});
document.querySelectorAll('[data-contact="whatsapp"]').forEach((el) => {
  el.setAttribute(
    "href",
    "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(CONFIG.whatsappMsg)
  );
});

// --- Año dinámico en el footer ---
document.getElementById("year").textContent = new Date().getFullYear();

// --- Header: fondo al hacer scroll ---
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// --- Consola del hero: tipeo con retrasos aleatorios ---
(function typeConsole() {
  const cmdEl = document.getElementById("type-cmd");
  const outEl = document.getElementById("type-out");
  const command = "whoami && stack --list";
  const output = "richard_betancur → php · mysql · wordpress · python · js · node · mongodb";
  let i = 0;

  function typeChar() {
    if (i <= command.length) {
      cmdEl.textContent = command.slice(0, i);
      i++;
      setTimeout(typeChar, 40 + Math.random() * 160);
    } else {
      setTimeout(() => {
        let j = 0;
        (function typeOut() {
          if (j <= output.length) {
            outEl.textContent = output.slice(0, j);
            j++;
            setTimeout(typeOut, 14);
          }
        })();
      }, 350);
    }
  }

  setTimeout(typeChar, 600);
})();

// --- Reveal al hacer scroll (terminal-chunk-in) ---
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// --- Formulario de contacto ---
const form = document.getElementById("contact-form");
if (form) {
  const status = document.getElementById("form-status");
  const btn = form.querySelector(".form-submit");
  const setStatus = (msg, cls) => { status.textContent = msg; status.className = "form-status " + (cls || ""); };
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    if (d._gotcha) return;
    for (const k of ["nombre", "contacto", "necesidad", "presupuesto"]) d[k] = (d[k] || "").trim();
    if (!d.nombre || !d.contacto || !d.necesidad || !d.presupuesto) {
      setStatus("Por favor completa todos los campos.", "error"); return;
    }
    if (!CONFIG.formspree) {
      const msg = `Hola Richard, soy ${d.nombre}.\nNecesito: ${d.necesidad}\nPresupuesto: ${d.presupuesto}\nContacto: ${d.contacto}`;
      window.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");
      return;
    }
    btn.disabled = true; setStatus("Enviando…");
    try {
      const res = await fetch(CONFIG.formspree, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ ...d, _subject: `Nuevo mensaje de ${d.nombre} — portafolio` }),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setStatus("¡Gracias! Te respondo muy pronto.", "ok");
    } catch {
      setStatus("No se pudo enviar. Escríbeme por WhatsApp con el botón verde.", "error");
    } finally { btn.disabled = false; }
  });
}
