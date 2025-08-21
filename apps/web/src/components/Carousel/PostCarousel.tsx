'use client';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { NextButton, PrevButton } from '@/components/Carousel/CarouselArrowButton';
import { usePrevNextButtons } from '@/hooks/usePrevNextButtons';
import { cn } from '@/utils/style';

type PropType = {
    options?: EmblaOptionsType;
    children?: React.ReactNode;
};

const PostCarousel: React.FC<PropType> = ({ options, children }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const { nextBtnDisabled, onNextButtonClick, prevBtnDisabled, onPrevButtonClick } = usePrevNextButtons(emblaApi);

    return (
        <div className='relative lg:pr-[5.6rem]'>
            <div className='w-full overflow-hidden mask-right' ref={emblaRef}>
                <div className='flex gap-[1.6rem]'>{children}</div>
            </div>
            <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
                className={cn(
                    'hidden lg:absolute lg:block top-1/2 left-2 transform -translate-y-1/2 z-10 p-[1.2rem] rounded-4xl bg-moneed-gray-5',
                    prevBtnDisabled && 'lg:hidden',
                )}
            />
            <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
                className={cn(
                    'hidden lg:absolute lg:block top-1/2 right-2 transform -translate-y-1/2 z-10 p-[1.2rem] rounded-4xl bg-moneed-gray-5',
                    nextBtnDisabled && 'lg:hidden',
                )}
            />
        </div>
    );
};

export default PostCarousel;
