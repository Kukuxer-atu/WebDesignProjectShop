
const express = require("express");
const exphbs = require("express-handlebars");

const products = require("./data/products.json");

const app = express();
const PORT = 3000;

// Configure Handlebars

app.engine(
    "hbs",
    exphbs.engine({
        extname: ".hbs",
        defaultLayout: "default",
        layoutsDir: "views/layouts",
        partialsDir: "views/partials",

        helpers: {
            euro: (amount) => "€" + Number(amount).toFixed(2)
        }
    })
);


app.set("view engine", "hbs");
app.set("views", "views");

// Static CSS, JS and images
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.render("index", {
    head: { title: "Home | CactuShop" },
    state: { home: true },
    pageCss: "home.css"
  });
});


// Shop page with category filtering
app.get("/shop", (req, res) => {

  const category = req.query.category;

  let filteredProducts = products;

  if (category) {
    filteredProducts = products.filter(
      (product) => product.category === category
    );
  }

  res.render("shop", {
    head: { title: "Shop | CactuShop" },
    state: { shop: true },
    products: filteredProducts
  });

});

// Individual product page
app.get("/product/:id", (req, res) => {

  const product = products.find(
    (item) => item.id === req.params.id
  );

  if (!product) {
    return res.status(404).render("404", {
      head: { title: "Product Not Found | CactuShop" }
    });
  }

  res.render("product", {
    head: { title: product.name + " | CactuShop" },
    product
  });

});

// Shopping cart
app.get("/cart", (req, res) => {
  res.render("cart", {
    head: { title: "Cart | CactuShop" },
    state: { cart: true }
  });
});

// Contact page
app.get("/contact", (req, res) => {
  res.render("contact", {
    head: { title: "Contact | CactuShop" }
  });
});

// Checkout page
app.get("/checkout", (req, res) => {
  res.render("checkout", {
    head: { title: "Checkout | CactuShop" }
  });
});

// API for cart JavaScript
app.get("/api/products", (req, res) => {
  res.json(products);
});

// 404 page
app.use((req, res) => {
  res.status(404).render("404", {
    head: { title: "Page Not Found | CactuShop" }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    "CactuShop is running at http://localhost:" + PORT
  );
});
