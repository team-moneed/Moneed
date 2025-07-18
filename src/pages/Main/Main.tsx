import MainShortforms from './MainShortforms';
import MainNews from './MainNews';
import TopStockRank from './TopStockRank';

const Main = () => {
    return (
        <div className='px-[2rem] max-w-[128rem] mx-auto'>
            <div className='mt-[.7rem] lg:mt-4 aspect-[350/106] rounded-[.8rem] overflow-hidden lg:aspect-[941/151]'>
                <img src='/temp/main-bn-m.png' alt='' className='w-full h-full object-cover lg:hidden' />
                <img src='/temp/main-bn-pc.png' alt='' className='hidden w-full h-full object-cover lg:block' />
            </div>
            <div className='mt-[3.6rem] lg:mt-[2.8rem]'>
                <div className='flex items-center gap-[.8rem] mb-[1.8rem] justify-between'>
                    <h2 className='text-[2.2rem] leading-[135%] font-bold text-[var(--moneed-black)] lg:text-[2.4rem] lg:leading-[140%]'>
                        HOT 숏폼
                    </h2>
                    <button className='flex items-center gap-[.8rem] self-stretch'>
                        <div className='text-[1.4rem] font-[600] leading-[135%] text-[var(--moneed-gray-8)]'>
                            더보기
                        </div>
                        <div className='shrink-0 w-[1.8rem] h-[1.8rem]'>
                            <img src='/icon/icon-arrow-right.svg' alt='' />
                        </div>
                    </button>
                </div>
                <MainShortforms />
            </div>

            <div className='mt-[3.6rem] lg:mt-[5.2rem]'>
                <div className='flex items-center gap-[.8rem] mb-[1.8rem]'>
                    <h2 className='text-[2.2rem] leading-[135%] font-bold text-[var(--moneed-black)] lg:text-[2.4rem] lg:leading-[140%]'>
                        TOP 3 종목 게시판
                    </h2>
                    <span className='text-[var(--moneed-gray-6)] text-[1.2rem] font-[400] leading-[135%]'>
                        12월 21일 9시 기준
                    </span>
                </div>
                <TopStockRank />
            </div>

            <div className='mt-[3.6rem] lg:mt-[5.2rem]'>
                <div className='flex items-center gap-[.8rem] mb-[1.8rem]'>
                    <h2 className='text-[2.2rem] leading-[135%] font-bold text-[var(--moneed-black)] lg:text-[2.4rem] lg:leading-[140%]'>
                        주요 뉴스
                    </h2>
                </div>
                <MainNews />
            </div>
        </div>
    );
};

export default Main;
