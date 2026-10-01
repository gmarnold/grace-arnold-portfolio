import Illustration from './Illustration';

export default function Engineering({ base }: { base: string }) {
  return (
    <section className="engineering-note" id="engineering" aria-labelledby="engineering-title">
      <div className="engineering-intro">
        <span aria-hidden="true">↳</span>
        <div>
          <h3 id="engineering-title">This site is part of the work, too.</h3>
          <p>
            A small product, built with the same care I bring to production software. React is my
            current practice here; my professional frontend background is primarily Vue and Angular.
          </p>
        </div>
      </div>
      <details className="engineering-details">
        <summary>
          Engineering this site <span aria-hidden="true">+</span>
        </summary>
        <div className="engineering-content">
          <div className="engineering-lead">
            <p>Readable first. Interactive when useful.</p>
            <Illustration name="muscle-milcery" base={base} size={56} />
          </div>
          <p>
            Typed content keeps experience and project details consistent. React renders the page to
            HTML at build time, then adds interaction in the browser. The core portfolio and case
            studies remain readable with JavaScript disabled.
          </p>
          <ol className="architecture-flow" aria-label="Build and release process">
            <li>Typed content</li>
            <li>React + TypeScript</li>
            <li>Checks + unit tests</li>
            <li>Vite build + prerender</li>
            <li>Browser + accessibility tests</li>
            <li>GitHub Pages</li>
          </ol>
          <div className="engineering-columns">
            <div>
              <h4>A deliberate foundation</h4>
              <p>
                Strict TypeScript, React, Vite, and Tailwind theme tokens. Native links,
                disclosures, and dialogs keep navigation familiar. Self-hosted fonts and optimized
                artwork avoid third-party font requests.
              </p>
            </div>
            <div>
              <h4>Tested where it matters</h4>
              <p>
                Vitest covers behavior and failure paths. Playwright exercises mobile and desktop
                navigation, keyboard focus, reduced motion, downloads, and JavaScript-disabled
                content. axe checks complement visual review.
              </p>
            </div>
          </div>
          <p>
            GitHub Actions verifies changes. A separate release workflow reruns checks before
            publishing. I load the Chicago atmosphere progressively, so an external service cannot
            hold up the portfolio.
          </p>
          <a className="text-link" href="https://github.com/gmarnold/grace-arnold-portfolio">
            Explore the repository <span aria-hidden="true">↗</span>
          </a>
        </div>
      </details>
    </section>
  );
}
