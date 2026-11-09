// load express
const express = require('express');
// load handlebars
const exphbs = require('express-handlebars');

// instantiate express
const app = express();

// configure express to use handlebars as templating engine
app.engine(
  'hbs',
  exphbs.engine({
    extname: '.hbs',
    // use this layout by default - if you have different layout
    // for say home page - you can toggle this in your code
    defaultLayout: 'default',
    // set location of layouts
    layoutsDir: 'views/layouts',
    // set location of partials - header, footer, etc
    partialsDir: 'views/partials',
    // helpers are small functions you can call from a template
    // e.g. {{euro price}} turns 12.5 into €12.50
    helpers: {
      euro: (amount) => '€' + Number(amount).toFixed(2),
    },
  })
);

// load the product catalogue from a JSON file
// each product has: id, name, description, price, image, alt
const products = require('./data/products.json');
// set the view engine to handlesbards
app.set('view engine', 'hbs');
// where to find all of the view
app.set('views',  'views');


// where to find static files - css, images, js
// this needs to be uncommented so that the css file can be found and used in the layout.hbs file
app.use(express.static('public'));

// home page or home route
app.get('/', (req, res) => {

  // set active for navigation
  state={home:true}
  // set specifics for <head>
  head={title: "Home - Week 1"}
  // pass object to to render in "index"
  res.render('index', {state, head});
  // send this to terminal where node app is running
  console.log('home')

});

// contact route
app.get('/getintouch', (req, res) => {
    state={contact : true}
    head={title:"Contact - Week 1"}
    res.render('contact', { state, head});
    console.log('contact')
  });


// shop route - lists every product
app.get('/shop', (req, res) => {
  const state = { shop: true };
  const head = { title: 'Shop' };
  // pass the whole products array to the "shop" view
  // the view loops over it with {{#each products}}
  res.render('shop', { state, head, products });
});

// product detail route - :id is a route parameter
// e.g. /product/3 gives req.params.id === '3'
app.get('/product/:id', (req, res) => {
  // find the one product whose id matches the URL
  const product = products.find((p) => p.id === req.params.id);

  // no match - send a 404 page instead
  if (!product) {
    const head = { title: 'Product not found' };
    return res.status(404).render('404', { head });
  }

  const state = { shop: true };
  const head = { title: product.name };
  res.render('product', { state, head, product });
});

// cart route - the page itself is mostly empty;
// public/js/cart.js fills it in from localStorage in the browser
app.get('/cart', (req, res) => {
  const state = { cart: true };
  const head = { title: 'Your cart' };
  res.render('cart', { state, head });
});

// checkout route - a starting point for your checkout form
app.get('/checkout', (req, res) => {
  const state = { cart: true };
  const head = { title: 'Checkout' };
  res.render('checkout', { state, head });
});

// sends the product list as JSON so cart.js can look up
// names, prices and images for the ids stored in the cart
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});