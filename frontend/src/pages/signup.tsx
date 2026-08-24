import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type LoginDetails } from '../logic/types';
import { useSignUp } from '../logic/queries';

export default function Signup() {
    const [loginDetails, setLoginDetails] = useState<LoginDetails>({
        username: '',
        password: '',
        confirm: '',
    });
    const [submitted, setSubmitted] = useState<boolean>(false);

    const success = useNavigate();

    const query = useSignUp({
        username: loginDetails.username,
        password: loginDetails.password,
        submitted,
    });

    useEffect(() => {
        async function handleSubmitResponse() {
            if (query.isPending) {
                console.log('Waiting...');
            } else if (query.isError) {
                console.log('Error!');
            } else if (query.data.nextStep.signUpStep === 'DONE') {
                await success('/');
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        handleSubmitResponse();
    }, [query]);

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (loginDetails.password === loginDetails.confirm) {
            setSubmitted(true);
        }
    }

    return (
        <div className='font-(family-name:--title-fonts) w-svw h-svh min-h-fit bg-grey-very-dark text-white flex flex-col items-center'>
            <h1 className='text-5xl font-extrabold text-pink-bright mt-8'>
                DOUBLETS
            </h1>
            <h2 className='text-3xl font-extrabold mt-8'>Sign up</h2>
            <p>Please create an account to continue.</p>
            <div className='font-(family-name:--standard-fonts) my-8 grow'>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='username' className='block mb-1'>
                            Username
                        </label>
                        <input
                            className='bg-white text-black rounded-xl pl-2 py-1 focus:border-pink-bright'
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
                            className='bg-white text-black rounded-xl pl-2 py-1'
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
                            className='bg-white text-black rounded-xl pl-2 py-1'
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
                    <button
                        className='border-2 border-white w-48 cursor-pointer py-2 hover:bg-grey-mid active:bg-grey-mid rounded-3xl mt-4'
                        type='submit'
                    >
                        Sign up
                    </button>
                </form>
            </div>
        </div>
    );
}
