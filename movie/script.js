const searchInput = document.querySelector("#movieSearch");
const searchStatus = document.querySelector(".search-status");
const movieSections = [...document.querySelectorAll(".section")];
const movieItems = [...document.querySelectorAll(".section .row > li")];

function filterMovies() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  let matches = 0;

  movieItems.forEach((item) => {
    const isMatch = !query || item.textContent.toLocaleLowerCase().includes(query);
    item.hidden = !isMatch;
    if (isMatch) {
      matches += 1;
    }
  });

  movieSections.forEach((section) => {
    section.hidden = query.length > 0 && !section.querySelector(".row > li:not([hidden])");
  });

  searchStatus.textContent = query
    ? `${matches} ${matches === 1 ? "title" : "titles"} found`
    : "";
}

searchInput.addEventListener("input", filterMovies);

document.querySelectorAll(".view-all").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    searchInput.value = "";
    filterMovies();
    link.closest(".section").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealElements = document.querySelectorAll(".section, .section .row > li");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealElements.forEach((element, index) => {
    element.classList.add("reveal");
    if (element.matches("li")) {
      element.style.setProperty("--card-delay", `${(index % 6) * 55}ms`);
    }
    revealObserver.observe(element);
  });
}

document.querySelectorAll(".nav-list a").forEach((link) => {
  link.addEventListener("click", () => {
    const activeLink = document.querySelector(".nav-list a.active");
    if (activeLink) {
      activeLink.classList.remove("active");
    }
    link.classList.add("active");
  });
});
