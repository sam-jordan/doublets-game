import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { useQuery } from '@tanstack/react-query';
import configureAmplify from '../logic/configure-amplify';
import { type LoginDetails } from '../logic/types';
import SignupForm from '../components/logins/signup-form';
import LoginForm from '../components/logins/login-form';

export default function Login() {
    const [type, setType] = useState<'base' | 'signup' | 'login'>('base');
    const [loginDetails, setLoginDetails] = useState<LoginDetails>({
        username: '',
        password: '',
        confirm: '',
    });

    const currentUser = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
    });

    useEffect(() => {
        // Ran only on first render
        configureAmplify();
    }, []);

    function getForm() {
        switch (type) {
            case 'base': {
                return (
                    <div>
                        <p>Select a user type to continue.</p>
                    </div>
                );
            }

            case 'signup': {
                return (
                    <SignupForm
                        loginDetails={loginDetails}
                        setLoginDetails={setLoginDetails}
                    />
                );
            }

            case 'login': {
                return (
                    <LoginForm
                        loginDetails={loginDetails}
                        setLoginDetails={setLoginDetails}
                    />
                );
            }
        }
    }

    return (
        <div className='font-(family-name:--title-fonts) w-svw h-svh min-h-fit bg-grey-very-dark text-white flex flex-col items-center'>
            <h1 className='text-5xl font-extrabold text-pink-bright mt-8'>
                DOUBLETS
            </h1>
            <div className='flex flex-col items-center'>
                <div
                    className={clsx(
                        'flex flex-col justify-between items-center gap-4 p-8 border-b-2 border-b-white'
                    )}
                >
                    <h2>Log in or create an account</h2>
                    <button
                        className={clsx(
                            'font-(family-name:--standard-fonts) border-2 border-white w-48 cursor-pointer py-2 rounded-3xl',
                            type === 'login'
                                ? 'bg-pink-bright'
                                : 'hover:bg-grey-mid active:bg-grey-mid'
                        )}
                        type='button'
                        onClick={() => {
                            setType('login');
                            setLoginDetails({
                                username: '',
                                password: '',
                                confirm: '',
                            });
                        }}
                    >
                        Existing user
                    </button>
                    <button
                        className={clsx(
                            'font-(family-name:--standard-fonts) border-2 border-white w-48 cursor-pointer py-2 rounded-3xl',
                            type === 'signup'
                                ? 'bg-pink-bright'
                                : 'hover:bg-grey-mid active:bg-grey-mid'
                        )}
                        type='button'
                        onClick={() => {
                            setType('signup');
                            setLoginDetails({
                                username: '',
                                password: '',
                                confirm: '',
                            });
                        }}
                    >
                        New user
                    </button>
                </div>
                <div className='font-(family-name:--standard-fonts) my-8 grow'>
                    {currentUser.isPending ? (
                        <p>Loading...</p>
                    ) : currentUser.isError ? (
                        getForm()
                    ) : (
                        <p>{currentUser.data.username}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
