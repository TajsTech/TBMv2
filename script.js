document.addEventListener("DOMContentLoaded", () => {
  const photoGrid = document.getElementById("photoGrid");
  const photoTabs = document.querySelectorAll("#photo-filters button");

  const videoGrid = document.getElementById("videoGrid");
  const videoTabs = document.querySelectorAll("#video-filters button");

  let photos = [];
  let videos = [];

  // Load photos
  fetch("images.json")
    .then(res => res.json())
    .then(data => {
      photos = data;
      renderGrid(photoGrid, photos, "all");
    });

  // Load videos
  fetch("videos.json")
    .then(res => res.json())
    .then(data => {
      videos = data;
      renderGrid(videoGrid, videos, "all");
    });

  // Filtering setup
  setupFilter(photoTabs, photoGrid, () => photos);
  setupFilter(videoTabs, videoGrid, () => videos);

  // Filter handler
  function setupFilter(tabs, grid, getData) {
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(btn => btn.classList.remove("active"));
        tab.classList.add("active");
        renderGrid(grid, getData(), tab.dataset.filter);
      });
    });
  }

  // Generic renderer
  function renderGrid(container, data, filter) {
  container.innerHTML = "";
  const filtered = filter === "all"
    ? data
    : data.filter(item => item.category === filter);

  filtered.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "photo-card";

    if (item.type === "youtube") {
      card.innerHTML = `
        <div class="video-wrapper">
          <iframe 
            src="${item.url}" 
            title="${item.title}" 
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>`;
    } else if (item.url.endsWith(".mp4")) {
      card.innerHTML = `
        <video src="${item.url}" controls playsinline muted></video>
      `;
    } else {
      card.innerHTML = `<img src="${item.url}" alt="${item.title}">`;
    }

    container.appendChild(card);
    setTimeout(() => card.classList.add("visible"), 100 * i);
  });
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});
// Shrink header on scroll
const header = document.querySelector('.main-header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  if (window.scrollY > 50 && window.scrollY > lastScrollY) {
    header.classList.add('shrink');
  } else if (window.scrollY < lastScrollY) {
    header.classList.remove('shrink');
  }
  lastScrollY = window.scrollY;
});
// Smooth scroll with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    const headerOffset = 80; // adjust if your header height changes
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  });
});

