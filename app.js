
require("dotenv").config();

const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");

const passport = require("./config/passport");
const authRoutes = require("./routes/auth");

const products = require("./data/products.json");

const app = express();

const PORT = process.env.PORT || 3000;


/* =========================================
   HANDLEBARS CONFIGURATION
========================================= */

app.engine(
    "hbs",
    exphbs.engine({
        extname: ".hbs",

        defaultLayout: "default",

        layoutsDir: path.join(
            __dirname,
            "views/layouts"
        ),

        partialsDir: path.join(
            __dirname,
            "views/partials"
        ),

        helpers: {
            euro: (amount) =>
                "€" + Number(amount).toFixed(2)
        }
    })
);

app.set("view engine", "hbs");

app.set(
    "views",
    path.join(__dirname, "views")
);


/* =========================================
   STATIC FILES
========================================= */

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


/* =========================================
   SESSION CONFIGURATION
========================================= */

app.use(
    session({
        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            sameSite: "lax",

            secure:
                process.env.NODE_ENV === "production",

            maxAge: 24 * 60 * 60 * 1000
        }
    })
);


/* =========================================
   PASSPORT AUTHENTICATION
========================================= */

app.use(passport.initialize());
app.use(passport.session());


/* =========================================
   AUTHENTICATION ROUTES
========================================= */

app.use("/auth", authRoutes);


/* =========================================
   USER AVAILABLE IN ALL TEMPLATES
========================================= */

app.use((req, res, next) => {

    res.locals.user = req.user || null;

    next();

});


/* =========================================
   HOME PAGE
========================================= */

app.get("/", (req, res) => {

    res.render("pages/index", {

        head: {
            title: "Home | CactuShop"
        },

        state: {
            home: true
        },

        pageCss: "home.css"

    });

});


/* =========================================
   SHOP PAGE
========================================= */

app.get("/shop", (req, res) => {

    const categoryNames = [
        "Tall",
        "Round",
        "Sharp",
        "Columnar"
    ];

    const requestedCategory =
        req.query.category;

    const selectedCategory =
        categoryNames.includes(requestedCategory)
            ? requestedCategory
            : "";

    const filteredProducts =
        selectedCategory
            ? products.filter(
                product =>
                    product.category === selectedCategory
            )
            : products;

    const categories = categoryNames.map(name => ({
        name: name,

        url:
            "/shop?category=" +
            encodeURIComponent(name),

        active:
            name === selectedCategory
    }));

    res.render("pages/shop", {

        head: {
            title: "Shop | CactuShop"
        },

        state: {
            shop: true
        },

        pageCss: "shop.css",

        products: filteredProducts,

        categories: categories,

        selectedCategory: selectedCategory

    });

});


/* =========================================
   PRODUCT DETAILS
========================================= */

app.get("/product/:id", (req, res) => {

    const product = products.find(
        item => item.id === req.params.id
    );

    if (!product) {

        return res.status(404).render(
            "pages/404",
            {
                head: {
                    title:
                        "Product Not Found | CactuShop"
                }
            }
        );

    }

    res.render("pages/product", {

        head: {
            title: product.name + " | CactuShop"
        },

        state: {
            shop: true
        },

        product: product

    });

});


/* =========================================
   USER PROFILE
========================================= */

app.get("/profile", (req, res) => {

    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    res.render("pages/profile", {

        head: {
            title: "My Profile | CactuShop"
        },

        pageCss: "profile.css",

        state: {
            profile: true
        }

    });

});


/* =========================================
   SHOPPING CART
========================================= */

app.get("/cart", (req, res) => {

    res.render("pages/cart", {

        head: {
            title: "Cart | CactuShop"
        },

        state: {
            cart: true
        }

    });

});


/* =========================================
   CONTACT PAGE
========================================= */

app.get("/contact", (req, res) => {

    res.render("pages/contact", {

        head: {
            title: "Contact | CactuShop"
        },

        state: {
            contact: true
        }

    });

});


/* =========================================
   PRODUCT API
========================================= */

app.get("/api/products", (req, res) => {

    res.json(products);

});


/* =========================================
   404 PAGE
========================================= */

app.use((req, res) => {

    res.status(404).render("pages/404", {

        head: {
            title: "Page Not Found | CactuShop"
        }

    });

});


/* =========================================
   START SERVER
========================================= */

app.listen(PORT, () => {

    console.log(
        `CactuShop running at http://localhost:${PORT}`
    );

});
