const SETTINGS_KEY = "user_settings";
const DEFAULT_SETTINGS = { theme: "light", language: "en" };

const themeSelect = document.getElementById("themeSelect");
const langSelect = document.getElementById("langSelect");
const root = document.documentElement;
const themeLabel = document.getElementById("themeLabel");
const langLabel = document.getElementById("langLabel")
function loadSettings() {
  const json = localStorage.getItem(SETTINGS_KEY);
  if (!json) return { ...DEFAULT_SETTINGS };

  try {
    return JSON.parse(json);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
function updateSetting(key, value) {
  const settings = loadSettings();
  settings[key] = value;
  saveSettings(settings);
}

function applyTheme(theme) {
  root.classList.toggle("dark-theme", theme === "dark");
}

function updateUIText(lang) {
  const labels = {
    en: { theme: "Theme", language: "Language" },
    es: { theme: "Tema", language: "Idioma" },
    hi: { theme: "थीम", language: "भाषा" },
  };

  const text = labels[lang] || labels.en;
  themeLabel.textContent = text.theme;
  langLabel.textContent = text.language;
}

function initUI() {
  const settings = loadSettings();

  themeSelect.value = settings.theme;
  langSelect.value = settings.language;

  applyTheme(settings.theme);
  updateUIText(settings.language);

  themeSelect.addEventListener("change", (e) => {
    applyTheme(e.target.value);
    updateSetting("theme", e.target.value);
  });

  langSelect.addEventListener("change", (e) => {
    updateUIText(e.target.value);
    updateSetting("language", e.target.value);
  });
}

document.addEventListener("DOMContentLoaded", initUI);
