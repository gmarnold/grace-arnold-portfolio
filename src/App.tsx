import { useState } from 'react';
import { experience, profile, projects, skills } from './content';
import CaseStudy from './components/CaseStudy';

const navigation = [
  ['Work', 'work'],
  ['Experience', 'experience'],
  ['About', 'about'],
  ['Contact', 'contact'],
] as const;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function SectionHeading({
  number,
  label,
  title,
  children,
}: {
  number: string;
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">
        <span>{number}</span> {label}
      </p>
      <div className="section-heading-line">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function App({ base = import.meta.env.BASE_URL }: { base?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header wrap">
        <a href="#" className="wordmark" aria-label="Grace Arnold, home">
          grace arnold<span aria-hidden="true">✳</span>
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
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero wrap" aria-labelledby="intro-heading">
          <div className="hero-main">
            <p className="eyebrow hero-kicker">
              <span className="status-dot" /> SOFTWARE ENGINEER & CREATIVE THINKER
            </p>
            <h1 id="intro-heading">
              Thoughtful software.
              <br />
              <em>From idea to everyday.</em>
            </h1>
            <p className="hero-description">
              Hi, I’m Grace. I build useful interfaces and the services behind them—and stay with
              the work from the first question to life in production.
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
          <aside className="hero-note" aria-label="At a glance">
            <div className="orbital-mark" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="orbit orbit-three" />
              <span>
                g<span className="orbit-star">✳</span>
              </span>
            </div>
            <p className="note-title">
              Built with care.
              <br />
              Made for people.
            </p>
            <p>
              Full-stack engineering
              <br />
              Production ownership
              <br />A teacher’s perspective
            </p>
          </aside>
          <div className="hero-footer">
            <p>
              <span className="small-dot" /> Open to software engineering roles
            </p>
            <p>Remote · Chicago · St. Louis</p>
            <a href="#work" aria-label="Scroll to selected work">
              SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section className="summary-band" aria-label="Professional summary">
          <div className="wrap summary-inner">
            <p className="eyebrow">THE THROUGH LINE</p>
            <p>
              I connect the details that make software work:{' '}
              <strong>
                a clear interface, a reliable service, and a team that understands both.
              </strong>{' '}
              My experience spans production products, research tooling, and teaching the next
              person how it all fits together.
            </p>
          </div>
        </section>

        <section id="work" className="section wrap" aria-labelledby="work-title">
          <SectionHeading
            number="01"
            label="SELECTED WORK"
            title="Practical problems. Personal craft."
          >
            <p>
              Production experience, creative exploration,
              <br className="desktop-break" /> and the decisions behind the work.
            </p>
          </SectionHeading>
          <div id="work-title" className="sr-only">
            Selected work
          </div>
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
            <div className="production-visual" aria-label="Scope of production ownership">
              <div className="visual-top">
                <span>FROM FIRST QUESTION</span>
                <span aria-hidden="true">↘</span>
              </div>
              <div className="ownership-type">
                Build.
                <br />
                Ship.
                <br />
                <em>Stay with it.</em>
              </div>
              <div className="visual-bottom">
                <p>
                  <strong>1,000+</strong>
                  <span>franchise managers served</span>
                </p>
                <span className="visual-spark" aria-hidden="true">
                  ✳
                </span>
              </div>
              <p className="visual-caption">CALENDAR & CHAT · QSRSoft</p>
            </div>
          </article>
          <article className="project creative-project">
            <figure className="game-figure">
              <a href="https://grachay.itch.io/star-baker" aria-label="Play Star Baker on itch.io">
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
          <div className="portfolio-note">
            <span aria-hidden="true">↳</span>
            <p>
              <strong>This site is part of the work, too.</strong> Built with React, TypeScript, and
              an eye for accessible, responsive design. My professional frontend experience is
              primarily Vue and Angular; this is a place to put React into practice.
            </p>
          </div>
        </section>

        <section
          id="experience"
          className="experience-section section"
          aria-labelledby="experience-title"
        >
          <div className="wrap">
            <SectionHeading number="02" label="EXPERIENCE" title="A foundation in doing the work.">
              <a className="text-link" href={`${base}grace-arnold-resume.pdf`} download>
                Download résumé <span aria-hidden="true">↓</span>
              </a>
            </SectionHeading>
            <div id="experience-title" className="sr-only">
              Professional experience
            </div>
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

        <section id="about" className="section wrap about-section" aria-labelledby="about-title">
          <div>
            <p className="eyebrow">
              <span>03</span> A LITTLE ABOUT ME
            </p>
            <h2 id="about-title">
              Curiosity is a good
              <br />
              <em>place to start.</em>
            </h2>
            <div className="about-flower" aria-hidden="true">
              ✳
            </div>
          </div>
          <div className="about-copy">
            <p className="about-lead">
              I like making complicated things easier to use—and easier to understand.
            </p>
            <p>
              That’s taken me from customer-facing software to research workflows, programming labs,
              and a small game about an astronaut collecting cake. I’m drawn to useful products and
              the care it takes to make them work well.
            </p>
            <p>
              I’m interested in teams working across education, healthcare, research, and creative
              technology, as well as other places where thoughtful engineering can make someone’s
              day better.
            </p>
            <div className="education">
              <p className="eyebrow">EDUCATION & SHARING WHAT I KNOW</p>
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
          </div>
        </section>

        <section id="contact" className="contact-section" aria-labelledby="contact-title">
          <div className="wrap">
            <p className="eyebrow">
              <span>04</span> LET’S CONNECT
            </p>
            <div className="contact-main">
              <div>
                <h2 id="contact-title">
                  Something useful
                  <br />
                  <em>starts with a conversation.</em>
                </h2>
                <p>
                  I’m open to remote software engineering and full-stack roles,
                  <br className="desktop-break" /> with Chicago and St. Louis opportunities welcome,
                  too.
                </p>
              </div>
              <a
                className="contact-arrow"
                href={`mailto:${profile.email}`}
                aria-label="Email Grace Arnold"
              >
                <Arrow />
              </a>
            </div>
            <a className="email-link" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <div className="contact-bottom">
              <span>Say hello. I’d love to hear what you’re building.</span>
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
      </main>
      <footer className="site-footer wrap">
        <a className="wordmark" href="#">
          grace arnold<span aria-hidden="true">✳</span>
        </a>
        <p>Thoughtfully built with React & TypeScript.</p>
        <a href="#">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </>
  );
}
