// show the readmore text and hide the "Read more" button
const expandReadmore = (event) => {
  const thisExpand = event.target;
  const thisExpandId = thisExpand.id;

  const thisReadmoreId = thisExpandId.split("-").slice(1).join("-");
  const thisReadmore = document.getElementById(thisReadmoreId);
  
  thisExpand.style.display = "none";
  thisReadmore.style.display = "inline";
}

const readmores = document.querySelectorAll(".readmore-link");
readmores.forEach(a => a.addEventListener("click", expandReadmore));