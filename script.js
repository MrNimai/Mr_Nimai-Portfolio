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

document.querySelectorAll(".faq-header").forEach((header) => {
    const toggleItem = () => {
        const item = header.closest(".faq-item");
        if (!item) return;

        const isActive = item.classList.contains("active");
        document.querySelectorAll(".faq-item").forEach((faq) => faq.classList.remove("active"));
        if (!isActive) {
            item.classList.add("active");
        }
    };

    header.addEventListener("click", toggleItem);
    header.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleItem();
        }
    });
});

function normalizePath(value) {
    return (value || "")
        .split("/")
        .pop()
        .toLowerCase();
}

function setActiveNavLink() {
    const currentPage = normalizePath(window.location.pathname) || "index.html";

    document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
        const href = normalizePath(link.getAttribute("href"));
        const isActive = href === currentPage;
        link.classList.toggle("active", isActive);
    });
}

setActiveNavLink();

if (siteHeader) {
    const updateHeaderState = () => {
        siteHeader.classList.toggle("scrolled", window.scrollY > 10);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState);
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealItems.length) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("visible"));
}
