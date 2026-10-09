const articleDialog = document.querySelector(".article-dialog");
const articleCategory = document.querySelector("#article-category");
const articleTitle = document.querySelector("#article-title");
const articleImage = document.querySelector(".article-dialog__image");
const articleText = document.querySelector(".article-dialog__text");

document.querySelectorAll(".feature .btn, .hero .btn").forEach((button) => {
  button.addEventListener("click", () => {
    const article = button.closest(".feature, .hero");
    const content = article.querySelector(".hero-text");
    const image = article.querySelector(".ph img");

    articleCategory.textContent = content.querySelector(".tag").textContent;
    articleTitle.textContent = content.querySelector("h1").textContent;
    articleImage.src = image.src;
    articleImage.alt = image.alt;
    articleText.replaceChildren(content.querySelector("p").cloneNode(true));
    articleDialog.showModal();
  });
});

document.querySelector(".article-dialog__close").addEventListener("click", () => {
  articleDialog.close();
});

articleDialog.addEventListener("click", (event) => {
  if (event.target === articleDialog) {
    articleDialog.close();
  }
});
