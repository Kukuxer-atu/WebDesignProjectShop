
const menuButton = document.querySelector("[data-menu-toggle]");
const closeButton = document.querySelector("[data-menu-close]");
const sideMenu = document.querySelector("#side-menu");
const backdrop = document.querySelector("[data-menu-backdrop]");

function openMenu() {
  sideMenu.classList.add("open");
  backdrop.classList.add("open");

  sideMenu.inert = false;
  sideMenu.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");

  document.body.classList.add("menu-open");
  closeButton.focus();
}

function closeMenu() {
  sideMenu.classList.remove("open");
  backdrop.classList.remove("open");

  sideMenu.inert = true;
  sideMenu.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");

  document.body.classList.remove("menu-open");
  menuButton.focus();
}

menuButton.addEventListener("click", () => {
  if (sideMenu.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

closeButton.addEventListener("click", closeMenu);
backdrop.addEventListener("click", closeMenu);

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    sideMenu.classList.contains("open")
  ) {
    closeMenu();
  }
});

sideMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});
