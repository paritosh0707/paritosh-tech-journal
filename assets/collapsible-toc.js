// Collapsible TOC for mkdocs-material right sidebar with single expand/collapse all icon button

document.addEventListener("DOMContentLoaded", function () {
  const toc = document.querySelector(".md-sidebar--secondary");
  if (!toc) return;

  // Find the TOC title (Table of contents)
  const tocTitle = toc.querySelector(".md-sidebar__title") || toc.querySelector("h2, h3, h4, h5, h6");

  // Create a single icon button for expand/collapse all
  const toggleAllBtn = document.createElement("button");
  toggleAllBtn.className = "toc-toggle-all-btn";
  toggleAllBtn.title = "Collapse all";
  toggleAllBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  toggleAllBtn.style.marginLeft = "8px";

  // Insert the button to the right of the TOC title
  if (tocTitle) {
    tocTitle.style.display = "flex";
    tocTitle.style.alignItems = "center";
    tocTitle.appendChild(toggleAllBtn);
  }

  // Helper to set all sublists expanded/collapsed
  function setAll(expanded) {
    toc.querySelectorAll("nav ul li ul").forEach(function (subList) {
      subList.style.display = expanded ? "block" : "none";
      const parent = subList.parentElement;
      const toggle = parent.querySelector(".toc-toggle");
      if (toggle) toggle.innerText = expanded ? "▾" : "▸";
    });
  }

  // Make all sublists expanded by default
  setAll(true);
  let allExpanded = true;

  // Toggle all on button click
  toggleAllBtn.addEventListener("click", function () {
    allExpanded = !allExpanded;
    setAll(allExpanded);
    if (allExpanded) {
      toggleAllBtn.title = "Collapse all";
      toggleAllBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    } else {
      toggleAllBtn.title = "Expand all";
      toggleAllBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
  });

  // Add individual toggles, vertically aligned
  toc.querySelectorAll("nav ul li ul").forEach(function (subList) {
    const parent = subList.parentElement;
    let toggle = parent.querySelector(".toc-toggle");
    if (!toggle) {
      toggle = document.createElement("span");
      toggle.classList.add("toc-toggle");
      parent.insertBefore(toggle, parent.firstChild);
    }
    toggle.innerText = "▾";
    toggle.style.cursor = "pointer";
    toggle.style.marginRight = "5px";
    toggle.style.userSelect = "none";
    toggle.style.display = "inline-block";
    toggle.style.verticalAlign = "middle";
    subList.style.display = "block";

    toggle.addEventListener("click", () => {
      if (subList.style.display === "none") {
        subList.style.display = "block";
        toggle.innerText = "▾";
      } else {
        subList.style.display = "none";
        toggle.innerText = "▸";
      }
    });
  });

  // Add level indicators to TOC items
  toc.querySelectorAll("nav ul li").forEach(function (li) {
    li.setAttribute("data-toc-level", li.closest("ul").parentElement ? 2 : 1);
  });
});

// Custom Alert Functionality
function showCustomAlert(title, message, icon = "🚀") {
  // Create alert HTML
  const alertHTML = `
    <div class="custom-alert-overlay" id="customAlert">
      <div class="custom-alert-box">
        <span class="custom-alert-icon">${icon}</span>
        <h3 class="custom-alert-title">${title}</h3>
        <p class="custom-alert-message">${message}</p>
        <button class="custom-alert-button" onclick="hideCustomAlert()">Got it!</button>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.insertAdjacentHTML('beforeend', alertHTML);
  
  // Show with animation
  setTimeout(() => {
    document.getElementById('customAlert').classList.add('show');
  }, 10);
}

function hideCustomAlert() {
  const alert = document.getElementById('customAlert');
  if (alert) {
    alert.classList.remove('show');
    setTimeout(() => {
      alert.remove();
    }, 300);
  }
}

// Close alert when clicking outside
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('custom-alert-overlay')) {
    hideCustomAlert();
  }
});

// Close alert with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    hideCustomAlert();
  }
}); 