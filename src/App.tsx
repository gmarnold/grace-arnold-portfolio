import { useState } from 'react';
import { experience, profile, projects, skills } from './content';
import CaseStudy from './components/CaseStudy';
import SiteTools from './components/SiteTools';
import Engineering from './components/Engineering';
import CopyEmail from './components/CopyEmail';
import Illustration from './components/Illustration';
import BrandMark from './components/BrandMark';
import SkyEntry from './components/SkyEntry';
import { AtmosphereProvider } from './features/AtmosphereProvider';
import HeroAtmosphere, { WeatherStatus } from './components/HeroAtmosphere';

const navigation = [
  ['Work', 'work'],
  ['Experience', 'experience'],
  ['Education', 'about'],
  ['Contact', 'contact'],
] as const;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function SectionHeading({
  id,
  title,
  mascot,
  base,
  children,
}: {
  id: string;
  title: string;
  mascot: React.ComponentProps<typeof Illustration>['name'];
  base: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div className="section-heading-line">
        <div className="section-identity">
          <Illustration name={mascot} base={base} size={64} />
          <h2 id={id}>{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function App({ base = import.meta.env.BASE_URL }: { base?: string }) {
  return (
    <AtmosphereProvider>
      <Portfolio base={base} />
    </AtmosphereProvider>
  );
}

function Portfolio({ base }: { base: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header wrap">
        <a href="#" className="wordmark" aria-label="Grace Arnold, home">
          grace arnold
          <BrandMark base={base} />
        </a>
        <button
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? 'Close' : 'Menu'} <span aria-hidden="true">{menuOpen ? '−' : '+'}</span>
        </button>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={menuOpen ? 'navigation is-open' : 'navigation'}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setMenuOpen(false);
              document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus();
            }
          }}
        >
          {navigation.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a className="nav-resume" href={`${base}grace-arnold-resume.pdf`} download>
            Résumé <span aria-hidden="true">↓</span>
          </a>
        </nav>
        <SiteTools base={base} />
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero wrap" aria-labelledby="intro-heading">
          <HeroAtmosphere />
          <div className="hero-main">
            <p className="hero-kicker">Full-Stack Software Engineer</p>
            <h1 id="intro-heading">
              You had me at
              <br />
              <em className="hero-code">
                {'> '}
                <span className="hero-typed">Hello World.</span>
              </em>
            </h1>
            <p className="hero-description">
              Hi, I’m Grace. Ten years ago, I fell in love with coding; now I build useful
              interfaces and the services behind them. What keeps me hooked is the whole path from
              figuring out what should exist to making sure it works once people depend on it.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#work">
                Explore my work <span aria-hidden="true">↓</span>
              </a>
              <a className="text-link" href={`mailto:${profile.email}`}>
                Let’s talk <Arrow />
              </a>
            </div>
          </div>
          <WeatherStatus />
          <div className="hero-footer">
            <p>
              <span className="small-dot" /> Open to software engineering roles
            </p>
            <p>Remote · Chicago · St. Louis</p>
            <a href="#work" aria-label="Scroll to selected work">
              Do you want the house tour? <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section id="work" className="work-section section" aria-labelledby="work-title">
          <div className="wrap">
            <SectionHeading
              id="work-title"
              title="Selected Work"
              mascot="calyrex-gamer"
              base={base}
            />
            <article className="project production-project">
              <div className="project-copy">
                <p className="eyebrow">{projects[0].category}</p>
                <h3>{projects[0].title}</h3>
                <p className="project-summary">{projects[0].summary}</p>
                <ul className="tags" aria-label="Technologies">
                  {projects[0].stack.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <CaseStudy project={projects[0]} />
              </div>
              <aside className="ownership-note" aria-label="Scope of production ownership">
                <h4>Calendar &amp; Chat at QSRSoft</h4>
                <dl>
                  <div>
                    <dt>People served</dt>
                    <dd>1,000+ franchise managers</dd>
                  </div>
                  <div>
                    <dt>Delivery</dt>
                    <dd>Requirements, technical design, implementation, and rollout</dd>
                  </div>
                  <div>
                    <dt>In production</dt>
                    <dd>Support, investigation, and continued improvement</dd>
                  </div>
                </dl>
              </aside>
            </article>
            <article className="project creative-project">
              <figure className="game-figure">
                <a
                  href="https://grachay.itch.io/star-baker"
                  aria-label="Play Star Baker on itch.io"
                >
                  <img
                    src={`${base}images/star-baker.webp`}
                    width="1200"
                    height="717"
                    loading="lazy"
                    alt="Star Baker gameplay screenshot: an astronaut collecting baked goods among asteroids in space"
                  />
                  <span className="play-label">
                    Play Star Baker <Arrow />
                  </span>
                </a>
                <figcaption>
                  Star Baker · Gameplay screenshot from the published itch.io page
                </figcaption>
              </figure>
              <div className="project-copy">
                <p className="eyebrow">{projects[1].category}</p>
                <h3>{projects[1].title}</h3>
                <p className="project-summary">{projects[1].summary}</p>
                <ul className="tags" aria-label="Technologies">
                  {projects[1].stack.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <CaseStudy project={projects[1]} />
              </div>
            </article>
            <article className="research-project">
              <div className="research-number" aria-hidden="true">
                17<span>GB / DAY</span>
              </div>
              <div className="project-copy">
                <p className="eyebrow">{projects[2].category}</p>
                <h3>{projects[2].title}</h3>
                <p className="project-summary">{projects[2].summary}</p>
                <ul className="tags" aria-label="Technologies">
                  {projects[2].stack.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <CaseStudy project={projects[2]} />
              </div>
            </article>
            <Engineering base={base} />
          </div>
        </section>

        <section
          id="experience"
          className="experience-section section"
          aria-labelledby="experience-title"
        >
          <div className="wrap">
            <SectionHeading
              id="experience-title"
              title="Experience"
              mascot="eldegirlboss"
              base={base}
            >
              <a className="text-link" href={`${base}grace-arnold-resume.pdf`} download>
                Download résumé <span aria-hidden="true">↓</span>
              </a>
            </SectionHeading>
            <div className="experience-list">
              {experience.map((job, index) => (
                <article className="experience-row" key={job.company}>
                  <div className="experience-time">
                    <span className={index === 0 ? 'timeline-dot latest' : 'timeline-dot'} />
                    <p>{job.dates}</p>
                    <span>{job.location}</span>
                  </div>
                  <div>
                    <h3>{job.company}</h3>
                    <p className="job-role">{job.role}</p>
                    <p className="job-description">{job.description}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="skills-grid">
              {skills.map((skill) => (
                <div key={skill.title}>
                  <h3>{skill.title}</h3>
                  <p>{skill.tools}</p>
                  <p className="skill-context">{skill.context}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="section wrap education-section"
          aria-labelledby="education-title"
        >
          <SectionHeading
            id="education-title"
            title="Education"
            mascot="muscle-milcery"
            base={base}
          />
          <div className="education-layout">
            <div className="education">
              <h3>M.S. & B.S. in Computer Science</h3>
              <p>Illinois Institute of Technology · May 2022</p>
              <ul>
                <li>
                  Teaching Assistant, 2019–2022: led Computer Organization/MIPS and Data Structures
                  labs serving 80+ students.
                </li>
                <li>
                  Founder and President, Google Developer Student Clubs: taught Google Cloud and
                  Android development.
                </li>
                <li>Mentored three software engineering interns at QSRSoft.</li>
              </ul>
            </div>
            <div className="about-copy">
              <p className="about-lead">
                I like making complicated things easier to use and easier to understand.
              </p>
              <p>
                That’s taken me from customer-facing software to research workflows, programming
                labs, and a small game about an astronaut collecting cake.
              </p>
              <p>
                I’m drawn to useful products and the care it takes to make them work well.
                Education, healthcare, research, and creative technology especially interest me
                because good tools can make complicated work clearer and easier to do.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section" aria-labelledby="contact-title">
          <div className="wrap">
            <div className="contact-layout">
              <SectionHeading id="contact-title" title="Let’s Connect" mascot="toggers" base={base}>
                <a
                  className="contact-arrow"
                  href={`mailto:${profile.email}`}
                  aria-label="Email Grace Arnold"
                >
                  <Arrow />
                </a>
              </SectionHeading>
              <div className="contact-copy">
                <div className="contact-main">
                  <div>
                    <p>
                      I’m open to remote software engineering and full-stack roles,
                      <br className="desktop-break" /> with Chicago and St. Louis opportunities
                      welcome, too.
                    </p>
                  </div>
                </div>
                <a className="email-link" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
                <CopyEmail base={base} />
              </div>
              <div className="contact-art-group">
                <img
                  className="contact-art"
                  src={`${base}images/togetic-mail.webp`}
                  width="256"
                  height="256"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <div className="contact-bottom">
              <span className="contact-signature">
                <BrandMark base={base} />
                Say hello. I’d love to hear what you’re building.
              </span>
              <div>
                <a href={profile.github}>
                  GitHub <Arrow />
                </a>
                <a href={profile.linkedin}>
                  LinkedIn <Arrow />
                </a>
              </div>
            </div>
          </div>
        </section>
        <div className="wrap">
          <SkyEntry />
        </div>
      </main>
      <footer className="site-footer wrap">
        <a className="wordmark" href="#">
          grace arnold
          <BrandMark base={base} />
        </a>
        <p>Built & illustrated by me.</p>
        <a href="#">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </>
  );
}
