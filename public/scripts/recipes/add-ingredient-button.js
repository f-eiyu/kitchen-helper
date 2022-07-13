const addIngredientFields = () => {
  const ingredientsBlock = document.getElementById("ingredients-block");

  const newNameLabel = document.createElement("label");
  newNameLabel.classList.add("form-label");
  newNameLabel.setAttribute("for", "ingredients");
  newNameLabel.innerText = "Ingredient";

  const newName = document.createElement("input");
  newName.classList.add("form-control");
  newName.setAttribute("type", "text");
  newName.setAttribute("name", "ingredients")

  const newAmountLabel = document.createElement("label");
  newAmountLabel.classList.add("form-label");
  newAmountLabel.setAttribute("for", "amounts");
  newAmountLabel.innerText = "Amount";
  
  const newAmount = document.createElement("input");
  newAmount.classList.add("form-control");
  newAmount.setAttribute("type", "text");
  newAmount.setAttribute("inputmode", "numeric");
  newAmount.setAttribute("name", "amounts");

  [newNameLabel, newName, newAmountLabel, newAmount].forEach(dom => {
    ingredientsBlock.appendChild(dom);
  });
}

document.getElementById("add-ingredient").addEventListener("click", addIngredientFields);