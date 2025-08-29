  const path = require('path');
  const fs = require('fs');
  const express = require('express');
  const helmet = require('helmet');
  const compression = require('compression');
  const app = express();
  const PORT = process.env.PORT || 3005;

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(compression());

  const products = require('./data/products.json');
  const services = require('./data/services.json');

  // Routes
  app.get('/', (req, res) => res.render('index', { products, services, title: 'Home' }));
  app.get('/about', (req, res) => res.render('about', { title: 'About' }));
  app.get('/products', (req, res) => res.render('products', { products, title: 'Products' }));
  app.get('/products/:slug', (req, res) => {
    const item = products.items.find(p => p.slug === req.params.slug);
    if (!item) return res.status(404).render('404', { title: 'Not Found' });
    res.render('product-detail', { item, products, title: item.title });
  });
  app.get('/services', (req, res) => res.render('services', { services, title: 'Services' }));
  app.get('/gallery', (req, res) => res.render('gallery', { title: 'Gallery' }));
  app.get('/contact', (req, res) => res.render('contact', { sent: false, title: 'Contact' }));
  app.post('/contact', (req, res) => {
    const payload = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      city: req.body.city,
      message: req.body.message,
      created_at: new Date().toISOString()
    };
    const fp = path.join(__dirname, 'data', 'contacts.json');
    let arr = [];
    try {
      if (fs.existsSync(fp)) arr = JSON.parse(fs.readFileSync(fp, 'utf8'));
    } catch (e) { arr = []; }
    arr.push(payload);
    fs.writeFileSync(fp, JSON.stringify(arr, null, 2));
    res.render('contact', { sent: true, title: 'Contact' });
  });

  // SEO helpers
  app.get('/sitemap.xml', (req, res) => {
    const base = process.env.BASE_URL || 'http://localhost:' + PORT;
    const urls = ['/', '/about', '/products', '/services', '/gallery', '/contact']
      .concat(require('./data/products.json').items.map(p => '/products/' + p.slug));
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url><loc>${base}${u}</loc></url>`).join('\n')}
</urlset>`;
    res.set('Content-Type', 'application/xml').send(body);
  });

  // 404
  app.use((req, res) => res.status(404).render('404', { title: 'Not Found' }));

  app.listen(PORT, () => console.log(`🚀 Site running at http://localhost:${PORT}`));
