const buyMore = async (event) => {
  const buyMoreButton = event.target;
  const ingName = buyMoreButton.id.split("-")[2];

  const buyAmount = prompt(`Buy how much more ${ingName}?`);
  if (isNaN(buyAmount)) {
    alert("You did not enter a valid number.");
    return;
  }

  const newItem = {
    name: ingName,
    amount: buyAmount
  };
  
  // create/upsert shopping list item
  const targetUrl = buyMoreButton.getAttribute("target");
   const fetchInit = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({...newItem}),
    redirect: "follow"
   };
   const response = await fetch(targetUrl, fetchInit);
   alert("Shopping list updated!");
}


document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".buy-more-button").forEach(button => {
    if (button) { button.addEventListener("click", buyMore); }
  })
});