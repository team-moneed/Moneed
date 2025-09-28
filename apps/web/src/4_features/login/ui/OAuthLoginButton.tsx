import Button from '@/6_shared/ui/Button/Button';

interface OAuthLoginButtonProps {
    url: string;
    logo?: React.ReactNode;
    text?: React.ReactNode;
}

export default function OAuthLoginButton({ url, logo, text }: OAuthLoginButtonProps) {
    return (
        <a href={url}>
            <Button
                type='submit'
                variant='primary'
                className='w-full flex items-center justify-center h-[5.6rem] gap-[1.8rem] text-[1.6rem] px-16 font-bold leading-[140%] rounded-[1.6rem] lg:w-auto'
            >
                {logo}
                {text}
            </Button>
        </a>
    );
}
