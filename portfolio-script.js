class PortfolioDisplay {
    constructor() {
        this.projectsGrid = document.getElementById("projectsGrid");
        this.projectCountEl = document.getElementById("projectCount");
        this.filterButtons = document.querySelectorAll("[data-filter]");
        this.currentFilter = "all";
        this.allProjects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];

        this.setupFilterButtons();
        this.updateProjectCount();
        this.renderProjects();
    }

    updateProjectCount() {
        if (this.projectCountEl) {
            this.projectCountEl.textContent = String(this.allProjects.length);
        }
    }

    setupFilterButtons() {
        this.filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                this.currentFilter = button.dataset.filter || "all";
                this.filterButtons.forEach((item) => item.classList.remove("active"));
                button.classList.add("active");
                this.renderProjects();
            });
        });
    }

    filteredProjects() {
        if (this.currentFilter === "all") {
            return this.allProjects;
        }

        return this.allProjects.filter((project) => project.category === this.currentFilter);
    }

    renderProjects() {
        if (!this.projectsGrid) return;

        const projects = this.filteredProjects();

        if (!projects.length) {
            this.projectsGrid.innerHTML = `
                <article class="card text-center">
                    <h3>No projects in this category yet</h3>
                    <p class="spacer-top">Edit projects in <code>projects-data.js</code> and refresh the page to see updates.</p>
                </article>
            `;
            return;
        }

        this.projectsGrid.innerHTML = projects.map((project) => `
            <article class="project-card reveal">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-overlay">
                        ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="button primary small">View Project</a>` : `<a href="contact.html" class="button primary small">Request Demo</a>`}
                    </div>
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${(project.tags || []).map((tag) => `<span>${tag}</span>`).join("")}
                    </div>
                </div>
            </article>
        `).join("");

        if (typeof setupRevealObserver === "function") {
            setupRevealObserver();
        }
    }
}

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNavPanel = document.getElementById("mobileNavPanel");
const siteHeader = document.getElementById("siteHeader");

if (mobileMenuBtn && mobileNavPanel) {
    mobileMenuBtn.addEventListener("click", () => {
        const isOpen = mobileNavPanel.classList.toggle("active");
        mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    mobileNavPanel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mobileNavPanel.classList.remove("active");
            mobileMenuBtn.setAttribute("aria-expanded", "false");
        });
    });
}

function normalizePath(value) {
    return (value || "").split("/").pop().toLowerCase();
}

document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
    const isActive = normalizePath(link.getAttribute("href")) === (normalizePath(window.location.pathname) || "portfolio.html");
    link.classList.toggle("active", isActive);
});

if (siteHeader) {
    const updateHeaderState = () => {
        siteHeader.classList.toggle("scrolled", window.scrollY > 10);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState);
}

function setupRevealObserver() {
    const revealItems = document.querySelectorAll(".reveal:not(.visible)");
    if (!revealItems.length) return;

    if (!("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("visible"));
        return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
}

setupRevealObserver();
new PortfolioDisplay();
