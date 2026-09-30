import { useId, useState, type KeyboardEvent } from 'react';
import { profile } from '../content';
import { chooseTheme } from '../features/theme';
import Illustration from './Illustration';

interface Command {
  id: string;
  label: string;
  keywords?: string;
  href?: string;
  download?: boolean;
  action?: () => void;
}

export default function CommandPalette({
  base,
  onClose,
  onSky,
}: {
  base: string;
  onClose: () => void;
  onSky: () => void;
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const id = useId();
  const commands: Command[] = [
    ...[
      ['work', 'Selected work'],
      ['experience', 'Experience'],
      ['about', 'About Grace'],
      ['contact', 'Contact Grace'],
      ['engineering', 'Engineering this site'],
    ].map(([section, label]) => ({ id: section, label, href: `#${section}` })),
    {
      id: 'resume',
      label: 'Download résumé',
      keywords: 'resume cv pdf',
      href: `${base}grace-arnold-resume.pdf`,
      download: true,
    },
    { id: 'github', label: 'View GitHub', href: profile.github },
    { id: 'linkedin', label: 'View LinkedIn', href: profile.linkedin },
    ...(['system', 'light', 'dark'] as const).map((theme) => ({
      id: theme,
      label: `Theme: ${theme[0].toUpperCase()}${theme.slice(1)}`,
      keywords: 'appearance color',
      action: () => chooseTheme(theme),
    })),
    {
      id: 'sky',
      label: 'Tonight’s sky',
      keywords: 'weather astronomy moon chicago',
      action: onSky,
    },
  ];
  const matches = commands.filter((command) =>
    `${command.label} ${command.keywords ?? ''}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );
  const index = Math.min(active, Math.max(0, matches.length - 1));
  function run(command: Command) {
    if (command.id === 'sky') {
      onSky();
      return;
    }
    onClose();
    if (command.action) command.action();
    if (command.href?.startsWith('#')) {
      const target = document.getElementById(command.href.slice(1));
      if (command.id === 'engineering') target?.querySelector('details')?.setAttribute('open', '');
      requestAnimationFrame(() => {
        location.hash = command.href!;
        target?.setAttribute('tabindex', '-1');
        target?.focus({ preventScroll: true });
        target?.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
      });
    } else if (command.href) {
      const anchor = document.createElement('a');
      anchor.href = command.href;
      if (command.download) anchor.download = '';
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
    }
  }
  function keyboard(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (matches.length) {
        const next =
          (index + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length;
        setActive(next);
        document.getElementById(`${id}-${matches[next].id}`)?.scrollIntoView({ block: 'nearest' });
      }
    } else if (event.key === 'Enter' && matches[index]) {
      event.preventDefault();
      run(matches[index]);
    }
  }
  return (
    <div className="command-palette">
      <label className="sr-only" htmlFor={`${id}-search`}>
        Search commands
      </label>
      <input
        id={`${id}-search`}
        data-initial-focus
        type="search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded="true"
        aria-controls={`${id}-list`}
        aria-activedescendant={matches[index] ? `${id}-${matches[index].id}` : undefined}
        placeholder="Go somewhere, change the light…"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
        }}
        onKeyDown={keyboard}
      />
      <ul id={`${id}-list`} role="listbox" aria-label="Commands">
        {matches.map((command, i) => (
          <li
            id={`${id}-${command.id}`}
            role="option"
            aria-selected={i === index}
            key={command.id}
            onPointerMove={() => setActive(i)}
            onClick={() => run(command)}
          >
            {command.label}
            <span aria-hidden="true">
              {command.download ? '↓' : command.href?.startsWith('https:') ? '↗' : '↵'}
            </span>
          </li>
        ))}
      </ul>
      {!matches.length && (
        <p className="empty-commands" role="status">
          No matching commands. Try “work”, “theme”, or “sky”.
        </p>
      )}
      <div className="palette-footer">
        <p>↑ ↓ to move · Enter to choose · Esc to close</p>
        <Illustration name="calyrex-gamer" base={base} size={54} />
      </div>
    </div>
  );
}
