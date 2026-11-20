document.documentElement.classList.add("js");

const header = document.querySelector("#header");
const nav = document.querySelector("#nav");
const toggle = document.querySelector(".nav-toggle");
const form = document.querySelector("#reserve-form");
const success = document.querySelector("#form-success");
const errorBox = document.querySelector("#form-error");
const resetButton = document.querySelector("#form-reset");
const year = document.querySelector("#year");
const dateInput = form.querySelector('input[name="date"]');
const mobileQuery = window.matchMedia("(max-width: 980px)");

year.textContent = String(new Date().getFullYear());

const today = new Date();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
dateInput.min = today.getFullYear() + "-" + month + "-" + day;

function onScroll() {
  header.classList.toggle("is-solid", window.scrollY > 8);
  const links = nav.querySelectorAll('a[href^="#"]:not(.nav-reserve)');
  let current = "";
  links.forEach(function (link) {
    const section = document.querySelector(link.getAttribute("href"));
    if (!section) return;
    const top = section.getBoundingClientRect().top;
    if (top < 160) current = link.getAttribute("href");
  });
  links.forEach(function (link) {
    if (link.getAttribute("href") === current) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  header.classList.toggle("is-menu", open);
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.style.overflow = open ? "hidden" : "";
  syncNavInert();
}

function syncNavInert() {
  const mobile = mobileQuery.matches;
  const open = nav.classList.contains("is-open");
  if (mobile && !open) {
    nav.setAttribute("inert", "");
  } else {
    nav.removeAttribute("inert");
  }
  if (!mobile && open) setMenu(false);
}

toggle.addEventListener("click", function () {
  setMenu(!nav.classList.contains("is-open"));
});

nav.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    if (mobileQuery.matches) setMenu(false);
  });
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    setMenu(false);
    toggle.focus();
  }
});

if (typeof mobileQuery.addEventListener === "function") {
  mobileQuery.addEventListener("change", syncNavInert);
} else if (typeof mobileQuery.addListener === "function") {
  mobileQuery.addListener(syncNavInert);
}

const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );
  reveals.forEach(function (item) {
    observer.observe(item);
  });
} else {
  reveals.forEach(function (item) {
    item.classList.add("is-in");
  });
}

function clearInvalid() {
  form.querySelectorAll("[aria-invalid='true']").forEach(function (field) {
    field.removeAttribute("aria-invalid");
  });
  errorBox.hidden = true;
}

form.addEventListener("input", clearInvalid);

form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearInvalid();
  const invalid = form.querySelector(":invalid");
  if (invalid) {
    form.querySelectorAll(":invalid").forEach(function (field) {
      field.setAttribute("aria-invalid", "true");
    });
    errorBox.hidden = false;
    invalid.focus();
    return;
  }
  form.reset();
  dateInput.min = today.getFullYear() + "-" + month + "-" + day;
  form.hidden = true;
  success.hidden = false;
  success.focus();
});

resetButton.addEventListener("click", function () {
  success.hidden = true;
  form.hidden = false;
  form.querySelector("input[name='name']").focus();
});

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
syncNavInert();
