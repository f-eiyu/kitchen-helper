const addIngredientFields = () => {
  // create wrapping containers for all elements
  const ingredientsBlock = document.getElementById("ingredients-block");
  const ingredientRow = document.createElement("div");
  const amountRow = document.createElement("div");
  ingredientRow.classList.add("form-text-row");
  amountRow.classList.add("form-text-row");

  // create ingredient name mini-form and place in its container
  const newNameLabel = document.createElement("label");
  newNameLabel.classList.add("form-label");
  newNameLabel.setAttribute("for", "ingredients");
  newNameLabel.innerText = "Ingredient";

  const newName = document.createElement("input");
  newName.classList.add("form-control");
  newName.setAttribute("type", "text");
  newName.setAttribute("name", "ingredients")

  ingredientRow.appendChild(newNameLabel);
  ingredientRow.appendChild(newName);

  // create ingredient amount mini-form and place in its container
  const newAmountLabel = document.createElement("label");
  newAmountLabel.classList.add("form-label");
  newAmountLabel.setAttribute("for", "amounts");
  newAmountLabel.innerText = "Amount";
  
  const newAmount = document.createElement("input");
  newAmount.classList.add("form-control");
  newAmount.setAttribute("type", "text");
  newAmount.setAttribute("inputmode", "numeric");
  newAmount.setAttribute("name", "amounts");

  amountRow.appendChild(newAmountLabel);
  amountRow.appendChild(newAmount);

  // append both mini-forms into the ingredients section
  [ingredientRow, amountRow].forEach(dom => {
    ingredientsBlock.appendChild(dom);
  });
}

document.getElementById("add-ingredient").addEventListener("click", addIngredientFields);