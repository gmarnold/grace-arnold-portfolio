import { readFile, writeFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import App from '../src/App';

const base = '/grace-arnold-portfolio/';
let html = await readFile('dist/index.html', 'utf8');
html = html.replace('<!--app-html-->', renderToString(<App base={base} />));
// Set to my approved publication address.
const siteUrl = process.env.SITE_URL;
if (siteUrl) {
  const url = new URL(siteUrl);
  if (url.protocol !== 'https:') throw new Error('SITE_URL must use HTTPS');
  const canonical = url.href.endsWith('/') ? url.href : `${url.href}/`;
  const escaped = canonical
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;');
  html = html.replace(
    '<!-- deployment-metadata -->',
    `<link rel="canonical" href="${escaped}" /><meta property="og:url" content="${escaped}" /><meta property="og:image" content="${escaped}images/social.png" /><meta property="og:image:alt" content="Grace Arnold — Thoughtful software. From idea to everyday." />`,
  );
}
await writeFile('dist/index.html', html);
await writeFile(
  'dist/404.html',
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — Grace Arnold</title><body style="font:18px system-ui;padding:10%;background:#f7f6f2;color:#302d35"><h1>That page isn’t here.</h1><p><a href="${base}">Return to my portfolio</a></p></body></html>`,
);
await writeFile('dist/.nojekyll', '');
console.log('Prerendered homepage and static fallback.');
