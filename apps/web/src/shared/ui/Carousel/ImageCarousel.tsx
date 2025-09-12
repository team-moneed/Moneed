import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

type PropType = {
    slides: string[];
    options?: EmblaOptionsType;
};

const ImageCarousel: React.FC<PropType> = props => {
    const { slides, options } = props;
    const [emblaRef] = useEmblaCarousel(options);

    return (
        <section>
            <div className='w-full overflow-hidden' ref={emblaRef}>
                <div className='flex'>
                    {slides.map((imgUrl, index) => (
                        <div className='w-full h-64 shrink-0' key={index}>
                            <img
                                src={imgUrl}
                                alt={`Slide ${index + 1}`}
                                className='w-full h-full object-cover rounded-[.8rem]'
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImageCarousel;
