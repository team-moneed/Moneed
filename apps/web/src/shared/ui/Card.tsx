import { ReactNode } from 'react';

type CardProps = {
    cardImgages: string[] | string;
    title?: string;
    content?: string;
    date?: string;
    onClick: () => void;
    children?: ReactNode;
    className?: string;
};

const Card = ({ cardImgages, title, content, date, children, className = '', onClick }: CardProps) => {
    const images = Array.isArray(cardImgages) ? cardImgages : [cardImgages];

    return (
        <div onClick={onClick} className={`cursor-pointer ${className}`}>
            {images.map((cardImgage, index) => (
                <div key={cardImgage} className='aspect-350/228 lg:aspect-303/195 rounded-[1.6rem] overflow-hidden'>
                    <img src={cardImgage} alt={`Card image ${index + 1}`} className='w-full h-full object-cover' />
                </div>
            ))}

            <div className='flex gap-[1.2rem] flex-col mt-[1.2rem]'>
                {date && <p className='text-moneed-gray-7 text-[1.2rem] leading-[135%]'>{date}</p>}
                {title && (
                    <h3 className='text-[1.8rem] text-moneed-black font-semibold leading-[135%] line-clamp-2'>
                        {title}
                    </h3>
                )}
                {content && <p className='text-moneed-gray-7 text-[1.4rem] leading-[142%] line-clamp-2'>{content}</p>}
            </div>

            {children}
        </div>
    );
};

export default Card;
