import { illustrations } from '../illustrations';

export default function Illustration({
  name,
  base,
  size = 64,
}: {
  name: keyof typeof illustrations;
  base: string;
  size?: number;
}) {
  const path = illustrations[name];
  return path ? (
    <img
      className={`illustration illustration-${name}`}
      src={`${base}${path}`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
    />
  ) : null;
}
