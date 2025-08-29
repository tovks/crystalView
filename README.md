# Fenestra (Node.js + Express + EJS) — Windows & Doors Company Site

A lightweight marketing site similar to popular window/door brand pages. Includes Home, About, Products with categories, Product detail, Services, Gallery, and Contact (stores submissions to a JSON file).

## Run locally
```bash
npm install
npm run dev    # or: npm start
# Open http://localhost:3000
```

## Customize content
- Edit **data/products.json** and **data/services.json**.
- Update copy in the EJS templates under **views/**.
- Replace placeholder SVGs in **public/images/** with real images.
- Tweak styles in **public/css/style.css**.

## Deploy
- Any Node host works (Render, Railway, Heroku, VPS). Set `PORT` and `BASE_URL` envs if required.
