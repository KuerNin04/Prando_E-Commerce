import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const pages = [
  'index.html',
  'website.html',
  'signup.html',
  'forgotpass.html',
  'dashboard.html',
  'seller-signup.html',
  'seller-dashboard.html',
  'pages/home.html',
  'pages/products.html',
  'pages/categories.html',
  'pages/uniforms.html',
  'pages/merchandise.html',
  'pages/pe-uniforms.html',
  'pages/cart.html',
  'pages/myorders.html',
  'pages/profile.html',
  'pages/settings.html',
  'pages/wishlist.html',
  'pages/logout.html',
  'react-app.html'
];

export default defineConfig({
  plugins: [
    {
      name: 'copy-classic-scripts',
      apply: 'build',
      generateBundle() {
        for (const file of ['forgot.js', 'login.js', 'seller-dashboard.js', 'seller-signup.js', 'signup.js', 'sidebar.js', 'student-store.js']) {
          this.emitFile({
            type: 'asset',
            fileName: file,
            source: readFileSync(resolve(projectRoot, file))
          });
        }
      }
    }
  ],
  build: {
    rollupOptions: {
      input: pages.map(page => resolve(projectRoot, page))
    }
  }
});