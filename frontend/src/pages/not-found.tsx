export default function NotFound() {
    return (
        <div className='font-(family-name:--title-fonts) w-svw h-svh min-h-fit bg-pink-bright text-white flex flex-col justify-center items-center'>
            <div className='flex flex-col justify-between items-center gap-8'>
                <h2 className='text-4xl sm:text-6xl font-extrabold'>
                    PAGE NOT FOUND
                </h2>
                <p className='text-base sm:text-2xl text-center'>
                    Sorry, the page you&apos;re looking for doesn&apos;t exist.
                    <br />
                    Try going back to the previous page{' '}
                    <br className='sm:hidden' />
                    or check that the URL is correct.
                </p>
            </div>
        </div>
    );
}
