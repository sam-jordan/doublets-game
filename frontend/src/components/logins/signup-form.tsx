import { signUp } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type LoginDetails } from '../../logic/types';

export default function SignupForm(props: {
    readonly loginDetails: LoginDetails;
    readonly setLoginDetails: React.Dispatch<
        React.SetStateAction<LoginDetails>
    >;
}) {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const success = useNavigate();

    const { username, password, confirm } = props.loginDetails;
    const query = useQuery({
        queryKey: [username],
        queryFn: async () =>
            signUp({
                username,
                password,
            }),
        enabled: submitted,
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

        if (password === confirm) {
            setSubmitted(true);
        }
    }

    return (
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
                <label htmlFor='username' className='block mb-1'>
                    Username
                </label>
                <input
                    className='bg-white text-black rounded-xl pl-2 py-1 focus:border-pink-bright'
                    id='username'
                    value={username}
                    onChange={event => {
                        props.setLoginDetails({
                            ...props.loginDetails,
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
                    value={password}
                    onChange={event => {
                        props.setLoginDetails({
                            ...props.loginDetails,
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
                    value={confirm}
                    onChange={event => {
                        props.setLoginDetails({
                            ...props.loginDetails,
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
    );
}
