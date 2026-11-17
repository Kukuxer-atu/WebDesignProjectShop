
// =========================================
// CACTUSHOP - ANIMATED CART QUANTITY
// =========================================

(() => {

    const cards = document.querySelectorAll(
        "[data-shop-cart]"
    );

    if (!cards.length) return;

    // These functions already exist in cart.js
    if (
        typeof getCart !== "function" ||
        typeof addToCart !== "function" ||
        typeof setQuantity !== "function" ||
        typeof removeFromCart !== "function"
    ) {
        console.error(
            "CactuShop: Load cart.js before shop-quantity.js"
        );
        return;
    }


    // =====================================
    // GET CURRENT PRODUCT QUANTITY
    // =====================================

    function getQuantity(id) {

        const cart = getCart();

        const product = cart.find(
            item => String(item.id) === String(id)
        );

        return product ? Number(product.qty) || 0 : 0;

    }


    // =====================================
    // UPDATE THE CART
    // =====================================

    function updateQuantity(id, newQuantity) {

        const quantity = Math.max(
            0,
            Math.min(99, newQuantity)
        );

        const currentQuantity = getQuantity(id);

        if (quantity === 0) {

            removeFromCart(id);

        } else if (currentQuantity === 0) {

            addToCart(id, quantity);

        } else {

            setQuantity(id, quantity);

        }

    }


    // =====================================
    // REFRESH CARD APPEARANCE
    // =====================================

    function refreshCard(card) {

        const id = card.dataset.productId;
        const name = card.dataset.productName;

        const quantity = getQuantity(id);

        const isAdded = quantity > 0;

        const addButton = card.querySelector(
            "[data-shop-add]"
        );

        const panel = card.querySelector(
            "[data-shop-qty-panel]"
        );

        const input = card.querySelector(
            "[data-shop-qty]"
        );

        // Animate the card
        card.classList.toggle(
            "is-added",
            isAdded
        );

        // Change button into Added indicator
        addButton.disabled = isAdded;

        addButton.setAttribute(
            "aria-label",
            isAdded
                ? `${name} added to cart`
                : `Add ${name} to cart`
        );

        // Quantity controls are only accessible
        // when the product is in the cart
        panel.inert = !isAdded;

        panel.setAttribute(
            "aria-hidden",
            String(!isAdded)
        );

        // Display quantity
        input.value = quantity;

    }


    // =====================================
    // ACCESSIBLE ANNOUNCEMENT
    // =====================================

    function announce(card) {

        const status = card.querySelector(
            "[data-shop-status]"
        );

        const quantity = getQuantity(
            card.dataset.productId
        );

        status.textContent = quantity === 0
            ? `${card.dataset.productName} removed from cart`
            : `${card.dataset.productName}: ${quantity} in cart`;

    }


    // =====================================
    // REFRESH AFTER CHANGE
    // =====================================

    function applyQuantity(card, quantity) {

        const panel = card.querySelector(
            "[data-shop-qty-panel]"
        );

        const focusWasInside = panel.contains(
            document.activeElement
        );

        updateQuantity(
            card.dataset.productId,
            quantity
        );

        refreshCard(card);
        announce(card);

        // If quantity reaches zero, return focus
        // to the original Add button
        if (
            getQuantity(card.dataset.productId) === 0 &&
            focusWasInside
        ) {
            card.querySelector(
                "[data-shop-add]"
            ).focus();
        }

    }


    // =====================================
    // BUTTON CLICK EVENTS
    // =====================================

    document.addEventListener("click", (event) => {

        // Initial Add to Cart
        const addButton = event.target.closest(
            "[data-shop-add]"
        );

        if (addButton) {

            const card = addButton.closest(
                "[data-shop-cart]"
            );

            if (!card) return;

            if (getQuantity(card.dataset.productId) === 0) {

                applyQuantity(card, 1);

            }

            return;
        }


        // Increase quantity
        const plusButton = event.target.closest(
            "[data-shop-plus]"
        );

        if (plusButton) {

            const card = plusButton.closest(
                "[data-shop-cart]"
            );

            if (!card) return;

            const current = getQuantity(
                card.dataset.productId
            );

            applyQuantity(card, current + 1);

            return;
        }


        // Decrease quantity
        const minusButton = event.target.closest(
            "[data-shop-minus]"
        );

        if (minusButton) {

            const card = minusButton.closest(
                "[data-shop-cart]"
            );

            if (!card) return;

            const current = getQuantity(
                card.dataset.productId
            );

            applyQuantity(card, current - 1);

        }

    });


    // =====================================
    // MANUAL QUANTITY INPUT
    // =====================================

    document.addEventListener("change", (event) => {

        const input = event.target;

        if (!input.matches("[data-shop-qty]")) {
            return;
        }

        const card = input.closest(
            "[data-shop-cart]"
        );

        if (!card) return;

        const enteredValue = input.value.trim();

        // Reject invalid input and restore
        // the current cart quantity
        if (!/^\d+$/.test(enteredValue)) {

            refreshCard(card);
            return;

        }

        const quantity = Number(enteredValue);

        if (!Number.isSafeInteger(quantity)) {

            refreshCard(card);
            return;

        }

        applyQuantity(card, quantity);

    });


    // Commit a typed number when Enter is pressed
    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" &&
            event.target.matches("[data-shop-qty]")
        ) {

            event.preventDefault();
            event.target.blur();

        }

    });


    // =====================================
    // INITIALISE CARDS
    // =====================================

    function refreshAllCards() {

        cards.forEach(card => {
            refreshCard(card);
        });

    }

    refreshAllCards();


    // Refresh when returning to the page
    window.addEventListener(
        "pageshow",
        refreshAllCards
    );


    // Sync if cart changes in another tab
    window.addEventListener("storage", (event) => {

        if (event.key === "cart") {
            refreshAllCards();
        }

    });

})();
