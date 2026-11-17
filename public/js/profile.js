document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("profileBtn");
    const popup = document.getElementById("profilePopup");

    if (!button || !popup) return;

    button.addEventListener("click", () => {
        popup.hidden = !popup.hidden;
        button.setAttribute("aria-expanded", String(!popup.hidden));
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".profile-wrapper")) {
            popup.hidden = true;
            button.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            popup.hidden = true;
            button.setAttribute("aria-expanded", "false");
        }
    });
});