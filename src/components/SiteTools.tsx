import { Component, Suspense, lazy, useCallback, useEffect, useState, type ReactNode } from 'react';
import { useInteractive, useTheme, type Theme } from '../features/theme';
import Modal from './Modal';
import CommandPalette from './CommandPalette';
import Illustration from './Illustration';

const SkyExperience = lazy(() => import('../features/SkyExperience'));

class SkyBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p className="feature-message" role="status">
        The sky feature couldn’t load. The rest of the portfolio is still available. Close this
        panel to keep exploring, or reload the page to retry.
      </p>
    ) : (
      this.props.children
    );
  }
}

export default function SiteTools({ base }: { base: string }) {
  const ready = useInteractive();
  const { theme, resolved, chooseTheme } = useTheme();
  const [panel, setPanel] = useState<'commands' | 'sky' | null>(null);
  const close = useCallback(() => setPanel(null), []);
  useEffect(() => {
    const sky = () => setPanel('sky');
    const keyboard = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k' &&
        !event.altKey &&
        !event.isComposing
      ) {
        event.preventDefault();
        setPanel((current) => (current === 'commands' ? null : 'commands'));
      }
    };
    window.addEventListener('keydown', keyboard);
    window.addEventListener('portfolio:sky', sky);
    return () => {
      window.removeEventListener('keydown', keyboard);
      window.removeEventListener('portfolio:sky', sky);
    };
  }, []);
  return (
    <div className="site-tools" hidden={!ready}>
      <label className="theme-control">
        <span>Theme</span>
        <select
          aria-label="Color theme"
          value={theme}
          onChange={(event) => chooseTheme(event.target.value as Theme)}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <button
        className="quick-links-button"
        onClick={() => setPanel('commands')}
        type="button"
        aria-haspopup="dialog"
      >
        Quick links <kbd aria-hidden="true">⌘ K</kbd>
      </button>
      {panel && (
        <Modal title={panel === 'commands' ? 'Quick links' : 'Tonight’s sky'} onClose={close}>
          {panel === 'commands' ? (
            <>
              <CommandPalette base={base} onClose={close} onSky={() => setPanel('sky')} />
              {resolved === 'dark' && (
                <div className="night-note">
                  <Illustration name="sleepy-espeon" base={base} size={40} />
                  <span>A quieter light for a little exploring.</span>
                </div>
              )}
            </>
          ) : (
            <SkyBoundary>
              <Suspense
                fallback={
                  <p className="feature-message" role="status">
                    Looking up at the sky…
                  </p>
                }
              >
                <SkyExperience base={base} />
              </Suspense>
            </SkyBoundary>
          )}
        </Modal>
      )}
    </div>
  );
}
