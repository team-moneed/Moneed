export default function AuthCallbackLoading() {
    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50'>
            <div className='text-center'>
                <div className='mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent'></div>
                <p className='text-gray-600'>로그인 처리 중...</p>
            </div>
        </div>
    );
}
