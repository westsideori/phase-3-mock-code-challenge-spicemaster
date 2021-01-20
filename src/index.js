// write your code here
//DOM Elements
const spiceBlendDetail = document.getElementById("spice-blend-detail");
const updateForm = document.getElementById("update-form");
const addIngredientForm = document.getElementById("ingredient-form");
const spiceImages = document.getElementById("spice-images");

//Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  getSpiceBlend().then((spiceBlendsArray) => {
    renderSpiceImages(spiceBlendsArray);
  });
  getSpiceBlend(1).then((spiceBlend) => {
    renderSpiceBlend(spiceBlend);
  });
});

updateForm.addEventListener("submit", handleUpdate);
addIngredientForm.addEventListener("submit", handleIngredientAdd);

//Fetches
function getSpiceBlend(id) {
  if (!id) {
    return fetch(
      "http://localhost:3000/spiceblends?_embed=ingredients"
    ).then((resp) => resp.json());
  } else {
    return fetch(
      `http://localhost:3000/spiceblends/${id}/?_embed=ingredients`
    ).then((resp) => resp.json());
  }
}

function updateSpiceBlend(id, newTitle) {
  return fetch(`http://localhost:3000/spiceblends/${id}/?_embed=ingredients`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: newTitle,
    }),
  }).then((resp) => resp.json());
}

function updateIngredients(ingredientObj) {
  return fetch(`http://localhost:3000/ingredients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ingredientObj),
  }).then((resp) => resp.json());
}

//Event Handlers
function handleUpdate(event) {
  event.preventDefault();
  const id = spiceBlendDetail.dataset.id;
  const ingList = spiceBlendDetail
    .querySelector(".ingredients-container")
    .querySelector(".ingredients-list");
  const updatedSpiceBlend = {
    title: event.target.title.value,
  };
  updateSpiceBlend(id, updatedSpiceBlend.title).then((savedSpiceBlend) => {
    console.log(savedSpiceBlend);
    getSpiceBlend(savedSpiceBlend.id).then((data) => {
      ingList.innerHTML = null;
      renderSpiceBlend(data);
    });
  });
  event.target.reset();
}

function handleIngredientAdd(event) {
  event.preventDefault();
  const id = spiceBlendDetail.dataset.id;
  const ingList = spiceBlendDetail
    .querySelector(".ingredients-container")
    .querySelector(".ingredients-list");
  const newIng = {
    name: event.target.name.value,
    spiceblendId: parseInt(id),
  };
  updateIngredients(newIng).then((newIngObj) => {
    console.log(newIngObj);
    getSpiceBlend(newIngObj.spiceblendId).then((data) => {
      ingList.innerHTML = null;
      renderSpiceBlend(data);
    });
  });

  event.target.reset();
}

//Renders
function renderSpiceBlend(spiceBlendObject) {
  spiceBlendDetail.dataset.id = spiceBlendObject.id;
  const title = spiceBlendDetail.querySelector("h2");
  const image = spiceBlendDetail.querySelector("img");
  const ingList = spiceBlendDetail
    .querySelector(".ingredients-container")
    .querySelector(".ingredients-list");
  spiceBlendObject.ingredients.forEach(function (ingredient) {
    const ingLi = document.createElement("li");
    ingLi.textContent = ingredient.name;
    ingList.append(ingLi);
  });
  title.textContent = `${spiceBlendObject.title}`;
  image.src = `${spiceBlendObject.image}`;
}

function renderSpiceImages(spiceblendArray) {
  spiceblendArray.forEach(function (spiceBlend) {
    const ingList = spiceBlendDetail
      .querySelector(".ingredients-container")
      .querySelector(".ingredients-list");
    const img = document.createElement("img");
    img.dataset.id = spiceBlend.id;
    img.src = `${spiceBlend.image}`;
    img.alt = `${spiceBlend.name}`;
    img.addEventListener("click", function () {
      getSpiceBlend(img.dataset.id).then((data) => {
        ingList.innerHTML = null;
        renderSpiceBlend(data);
      });
    });
    spiceImages.append(img);
  });
}
