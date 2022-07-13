// greys out and strikethroughs a shopping list item when it's checked off.

const toggleCheckbox = (event) => {
  const checkbox = event.target;
  console.log(checkbox);

  if (checkbox.checked) {
    checkbox.parentNode.classList.add("list-item-checked");
  } else {
    checkbox.parentNode.classList.remove("list-item-checked");
  }
}

const allCheckboxes = document.querySelectorAll(".checkbox-label");

allCheckboxes.forEach(checkbox => {
  checkbox.addEventListener("change", toggleCheckbox);
});