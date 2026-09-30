import { mkdir, writeFile } from 'node:fs/promises';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import sharp from 'sharp';
import { experience, profile } from '../src/content';

await mkdir('public', { recursive: true });
const pdf = await PDFDocument.create();
pdf.setTitle('Grace Arnold — Software Engineer');
pdf.setAuthor(profile.name);
pdf.setSubject('General software engineering resume');
const page = pdf.addPage([612, 792]);
const regular = await pdf.embedFont(StandardFonts.Helvetica);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
const ink = rgb(0.19, 0.18, 0.21);
const purple = rgb(0.4, 0.31, 0.48);
let y = 752;

function text(value: string, size = 10, strong = false, color = ink, gap = 3) {
  const font = strong ? bold : regular;
  const words = value.split(/\s+/);
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > 528 && line) {
      page.drawText(line, { x: 42, y, size, font, color });
      y -= size + gap;
      line = word;
    } else line = candidate;
  }
  if (line) {
    page.drawText(line, { x: 42, y, size, font, color });
    y -= size + gap;
  }
}
function heading(value: string) {
  y -= 8;
  text(value.toUpperCase(), 9, true, purple, 5);
  page.drawLine({
    start: { x: 42, y: y + 2 },
    end: { x: 570, y: y + 2 },
    color: rgb(0.83, 0.8, 0.86),
    thickness: 0.5,
  });
  y -= 8;
}

text(profile.name, 25, true, ink, 5);
text('SOFTWARE ENGINEER  |  Full-stack development', 10, false, purple, 5);
text(
  `${profile.email}  |  github.com/gmarnold  |  linkedin.com/in/grace-m-arnold`,
  8,
  false,
  ink,
  4,
);
text('Open to remote roles and opportunities in Chicago and St. Louis.', 8);
heading('Profile');
text(
  'Software engineer with full-stack production ownership, experience building customer-facing features and APIs, and a background in research and teaching. Professional frontend work in Vue and Angular; current React work through a personal portfolio.',
);
heading('Technical skills');
text(
  'TypeScript / JavaScript, Vue.js, Angular, Node.js, Express, GraphQL / REST, PostgreSQL, DynamoDB; AWS Lambda, AppSync, S3, CodePipeline, CloudWatch; GitHub Actions; Jest / Vitest, Postman; Python, NumPy, Pandas; Java, C++.',
);
heading('Experience');
const descriptions = [
  'Owned Calendar and Chat for 1,000+ franchise managers, from requirements and technical design to rollout and production support. Built full-stack applications and APIs with TypeScript, Vue, Node.js, PostgreSQL, DynamoDB, and AWS. Wrote tests, validated releases, investigated production issues, and mentored three interns.',
  'Developed and tested Android features and backend integrations using Java, C++, PostgreSQL, and Linux/Unix. Collaborated with distributed engineers, designers, and QA; worked with Jenkins and GitLab CI/CD.',
  'Led an intern team building an Angular, TypeScript, Java, and REST API application that aggregated and presented thousands of operational exceptions.',
  'Redesigned and optimized Python analytics and visualization workflows handling 17 GB of research data per day. Led Python, NumPy, and Pandas workshops for a 14-member team.',
  'Built 10 KPI dashboard visualizations. Worked with stakeholders to validate data, clarify requirements, and improve usability for the HR Digital Technology Data & Analytics team.',
];
experience.forEach((job, index) => {
  text(`${job.company}  |  ${job.dates}`, 9, true);
  text(`${job.role}  |  ${job.location}`, 8, false, purple);
  text(descriptions[index], 9.5, false, ink, 3);
  y -= 5;
});
heading('Education & mentorship');
text('Illinois Institute of Technology — M.S. & B.S. in Computer Science, May 2022', 9, true);
text(
  'Teaching Assistant, Jan 2019–May 2022: led Computer Organization/MIPS and Data Structures labs serving 80+ students. Founder and President of Google Developer Student Clubs; taught Google Cloud and Android development.',
  9.5,
);
heading('Selected creative project');
text('Star Baker — Sole developer | Unity, C#, WebGL | grachay.itch.io/star-baker', 9, true);
text(
  'Built and published an action side-scroller with obstacle spawning, scoring, power-ups, and collision feedback. Documented debugging decisions and remaining limitations. Art assets from the Unity Asset Store.',
  9.5,
);
if (y < 30) throw new Error(`Resume exceeds one page: baseline ${y}`);
await writeFile('public/grace-arnold-resume.pdf', await pdf.save());

const card = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#f7f6f2"/><rect x="890" width="310" height="630" fill="#e5def1"/><text x="75" y="105" font-family="Arial" font-size="26" fill="#302d35">GRACE ARNOLD / SOFTWARE ENGINEER</text><text x="70" y="280" font-family="Georgia" font-size="75" fill="#302d35">Thoughtful software.</text><text x="70" y="375" font-family="Georgia" font-style="italic" font-size="68" fill="#78638a">From idea to everyday.</text><path d="M75 445H820" stroke="#c9bdd5"/><text x="75" y="510" font-family="Arial" font-size="24" fill="#625b67">Full-stack development · Production ownership · Creative craft</text></svg>`;
await sharp(Buffer.from(card)).png().toFile('public/images/social.png');
console.log(`Generated one-page resume (last baseline: ${Math.round(y)}pt) and social image.`);
