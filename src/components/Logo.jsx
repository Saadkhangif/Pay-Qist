import { Link } from 'react-router-dom';
import logoUrl from '../assets/logo.png';

const sizes = {
  sm: 'h-10',
  md: 'h-12',
  lg: 'h-14',
  xl: 'h-16',
};

export default function Logo({ to = '/home', size = 'md', className = '' }) {
  const image = (
    <img
      src={logoUrl}
      alt="Pay Qist"
      width={220}
      height={88}
      decoding="async"
      className={`object-contain object-left ${sizes[size]} w-auto ${className}`}
    />
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex shrink-0 items-center">
        {image}
      </Link>
    );
  }

  return image;
}
