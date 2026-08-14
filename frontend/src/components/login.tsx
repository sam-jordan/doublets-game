export default function Login() {
    return (
        <div className='font-(family-name:--title-fonts) w-svw h-svh bg-grey-very-dark text-white flex flex-col items-center'>
            <h1 className='text-5xl font-extrabold text-pink-bright'>
                DOUBLETS
            </h1>
            <div className='flex flex-col justify-between items-center gap-4'>
                <h2>Log in or create an account</h2>
                <div className='font-(family-name:--standard-fonts) flex flex-col gap-1'>
                    <label htmlFor='username'>Username</label>
                    <input
                        className='bg-white text-black rounded-xl pl-2 py-1'
                        id='username'
                    />
                </div>
            </div>
        </div>
    );
}
