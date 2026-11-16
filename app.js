
const express = require('express');
const exphbs = require('express-handlebars');
const products = require('./data/products.json');
const app = express();
const PORT = process.env.PORT || 3000;

app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: 'default',
  layoutsDir: 'views/layouts',
  partialsDir: 'views/partials',
  helpers: { euro: amount => '€' + Number(amount).toFixed(2) }
}));
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static('public'));

const categories = ['Tall', 'Round', 'Sharp', 'Columnar'];

app.get('/', (req, res) => {
  res.render('index', { state: { home: true }, head: { title: 'Home | CactuShop' } });
});

app.get('/shop', (req, res) => {
  const requestedCategory = String(req.query.category || '');
  const selectedCategory = categories.includes(requestedCategory) ? requestedCategory : '';
  const query = String(req.query.q || '').trim().slice(0, 80);
  const matchingProducts = products.filter(product =>
    (!selectedCategory || product.category === selectedCategory) &&
    (!query || (product.name + ' ' + product.description).toLowerCase().includes(query.toLowerCase()))
  );
  const categoryLinks = categories.map(name => ({
    name,
    url: '/shop?category=' + encodeURIComponent(name),
    selected: name === selectedCategory
  }));
  res.render('shop', {
    state: { shop: true },
    head: { title: 'Shop | CactuShop' },
    products: matchingProducts,
    categories: categoryLinks,
    selectedCategory,
    query
  });
});

app.get('/product/:id', (req, res) => {
  const product = products.find(item => item.id === req.params.id);
  if (!product) return res.status(404).render('404', { head: { title: 'Product not found | CactuShop' } });
  res.render('product', { state: { shop: true }, head: { title: product.name + ' | CactuShop' }, product });
});

app.get('/cart', (req, res) => {
  res.render('cart', { state: { cart: true }, head: { title: 'Your Cart | CactuShop' } });
});

app.get('/contact', (req, res) => {
  res.render('contact', { state: { contact: true }, head: { title: 'Contact | CactuShop' } });
});

app.get('/checkout', (req, res) => {
  res.render('checkout', { state: { cart: true }, head: { title: 'Checkout | CactuShop' } });
});

app.get('/api/products', (req, res) => res.json(products));

app.use((req, res) => {
  res.status(404).render('404', { head: { title: 'Page not found | CactuShop' } });
});

app.listen(PORT, error => {
  if (error) {
    console.error('Server could not start:', error.message);
    process.exit(1);
  }
  console.log('CactuShop running at http://localhost:' + PORT);
});
