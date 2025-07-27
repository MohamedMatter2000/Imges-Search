const imageWrapper = document.querySelector(".images");
const searchInput = document.querySelector(".search input");
const loadMoreBtn = document.querySelector(".gallery .Load-more");
const lightbox = document.querySelector(".lightbox");
const downloadImgBtn = lightbox.querySelector(".fa-download");
const closeImgBtn = lightbox.querySelector(".fa-x");
const apiKey = "Pls5L6c0a1TrwBBAK62HnQtng36lPRJvs8NEa4yycpTCRkCMwRJpdiYa";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;
const downloadImg = (imgURL) => {
  console.log(imgURL);
  fetch(imgURL)
    .then((res) => res.blob())
    .then((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = new Date().getTime();
      a.click();
    });
};
const showLightbox = (name, img) => {
  lightbox.querySelector("img").src = img;
  lightbox.querySelector("span").innerText = name;
  downloadImgBtn.setAttribute("data-img", img);
  lightbox.classList.add("show");
  document.body.style.overflow = "hidden";
};
const hideLightbox = () => {
  lightbox.classList.remove("show");
  document.body.style.overflow = "auto";
};
const generateHtml = (images) => {
  imageWrapper.innerHTML += images
    .map(
      (img) =>
        `<li class="card">
            <img onclick="showLightbox('${img.photographer}', '${img.src.large2x}')" src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                <i class="fa-solid fa-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}') ;">
                <i class="fa-solid fa-download"></i>
                </button>
            </div>
        </li>`
    )
    .join("");
};
const getimages = (apiURL) => {
  loadMoreBtn.innerHTML = "Loading...";
  loadMoreBtn.classList.add("diasabled");
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      generateHtml(data.photos);
      loadMoreBtn.innerHTML = "Load More";
      loadMoreBtn.classList.remove("diasabled");
    })
    .catch(() => {
      alert("failed to load images !");
    });
};
const loadMoreImages = () => {
  currentPage++;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`;
  apiURL
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    : apiURL;
  getimages(apiURL);
};
const loadsearchImages = (e) => {
  if (e.target.value == "") return (searchTerm = null);
  if (e.key === "Enter") {
    currentPage = 1;
    searchTerm = e.target.value;
    imageWrapper.innerHTML = "";
    console.log(searchTerm);
    getimages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    );
  }
};
getimages(
  `https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`
);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadsearchImages);
closeImgBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) =>
  downloadImg(e.target.dataset.img)
);
