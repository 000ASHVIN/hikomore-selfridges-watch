import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface MobileMenuProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function MobileMenuButton({ onClick }: MobileMenuProps) {
  return (
    <button className="absolute right-2 top-2 p-2" onClick={onClick}>
      <FontAwesomeIcon className="text-2xl" icon={faBars} />
    </button>
  );
}