import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

await mkdir('public/images', { recursive: true });
// The supplied resume in public is published as-is, never regenerated at build time.

const card = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#f7f6f2"/><rect x="890" width="310" height="630" fill="#e5def1"/><text x="75" y="105" font-family="Arial" font-size="26" fill="#302d35">GRACE ARNOLD / SOFTWARE ENGINEER</text><text x="70" y="280" font-family="Georgia" font-size="75" fill="#302d35">Thoughtful software.</text><text x="70" y="375" font-family="Georgia" font-style="italic" font-size="68" fill="#78638a">From idea to everyday.</text><path d="M75 445H820" stroke="#c9bdd5"/><text x="75" y="510" font-family="Arial" font-size="24" fill="#625b67">Full-stack development · Production ownership · Creative craft</text></svg>`;
await sharp(Buffer.from(card)).png().toFile('public/images/social.png');
console.log('Generated social image; the supplied resume is kept unchanged.');
