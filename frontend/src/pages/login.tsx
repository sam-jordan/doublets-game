import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';
import { signOut } from 'aws-amplify/auth';
import { DoubletsError, type LoginDetails } from '../logic/types';
import { useCurrentUser, useSignIn } from '../logic/queries';
import configureAmplify from '../logic/configure-amplify';
import Loading from './loading';

export default function Login() {
    const [loginDetails, setLoginDetails] = useState<LoginDetails>({
        username: '',
        password: '',
    });
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const success = useNavigate();

    const currentUser = useCurrentUser();
    const query = useSignIn({
        username: loginDetails.username,
        password: loginDetails.password,
        submitted,
    });

    const mutation = useMutation({
        async mutationFn() {
            configureAmplify();
            await signOut();
        },
        onSuccess() {
            globalThis.location.reload();
        },
    });

    useEffect(() => {
        async function handleSubmitResponse() {
            if (query.isPending) {
                return;
            }

            if (query.isError) {
                setSubmitted(false);

                // Incorrect username/password
                if (query.error.name === 'NotAuthorizedException') {
                    setError(
                        'The username or password you entered is incorrect. Please try again.'
                    );
                } else {
                    throw new DoubletsError(
                        'An error occurred when logging in.'
                    );
                }
            } else if (query.data.nextStep.signInStep === 'DONE') {
                setSubmitted(false);
                await success('/');
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        handleSubmitResponse();
    }, [query]);

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(undefined);
        setSubmitted(true);
    }

    if (currentUser.isPending) {
        return <Loading size='6rem' />;
    }

    if (currentUser.isError) {
        if (submitted && query.isPending) {
            return <Loading size='6rem' />;
        }

        return (
            <div className='font-(family-name:--title-fonts) w-svw h-svh min-h-fit bg-grey-very-dark text-white flex flex-col items-center justify-center'>
                <h1 className='text-5xl font-extrabold text-pink-bright mt-8'>
                    DOUBLETS
                </h1>
                <h2 className='text-3xl font-extrabold mt-8'>Log in</h2>
                <p>Please log in to continue.</p>
                <div className='font-(family-name:--standard-fonts) my-8 grow flex flex-col items-center gap-4'>
                    <form
                        className='flex flex-col gap-4 items-center'
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label htmlFor='username' className='block mb-1'>
                                Username
                            </label>
                            <input
                                className={clsx(
                                    'bg-white text-black rounded-xl pl-2 w-64 h-12',
                                    'sm:w-96'
                                )}
                                id='username'
                                value={loginDetails.username}
                                onChange={event => {
                                    setLoginDetails({
                                        ...loginDetails,
                                        username: event.target.value,
                                    });
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor='username' className='block mb-1'>
                                Password
                            </label>
                            <input
                                className={clsx(
                                    'bg-white text-black rounded-xl pl-2 w-64 h-12',
                                    'sm:w-96'
                                )}
                                id='password'
                                type='password'
                                value={loginDetails.password}
                                onChange={event => {
                                    setLoginDetails({
                                        ...loginDetails,
                                        password: event.target.value,
                                    });
                                }}
                            />
                        </div>
                        {error === undefined ? null : (
                            <p className='text-pink-bright -mb-4'>{error}</p>
                        )}
                        <button
                            className={clsx(
                                'border-2 border-white w-64 cursor-pointer py-2 hover:bg-grey-mid active:bg-grey-mid rounded-3xl mt-4',
                                'sm:w-96'
                            )}
                            type='submit'
                        >
                            Log in
                        </button>
                    </form>
                    <p>
                        Don&apos;t have an account?{' '}
                        <Link
                            to='/user/signup'
                            className='font-bold text-pink-bright'
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
                <p className='font-(family-name:--standard-fonts) text-center p-4'>
                    Please note: We collect <strong>only</strong> gameplay data,
                    for the purpose of calculating statistics.
                </p>
            </div>
        );
    }

    return (
        <div className='font-(family-name:--title-fonts) w-svw h-svh min-h-fit bg-grey-very-dark text-white flex flex-col items-center'>
            <h1 className='text-5xl font-extrabold text-pink-bright mt-8'>
                DOUBLETS
            </h1>
            <h2 className='text-3xl font-extrabold mt-8'>
                Hello {currentUser.data.username}, you&apos;re already logged
                in.
            </h2>
            <div className='font-(family-name:--standard-fonts) flex flex-col p-8 gap-4'>
                <Link
                    className='border-2 border-white w-48 cursor-pointer py-2 rounded-3xl hover:bg-grey-mid active:bg-grey-mid text-center font-bold'
                    to='/'
                >
                    Play
                </Link>
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
