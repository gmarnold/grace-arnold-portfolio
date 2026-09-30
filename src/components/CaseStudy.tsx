import type { CaseStudy as CaseStudyContent } from '../content';

export default function CaseStudy({ project }: { project: CaseStudyContent }) {
  return (
    <details className="case-study">
      <summary>
        <span>
          Explore the work
          <span className="sr-only">
            : {project.id === 'star-baker' ? 'Star Baker' : project.title}
          </span>
        </span>
        <span className="expand-icon" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="case-body">
        <p className="case-role">{project.role}</p>
        {project.sections.map((section) => (
          <div key={section.heading}>
            <h4>{section.heading}</h4>
            <p>{section.text}</p>
          </div>
        ))}
        {project.links && (
          <ul className="project-links">
            {project.links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
}
