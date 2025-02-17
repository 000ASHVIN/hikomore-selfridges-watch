import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Header from '../header/Header';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}
export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
    return (
      <div
        className={`fixed flex flex-col justify-start items-center z-10 top-0 right-0 h-full w-full bg-darkblack text-white transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button className="absolute right-2 top-2 p-3" onClick={onClose}>
          <FontAwesomeIcon className="text-2xl" icon={faXmark} />
        </button>
        <div className="mt-11 w-full">
            <Header />
        </div>
      </div>
    );
}