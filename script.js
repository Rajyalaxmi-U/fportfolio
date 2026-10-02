const themeToggle = document.querySelector("#themeToggle");
const themeIcon = themeToggle.querySelector("i");
const storedTheme = localStorage.getItem("portfolio-theme");

const setTheme = (theme) => {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);
  themeIcon.className = isDark ? "bi bi-sun" : "bi bi-moon-stars";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  document.querySelector('meta[name="theme-color"]').content = isDark ? "#202a35" : "#f8fafc";
};

setTheme(storedTheme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
  localStorage.setItem("portfolio-theme", nextTheme);
  setTheme(nextTheme);
});

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle("is-active", isSelected);
      filterButton.setAttribute("aria-pressed", String(isSelected));
    });

    document.querySelectorAll(".project-card").forEach((card) => {
      card.hidden = selectedFilter !== "all" && card.dataset.category !== selectedFilter;
    });
  });
});

const profileImage = document.querySelector("#profileImage");
const profilePlaceholder = document.querySelector("#profilePlaceholder");

const showPhoto = () => {
  profileImage.classList.add("is-loaded");
  profilePlaceholder.hidden = true;
};

const showPhotoPlaceholder = () => {
  profileImage.classList.remove("is-loaded");
  profilePlaceholder.hidden = false;
};

profileImage.addEventListener("load", showPhoto);
profileImage.addEventListener("error", showPhotoPlaceholder);
if (profileImage.complete && profileImage.naturalWidth > 0) showPhoto();

const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const gmailFallback = document.querySelector("#gmailFallback");
const fields = [
  { input: document.querySelector("#name"), error: document.querySelector("#nameError"), message: "Please enter your name." },
  { input: document.querySelector("#email"), error: document.querySelector("#emailError"), message: "Enter a valid email address." },
  { input: document.querySelector("#message"), error: document.querySelector("#messageError"), message: "Please add a short message." },
];

const validateField = ({ input, error, message }) => {
  const isValid = input.checkValidity() && input.value.trim().length > 0;
  input.setAttribute("aria-invalid", String(!isValid));
  error.textContent = isValid ? "" : message;
  return isValid;
};

fields.forEach(({ input, error, message }) => {
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") === "true") validateField({ input, error, message });
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";
  const isFormValid = fields.map(validateField).every(Boolean);

  if (!isFormValid) {
    formStatus.textContent = "A couple of details need your attention.";
    fields.find(({ input }) => input.getAttribute("aria-invalid") === "true")?.input.focus();
    return;
  }

  const [name, email, message] = fields.map(({ input }) => input.value.trim());
  const composeUrl = new URL("https://mail.google.com/mail/");
  composeUrl.search = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: "uvsnrlaxmi@gmail.com",
    su: `Portfolio message from ${name}`,
    body: `${message}\n\nFrom: ${name}\nEmail: ${email}`,
  }).toString();
  gmailFallback.href = composeUrl.toString();
  gmailFallback.hidden = false;
  const composeWindow = window.open(composeUrl.toString(), "_blank", "noopener,noreferrer");
  formStatus.textContent = composeWindow
    ? "Gmail opened with your draft. Review it, then press Send."
    : "Your draft is ready. Use the Gmail link below to open it, then press Send.";
});

document.querySelector("#currentYear").textContent = new Date().getFullYear();

document.querySelectorAll("#portfolioNav .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const navCollapse = document.querySelector("#portfolioNav");
    if (navCollapse.classList.contains("show") && window.bootstrap) {
      bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
    }
  });
});