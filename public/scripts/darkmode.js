const htmlDom = document.querySelector("html");

const setDarkMode = () => {
  htmlDom.setAttribute("color-mode", "dark");
}

const removeDarkMode = () => {
  htmlDom.setAttribute("color-mode", "light");
}

const toggleDarkMode = (event) => {
  const currentColorMode = htmlDom.getAttribute("color-mode");

  if (currentColorMode === "light") { setDarkMode(); }
  else { removeDarkMode(); }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("test").addEventListener("click", toggleDarkMode);

  // automatically set dark mode if the browser prefers it
  // TODO: remember light/dark mode on the user's account!
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setDarkMode();
  }
})