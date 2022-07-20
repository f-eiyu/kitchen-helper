// disable navigation buttons on the page and show text
const importRecipes = (event) => {
  const thisNode = event.target;

  document.querySelectorAll("input").forEach(input => {
    input.setAttribute("disabled", true);
  });
  document.getElementById("pleasewait").style.display = "block";

  window.location.href = thisNode.parentNode.getAttribute("action");
}

document.getElementById("import").addEventListener("click", importRecipes);