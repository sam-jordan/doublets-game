import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

export default function Loading() {
    return (
        <div className='font-(family-name:--title-fonts) w-svw h-svh min-h-fit bg-grey-very-dark text-white flex flex-col items-center justify-center gap-8'>
            <p className='font-bold text-2xl'>Loading...</p>
            <FontAwesomeIcon
                icon={faCircleNotch}
                style={{ color: 'rgb(255, 255, 255)' }}
                size='6x'
                className='animate-spin'
            />
        </div>
    );
}
