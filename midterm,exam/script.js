const articleDialog = document.querySelector(".article-dialog");
const articleCategory = document.querySelector("#article-category");
const articleTitle = document.querySelector("#article-title");
const articleImage = document.querySelector(".article-dialog__image");
const articleText = document.querySelector(".article-dialog__text");
const themeStorageKey = "daily-news-theme";
const themeButton = document.createElement("button");
const topTools = document.querySelector(".top-tools");
const searchBox = document.querySelector("#searchBox");
const searchContainer = document.querySelector(".search");
const searchButton = document.createElement("button");
const searchStatus = document.createElement("span");
const activityResults = document.createElement("div");

themeButton.type = "button";
themeButton.className = "theme-toggle";
themeButton.innerHTML = '<span aria-hidden="true"></span><span class="theme-toggle__label"></span>';
topTools.append(themeButton);

searchBox.readOnly = false;
searchBox.removeAttribute("readonly");
searchBox.autocomplete = "off";
searchButton.type = "button";
searchButton.className = "search__button";
searchButton.setAttribute("aria-label", "Search news");
searchButton.textContent = "Search";
searchStatus.className = "search__status";
searchStatus.setAttribute("role", "status");
searchStatus.setAttribute("aria-live", "polite");
activityResults.className = "search__results";
activityResults.setAttribute("aria-label", "Matching activities");
searchContainer.append(searchButton, searchStatus, activityResults);

const activitySearchIndex = [
  {
    title: "Activity 1 — Resume",
    href: "../resume/index.html",
    content: "Kevin Lomio Developer IT Student Experience Software Developer Bachelor of Science in Information Technology 2nd Year College web pages website layouts academic projects HTML CSS basic programming web development computer systems troubleshooting technical creative problem-solving skills IT Student BS Information Technology applications website design Frontend Development Web Developer Basic Hardware Software Support Education FEU Roosevelt IETI College Phone Email Address Antipolo City Rizal"
  },
  {
    title: "Activity 2 — Bulleted and Numbered Lists",
    href: "../bullets/bullets.html",
    content: "List Examples Bulleted list Numbered list Animals Cats Dogs Beagles Poodles Terriers Australian Boston Yorkshire Parti Chocolate Move image by 2px Learn to code HTML CSS JavaScript ES6 React State Components Mounting Unmounting"
  },
  {
    title: "Activity 3 — Calendar and Table",
    href: "../table/table.html",
    content: "Table Calendar current month and year Sun Mon Tue Wed Thu Fri Sat dates today Rowspan IETI Course Offering TESDA Diploma in Cybersecurity CHED SHS Tech-Pro SHS Academic IT BSIT"
  },
  {
    title: "Activity 4 — Frames",
    href: "../frameset/exercise2.html",
    content: "ALL about frames Resume Bullets Calendar Table LOSER VIDEO IETI List Examples Animals Cats Dogs Beagles Poodles Terriers Australian Boston Yorkshire Parti Chocolate Move image by 2px Learn to code HTML CSS JavaScript ES6 React State Components Mounting Unmounting"
  },
  {
    title: "Activity 5 — Identification Card",
    href: "../id card/id card.html",
    content: "Identification Card IETI College and Technology Inc Marikina Campus Your Passport to Work Here and Aboard PHOTO ID 2026-0411 Name John Kevin B Lomio Course and Section Bachelor of Science in Information Technology Date of Birth Dec 22 2004 STUDENT current academic year"
  },
  {
    title: "Activity 6 — Movie Zone",
    href: "../movie/index.html",
    content: "MoviZone Watch Movies TV Shows Anime Home Trending Now New Releases Top Rated Popular Series Comedy Movies Action Movies Furiosa A Mad Max Saga Atlas The Wages of Fear Supacell Vikings Valhalla Rising Impact The dog star Star wars Send help Forgotten Iland Moana Toxic One Piece Doctor Strange Detective Conan Mouse Avatar Transformer The Mask Little Brother Coyote vs Acme Jackass Best and Last Coming to America Friday Blood and Bone 2 The Witch Action Action Spider-Man No Way Home Batman v Superman Spider-Man Maverick Your Name Demon Slayer Whisper of the Heart Jujutsu Kaisen 0 Bleach Boruto Watch Now Address Antipolo Marikina Email Phone Service Office Reception"
  }
];

function searchNews() {
  const query = searchBox.value.trim().toLocaleLowerCase();
  const articles = document.querySelectorAll(
    ".hero, .feature, .card, .trending li, .latest li, .editor"
  );
  let matches = 0;

  articles.forEach((article) => {
    const isMatch = !query || article.textContent.toLocaleLowerCase().includes(query);
    article.hidden = !isMatch;
    if (isMatch) {
      matches += 1;
    }
  });

  const matchingActivities = query
    ? activitySearchIndex.filter((activity) =>
      `${activity.title} ${activity.content}`.toLocaleLowerCase().includes(query)
    )
    : [];

  activityResults.replaceChildren();
  matchingActivities.forEach((activity) => {
    const link = document.createElement("a");
    link.href = activity.href;
    link.textContent = activity.title;
    activityResults.append(link);
  });

  activityResults.hidden = matchingActivities.length === 0;
  if (!query) {
    searchStatus.textContent = "";
    return;
  }

  const activityCount = matchingActivities.length;
  const newsLabel = `${matches} news ${matches === 1 ? "result" : "results"}`;
  const activityLabel = `${activityCount} ${activityCount === 1 ? "activity" : "activities"}`;
  searchStatus.textContent = `${newsLabel}; ${activityLabel} found`;
}

searchButton.addEventListener("click", searchNews);
searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchNews();
  }
});

const themeIcon = themeButton.querySelector("span");
const themeLabel = themeButton.querySelector(".theme-toggle__label");

function setTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeButton.setAttribute("aria-pressed", String(isDark));
  themeButton.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
  themeButton.title = `Switch to ${isDark ? "light" : "dark"} mode`;
  themeIcon.textContent = isDark ? "\u2600" : "\u263E";
  themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
}

const savedTheme = localStorage.getItem(themeStorageKey);
setTheme(savedTheme === "dark" || (!savedTheme && document.body.classList.contains("home-page"))
  ? "dark"
  : "light");

themeButton.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem(themeStorageKey, nextTheme);
});

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

document.querySelectorAll("[data-latest-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.latestFilter;

    document.querySelectorAll("[data-latest-filter]").forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    document.querySelectorAll(".latest [data-news-category]").forEach((story) => {
      story.hidden = category !== "all" && story.dataset.newsCategory !== category;
    });
  });
});

document.querySelectorAll(".bookmark-button").forEach((button) => {
  button.addEventListener("click", () => {
    const isSaved = button.getAttribute("aria-pressed") === "true";
    const storyLabel = button.getAttribute("aria-label")
      .replace(/^(Save|Remove) /, "")
      .replace(/ from saved stories$/, "");
    button.setAttribute("aria-pressed", String(!isSaved));
    button.textContent = isSaved ? "\u2661" : "\u2665";
    button.setAttribute(
      "aria-label",
      isSaved ? `Save ${storyLabel}` : `Remove ${storyLabel} from saved stories`
    );
  });
});

const featuredStoryButton = document.querySelector(".featured-story-button");
featuredStoryButton?.addEventListener("click", () => {
  const storyImage = featuredStoryButton.querySelector("img");
  articleCategory.textContent = featuredStoryButton.querySelector(".tag").textContent;
  articleTitle.textContent = featuredStoryButton.querySelector(".featured-story-title").textContent;
  articleImage.src = storyImage.src;
  articleImage.alt = storyImage.alt;
  articleText.replaceChildren(document.createTextNode(
    "From pristine beaches to hidden gems, explore the best places to visit next year."
  ));
  articleDialog.showModal();
});

document.querySelector(".newsletter-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = document.querySelector(".newsletter-status");
  status.textContent = "Newsletter sign-up is not connected yet. Please check back soon.";
});

document.querySelector(".article-dialog__close").addEventListener("click", () => {
  articleDialog.close();
});

articleDialog.addEventListener("click", (event) => {
  if (event.target === articleDialog) {
    articleDialog.close();
  }
});

const revealTargets = document.querySelectorAll(
  ".header .wrap, .nav .wrap, .breaking, .hero, .trending, .page-head, .feature, .card, .panel, .trending li, .latest li, .back, .footer .wrap"
);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -32px 0px"
  });

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${(index % 6) * 70}ms`);
    revealObserver.observe(element);
  });
}
