import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import type { LoadingProps } from '../logic/types';

export default function LoadingSpinner({ size }: LoadingProps) {
    return (
        <FontAwesomeIcon
            icon={faCircleNotch}
            style={{ color: 'rgb(255, 255, 255)' }}
            height={size}
            width={size}
            className='animate-spin'
        />
    );
}
