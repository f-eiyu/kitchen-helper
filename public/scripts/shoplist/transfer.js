const transferEvent = async (event) => {
  const transferButton = event.target;
  const boxLabelList = document.querySelectorAll(".checkbox-label");
  const checkedIds = [];

  transferButton.setAttribute("disabled", "true");

  // enumerate checked items
  boxLabelList.forEach(label => {
    const thisBox = label.querySelector("input[type='checkbox']")
    if (thisBox.getAttribute("checked") === "on") {
      const thisId = thisBox.getAttribute("id").split("-")[1];
      checkedIds.push(thisId);
    }
  });

  if (!checkedIds.length) {
    alert("No Shopping List items are checked!");
    return;
  }

  // send POST request
  const targetUrl = transferButton.getAttribute("target");
  const fetchInit = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ checkedIds }),
    redirect: "follow"
  };
  const response = await fetch(targetUrl, fetchInit);

  // reload the page
  window.location.href = response.url;
}

document.getElementById("transfer")?.addEventListener("click", transferEvent);