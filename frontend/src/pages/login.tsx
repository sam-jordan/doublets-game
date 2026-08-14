import { useState } from 'react';

export default function Login() {
    const [type, setType] = useState<'options' | 'signup' | 'login'>('options');

    function getMainSection() {
        switch (type) {
            case 'options': {
                return (
                    <div className='font-(family-name:--standard-fonts) flex flex-col gap-1'>
                        <button
                            className='border-2 border-white w-48 cursor-pointer py-2 hover:bg-grey-mid active:bg-grey-mid rounded-3xl'
                            type='button'
                            onClick={() => {
                                setType('login');
                            }}
                        >
                            Log in
                        </button>
                        <button
                            className='border-2 border-white w-48 cursor-pointer py-2 hover:bg-grey-mid active:bg-grey-mid rounded-3xl'
                            type='button'
                            onClick={() => {
                                setType('signup');
                            }}
                        >
                            Sign up
                        </button>
                    </div>
                );
            }

            case 'signup': {
                return (
                    <div className='font-(family-name:--standard-fonts)'>
                        <form className='flex flex-col gap-1'>
                            <label htmlFor='username'>Username</label>
                            <input
                                className='bg-white text-black rounded-xl pl-2 py-1'
                                id='username'
                            />
                            <label htmlFor='username'>Password</label>
                            <input
                                className='bg-white text-black rounded-xl pl-2 py-1'
                                id='password'
                                type='password'
                            />
                            <label htmlFor='username'>Confirm password</label>
                            <input
                                className='bg-white text-black rounded-xl pl-2 py-1'
                                id='confirm'
                                type='password'
                            />
                            <button
                                className='border-2 border-white w-48 cursor-pointer py-2 hover:bg-grey-mid active:bg-grey-mid rounded-3xl'
                                type='submit'
                            >
                                Sign up
                            </button>
                        </form>
                    </div>
                );
            }

            case 'login': {
                return (
                    <div className='font-(family-name:--standard-fonts) flex flex-col gap-1'>
                        <form className='flex flex-col gap-1'>
                            <label htmlFor='username'>Username</label>
                            <input
                                className='bg-white text-black rounded-xl pl-2 py-1'
                                id='username'
                            />
                            <label htmlFor='username'>Password</label>
                            <input
                                className='bg-white text-black rounded-xl pl-2 py-1'
                                id='password'
                                type='password'
                            />
                            <button
                                className='border-2 border-white w-48 cursor-pointer py-2 hover:bg-grey-mid active:bg-grey-mid rounded-3xl'
                                type='submit'
                            >
                                Log in
                            </button>
                        </form>
                    </div>
                );
            }
        }
    }

    return (
        <div className='font-(family-name:--title-fonts) w-svw h-svh bg-grey-very-dark text-white flex flex-col items-center'>
            <h1 className='text-5xl font-extrabold text-pink-bright'>
                DOUBLETS
            </h1>
            <div className='flex flex-col justify-between items-center gap-4'>
                <h2>Log in or create an account</h2>
                {getMainSection()}
            </div>
        </div>
    );
}
