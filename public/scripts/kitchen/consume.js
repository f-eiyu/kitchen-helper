const consume = async (event) => {
  const consumeButton = event.target;
  const ingName = consumeButton.id.split("-")[1];

  const consumeAmount = prompt(`How much ${ingName} is being consumed?`);
  if (isNaN(consumeAmount) || consumeAmount === "") {
    alert("You did not enter a valid number.");
    return;
  }
  else if (consumeAmount === null) { return; }

  const targetUrl = consumeButton.getAttribute("target");
  const fetchInit = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: ingName,
      consumeAmount
    }),
    redirect: "follow"
  }
  const response = await fetch(targetUrl, fetchInit);
  window.scrollTo(0, 0);
  location.reload();
}

document.querySelectorAll(".consume-button").forEach(button => {
  if (button) { button.addEventListener("click", consume); }
});