export const profile = {
  name: 'Grace Arnold',
  email: 'grace.m.arnold@outlook.com',
  github: 'https://github.com/gmarnold',
  linkedin: 'https://www.linkedin.com/in/grace-m-arnold/',
};

export interface CaseStudy {
  id: string;
  number: string;
  category: string;
  title: string;
  summary: string;
  stack: string[];
  role: string;
  sections: { heading: string; text: string }[];
  links?: { label: string; href: string }[];
}

export const projects: CaseStudy[] = [
  {
    id: 'production',
    number: '01',
    category: 'PRODUCTION ENGINEERING · QSRSoft',
    title: 'Everyday tools. End-to-end ownership.',
    summary:
      'Calendar and Chat features that helped 1,000+ franchise managers coordinate their work. I owned delivery from requirements through rollout and production support.',
    stack: ['TypeScript', 'Vue.js', 'Node.js', 'AWS'],
    role: 'Feature owner within a cross-functional product team · 2023–2026',
    sections: [
      {
        heading: 'The work',
        text: 'Franchise managers needed customer-facing tools for scheduling and communication. At QSRSoft, I owned Calendar and Chat from requirements and technical design through implementation, rollout, support, and improvement.',
      },
      {
        heading: 'My contribution',
        text: 'I built frontend features, backend microservices, and GraphQL/HTTP APIs with TypeScript and JavaScript, Vue.js, Node.js, Express, PostgreSQL, DynamoDB, and AWS. I worked with product managers, designers, QA, and support to translate customer workflows into maintainable solutions.',
      },
      {
        heading: 'Engineering practice',
        text: 'My work included Jest/Vitest unit tests, Postman API testing, UAT and release validation, code review, and technical documentation. For production issues, I used PagerDuty, CloudWatch, Datadog, logs, and API tooling to investigate behavior across the stack.',
      },
      {
        heading: 'Outcome & scope',
        text: 'The features served 1,000+ franchise managers. My responsibility extended beyond shipping to supporting and improving them in production. This account uses public-safe career facts; employer code and product screenshots are not public portfolio assets.',
      },
    ],
  },
  {
    id: 'star-baker',
    number: '02',
    category: 'CREATIVE DEVELOPMENT · SOLO PROJECT',
    title: 'A little space. A lot of cake.',
    summary:
      'Star Baker is a playable action side-scroller: collect baked goods, dodge asteroids, and use stardust to fight back. A solo game built while learning Unity.',
    stack: ['Unity', 'C#', 'WebGL'],
    role: 'Sole developer · Art assets from the Unity Asset Store',
    sections: [
      {
        heading: 'The idea',
        text: 'I created Star Baker as an original game alongside Unity’s Create with Code course. The astronaut moves with the arrow keys, collects baked goods for points, avoids asteroids, and uses a temporary stardust power-up to destroy them.',
      },
      {
        heading: 'My contribution',
        text: 'I was the sole developer, implementing gameplay in Unity and C# and publishing a browser-playable build on itch.io. The visual assets came from the Unity Asset Store; the development work was mine.',
      },
      {
        heading: 'Decisions & debugging',
        text: 'For tumbling obstacles, I switched from my initial transform-based rotation approach to physics torque to achieve the intended motion. I also changed an animation transition’s exit-time setting so the collision reaction could start promptly instead of waiting for the running animation to finish.',
      },
      {
        heading: 'What I learned',
        text: 'Overlapping stardust pickups exposed a coroutine timing bug: the first timer could end the next power-up early. Restarting the coroutine improved the behavior, but the repository documents that the fix is incomplete. It is a useful example of why timing and repeated interactions need explicit testing.',
      },
    ],
    links: [
      { label: 'Play Star Baker', href: 'https://grachay.itch.io/star-baker' },
      {
        label: 'Read the source',
        href: 'https://github.com/gmarnold/Unity-Create-with-Code/tree/main/Star%20Baker',
      },
      {
        label: 'Watch gameplay',
        href: 'https://user-images.githubusercontent.com/50962446/232926442-03b4d9b5-d7b7-4594-8013-80ce042cbcd1.mp4',
      },
    ],
  },
  {
    id: 'research',
    number: '03',
    category: 'RESEARCH ENGINEERING · ILLINOIS TECH',
    title: 'Making research data more useful.',
    summary:
      'Python processing, analytics, and visualization workflows handling 17 GB of research data per day across multi-year datasets.',
    stack: ['Python', 'NumPy', 'Pandas'],
    role: 'Wireless Networking & Communication Research Assistant · 2019–2021',
    sections: [
      {
        heading: 'The problem',
        text: 'The wireless networking and communication research team worked with multi-year datasets and workflows handling 17 GB of data each day. Processing and understanding that data was central to the research work.',
      },
      {
        heading: 'My contribution',
        text: 'I redesigned and optimized Python data-processing, analytics, and visualization workflows using NumPy and Pandas. I also led Python, NumPy, and Pandas meetings and workshops for the 14-member research team.',
      },
      {
        heading: 'Outcome & scope',
        text: 'The work combined data tooling with teaching colleagues how to use the tools. The daily data volume describes the workload, not a claimed performance improvement; no benchmark or speedup is asserted.',
      },
    ],
  },
];

export const experience = [
  {
    company: 'QSRSoft',
    role: 'Full-Stack Software Engineer',
    dates: 'Jun 2023 — Sep 2026',
    location: 'Remote',
    description:
      'Owned Calendar and Chat features for 1,000+ franchise managers, from requirements through production support. Built full-stack applications and APIs, validated releases, and mentored three engineering interns.',
  },
  {
    company: 'Zoom Video Communications',
    role: 'Full-Stack Software Development Engineer',
    dates: 'Jul 2022 — Feb 2023',
    location: 'Remote',
    description:
      'Developed and tested Android features and backend integrations with Java, C++, PostgreSQL, and Linux/Unix. Collaborated with international engineers, designers, and QA; worked with Jenkins and GitLab CI/CD.',
  },
  {
    company: 'BlackRock',
    role: 'Full-Stack Software Engineering Intern',
    dates: 'Jun — Aug 2021',
    location: 'Remote',
    description:
      'Led an intern team building an end-to-end application with Angular, TypeScript, Java, and REST APIs to aggregate and present thousands of operational exceptions.',
  },
  {
    company: 'Illinois Institute of Technology',
    role: 'Wireless Networking & Communication Research Assistant',
    dates: 'May 2019 — May 2021',
    location: 'Chicago, IL',
    description:
      'Redesigned Python processing, analytics, and visualization workflows handling 17 GB of research data per day. Led Python, NumPy, and Pandas workshops for a 14-member research team.',
  },
  {
    company: 'GE Healthcare',
    role: 'Technical Product Manager & Tableau Visualizations Engineer',
    dates: 'Jul — Aug 2020',
    location: 'Remote',
    description:
      'Built 10 KPI dashboard visualizations for the HR Digital Technology Data & Analytics team, working with stakeholders to validate data, clarify requirements, and improve usability.',
  },
] as const;

export const skills = [
  {
    title: 'Interfaces',
    tools: 'TypeScript / JavaScript, Vue.js, Angular',
    context: 'Professional frontend development; React and TypeScript in this portfolio.',
  },
  {
    title: 'Services & data',
    tools: 'Node.js, Express, GraphQL, HTTP / REST, PostgreSQL, DynamoDB',
    context: 'Full-stack product work; Python, NumPy, and Pandas in research.',
  },
  {
    title: 'Delivery & reliability',
    tools: 'AWS Lambda, AppSync, S3, CodePipeline, CloudWatch, GitHub Actions',
    context: 'Jest / Vitest, Postman, UAT, Datadog, and PagerDuty for testing and support.',
  },
] as const;
