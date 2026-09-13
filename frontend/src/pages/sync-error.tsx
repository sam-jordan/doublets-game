import { useMutation } from '@tanstack/react-query';
import { signOut } from 'aws-amplify/auth';
import configureAmplify from '../logic/configure-amplify';
import { getClient } from '../logic/get-query-client';

export default function SyncError() {
    const mutation = useMutation({
        async mutationFn() {
            configureAmplify();
            await signOut();

            const queryClient = getClient();
            queryClient.clear();
        },
        onSuccess() {
            globalThis.location.reload();
        },
    });

    return (
        <div className='font-(family-name:--title-fonts) w-svw h-svh min-h-fit bg-grey-very-dark text-white flex flex-col justify-center items-center'>
            <div className='flex flex-col justify-between items-center gap-8'>
                <h2 className='text-4xl sm:text-6xl font-extrabold'>
                    An error occurred while syncing puzzles.
                </h2>
                <button
                    className='border-2 border-white w-48 cursor-pointer py-2 hover:bg-grey-mid active:bg-grey-mid rounded-3xl font-bold'
                    type='button'
                    onClick={() => {
                        mutation.mutate();
                    }}
                >
                    Log out
                </button>
            </div>
        </div>
    );
}
