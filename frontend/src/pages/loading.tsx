import LoadingSpinner from '../components/loading-spinner';
import type { LoadingProps } from '../logic/types';

export default function Loading({ size }: LoadingProps) {
    return (
        <div className='font-(family-name:--title-fonts) w-svw h-svh min-h-fit bg-grey-very-dark text-white flex flex-col items-center justify-center gap-8'>
            <p className='font-bold text-2xl'>Loading...</p>
            <LoadingSpinner size={size} />
        </div>
    );
}
