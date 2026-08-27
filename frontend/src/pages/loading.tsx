import LoadingSpinner from '../components/loading-spinner';

export default function Loading(props: { readonly size: string }) {
    return (
        <div className='font-(family-name:--title-fonts) w-svw h-svh min-h-fit bg-grey-very-dark text-white flex flex-col items-center justify-center gap-8'>
            <p className='font-bold text-2xl'>Loading...</p>
            <LoadingSpinner size={props.size} />
        </div>
    );
}
