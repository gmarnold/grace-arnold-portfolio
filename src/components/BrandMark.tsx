export default function BrandMark({ base }: { base: string }) {
  return (
    <span className="brand-mark" aria-hidden="true">
      <img
        className="brand-light"
        src={`${base}illustrations/skitty-hi-mark.webp`}
        alt=""
        width="32"
        height="32"
      />
      <img
        className="brand-dark"
        src={`${base}illustrations/sleepy-espeon-mark.webp`}
        alt=""
        width="32"
        height="32"
      />
    </span>
  );
}
