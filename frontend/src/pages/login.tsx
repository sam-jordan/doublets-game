import clsx from 'clsx';
import { useState } from 'react';
import { signIn, signUp } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { loginSchema, signupSchema } from '../logic/types';
import configureAmplify from '../logic/configure-amplify';

// eslint-disable-next-line unicorn/no-top-level-side-effects
configureAmplify();

export default function Login() {
    const [type, setType] = useState<'empty' | 'signup' | 'login'>('empty');
    const success = useNavigate();

    function getMainSection() {
        switch (type) {
            case 'empty': {
                return null;
            }

            case 'signup': {
                return (
                    <>
                        <div>
                            <label htmlFor='username' className='block mb-1'>
                                Username
                            </label>
                            <input
                                className='bg-white text-black rounded-xl pl-2 py-1 focus:border-pink-bright'
                                id='username'
                                name='username'
                            />
                        </div>
                        <div>
                            <label htmlFor='username' className='block mb-1'>
                                Password
                            </label>
                            <input
                                className='bg-white text-black rounded-xl pl-2 py-1'
                                id='password'
                                name='password'
                                type='password'
                            />
                        </div>
                        <div>
                            <label htmlFor='username' className='block mb-1'>
                                Confirm password
                            </label>
                            <input
                                className='bg-white text-black rounded-xl pl-2 py-1'
                                id='confirm'
                                name='confirm'
                                type='password'
                            />
                        </div>
                        <button
                            className='border-2 border-white w-48 cursor-pointer py-2 hover:bg-grey-mid active:bg-grey-mid rounded-3xl mt-4'
                            type='submit'
                        >
                            Sign up
                        </button>
                    </>
                );
            }

            case 'login': {
                return (
                    <>
                        <div>
                            <label htmlFor='username' className='block mb-1'>
                                Username
                            </label>
                            <input
                                className='bg-white text-black rounded-xl pl-2 py-1'
                                id='username'
                                name='username'
                            />
                        </div>
                        <div>
                            <label htmlFor='username' className='block mb-1'>
                                Password
                            </label>
                            <input
                                className='bg-white text-black rounded-xl pl-2 py-1'
                                id='password'
                                name='password'
                                type='password'
                            />
                        </div>
                        <button
                            className='border-2 border-white w-48 cursor-pointer py-2 hover:bg-grey-mid active:bg-grey-mid rounded-3xl mt-4'
                            type='submit'
                        >
                            Log in
                        </button>
                    </>
                );
            }
        }
    }

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event?.currentTarget);

        if (type === 'signup') {
            const inputs = signupSchema.parse(Object.fromEntries(formData));
            const { username, password, confirm } = inputs;

            if (password === confirm) {
                const response = await signUp({
                    username,
                    password,
                });

                if (response.nextStep.signUpStep === 'DONE') {
                    await success('/');
                }
            }
        } else if (type === 'login') {
            const inputs = loginSchema.parse(Object.fromEntries(formData));
            const { username, password } = inputs;

            const response = await signIn({
                username,
                password,
            });

            if (response.nextStep.signInStep === 'DONE') {
                await success('/');
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
                        }}
                    >
                        New user
                    </button>
                </div>
                <div className='font-(family-name:--standard-fonts) my-8 grow'>
                    <form
                        className='flex flex-col gap-4'
                        // eslint-disable-next-line @typescript-eslint/strict-void-return
                        onSubmit={handleSubmit}
                    >
                        {getMainSection()}
                    </form>
                </div>
            </div>
        </div>
    );
}
