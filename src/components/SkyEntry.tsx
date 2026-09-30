import { useInteractive } from '../features/theme';

export default function SkyEntry() {
  const ready = useInteractive();
  return (
    <div className="sky-entry" hidden={!ready}>
      <p>
        <span aria-hidden="true">☾</span> A little curiosity after the work.
      </p>
      <button
        className="text-link"
        type="button"
        aria-haspopup="dialog"
        onClick={() => window.dispatchEvent(new Event('portfolio:sky'))}
      >
        Tonight’s sky <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
