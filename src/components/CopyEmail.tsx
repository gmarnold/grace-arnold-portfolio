import { useEffect, useRef, useState } from 'react';
import { profile } from '../content';
import { useInteractive } from '../features/theme';
import Illustration from './Illustration';

export default function CopyEmail({ base }: { base: string }) {
  const ready = useInteractive();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(profile.email);
      setStatus('success');
    } catch {
      setStatus('error');
    }
    timer.current = setTimeout(() => setStatus('idle'), 4500);
  }
  return (
    <div className="copy-email" hidden={!ready}>
      <button className="quiet-button" type="button" onClick={copy}>
        Copy email
      </button>
      <span role="status">
        {status === 'success'
          ? 'Email copied.'
          : status === 'error'
            ? 'Could not copy. Select the email address above instead.'
            : ''}
      </span>
      {status === 'success' && <Illustration name="toggers" base={base} size={36} />}
    </div>
  );
}
