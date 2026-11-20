
/* =========================================
   CACTUSHOP — PRODUCT PAGE
========================================= */

/* Prevent the browser restoring the old scroll position */
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

/* Scroll down slightly when opening or reloading a product */
window.addEventListener("pageshow", () => {
    window.scrollTo({
        top: 140,
        behavior: "instant"
    });
});

/* =========================================
   QUANTITY CONTROLS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector(".quantity-input");
    const minus = document.querySelector(".quantity-minus");
    const plus = document.querySelector(".quantity-plus");

    if (!input || !minus || !plus) return;

    const update = value => {
        const number = parseInt(value, 10);
        input.value = Number.isNaN(number)
            ? 1
            : Math.max(1, Math.min(99, number));
    };

    minus.addEventListener("click", () => {
        update(Number(input.value) - 1);
    });

    plus.addEventListener("click", () => {
        update(Number(input.value) + 1);
    });

    input.addEventListener("change", () => {
        update(input.value);
    });

    document.querySelector(".product-buy-form")
        ?.addEventListener("submit", () => update(input.value));
});
