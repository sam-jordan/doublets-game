import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';
import { signOut } from 'aws-amplify/auth';
import { DoubletsError, type LoginDetails } from '../logic/types';
import { useCurrentUser, useSignUp } from '../logic/queries';
import configureAmplify from '../logic/configure-amplify';
import Loading from './loading';

export default function Signup() {
    const [loginDetails, setLoginDetails] = useState<LoginDetails>({
        username: '',
        password: '',
        confirm: '',
    });
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const success = useNavigate();

    const currentUser = useCurrentUser();
    const query = useSignUp({
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

                // Username already in use
                if (query.error.name === 'UsernameExistsException') {
                    setError(
                        'This username is already taken. Please choose another.'
                    );
                } else {
                    throw new DoubletsError(
                        'An error occurred when signing up.'
                    );
                }
            } else if (query.data.nextStep.signUpStep === 'DONE') {
                setSubmitted(false);
                await success('/');
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        handleSubmitResponse();
    }, [query]);

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (loginDetails.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (!/\d+/v.test(loginDetails.password)) {
            setError('Password must contain at least one number.');
            return;
        }

        if (
            !/[a-z]+/v.test(loginDetails.password) ||
            !/[A-Z]+/v.test(loginDetails.password)
        ) {
            setError(
                'Password must contain a mix of upper and lower-case letters.'
            );
            return;
        }

        // Special characters allowed by AWS Cognito
        const SPECIALS = '^$*.[]{}()?"!@#%&/\\,><\':;|_~`=+-';
        if (
            loginDetails.password
                .split('')
                .every(char => !SPECIALS.split('').includes(char))
        ) {
            setError('Password must contain at least one special character.');
            return;
        }

        if (loginDetails.password === loginDetails.confirm) {
            setError(undefined);
            setSubmitted(true);
        } else {
            setError('Passwords do not match');
        }
    }

    if (currentUser.isPending) {
        return <Loading size='6rem' />;
    }

    if (currentUser.isError) {
        if (submitted && query.isPending) {
            return <Loading size='6rem' />;
        }

        return (
            <div className='font-(family-name:--title-fonts) w-svw h-svh min-h-fit bg-grey-very-dark text-white flex flex-col items-center'>
                <h1 className='text-5xl font-extrabold text-pink-bright mt-8'>
                    DOUBLETS
                </h1>
                <h2 className='text-3xl font-extrabold mt-8'>Sign up</h2>
                <p>Please create an account to continue.</p>
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
                                    'bg-white text-black rounded-xl pl-2 w-64 h-12 cursor-text',
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
                                    'bg-white text-black rounded-xl pl-2 w-64 h-12 cursor-text',
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
                        <div>
                            <label htmlFor='username' className='block mb-1'>
                                Confirm password
                            </label>
                            <input
                                className={clsx(
                                    'bg-white text-black rounded-xl pl-2 w-64 h-12 cursor-text',
                                    'sm:w-96'
                                )}
                                id='confirm'
                                type='password'
                                value={loginDetails.confirm}
                                onChange={event => {
                                    setLoginDetails({
                                        ...loginDetails,
                                        confirm: event.target.value,
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
                            Sign up
                        </button>
                    </form>
                    <p>
                        Already have an account?{' '}
                        <Link
                            to='/user/login'
                            className='font-bold text-pink-bright'
                        >
                            Log in
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
