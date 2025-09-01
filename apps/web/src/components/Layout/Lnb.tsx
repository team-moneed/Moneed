import LnbLink from '@/components/LnbLink';
import { Link } from 'react-router-dom';

type Lnb = {
    active?: boolean;
};
const Lnb = ({ active }: Lnb) => {
    return (
        <>
            <div
                className={`hidden sticky top-0 h-screen lg:flex shrink-0 flex-col bg-moneed-gray-3 pt-[3.2rem] max-w-[20.8rem] ${
                    active ? 'pl-[3.2rem] pr-[2.4rem]' : 'px-[1.6rem]'
                }`}
            >
                <button type='button' className='w-[4.4rem] h-[2.4rem] flex items-center justify-center'>
                    <div className='w-[2.8rem] h-[2.8rem] bg-moneed-black rounded-full flex items-center justify-center'>
                        <img className='w-[1.4rem] h-[1.2rem]' src='/icon/icon-logo.svg' alt='' />
                    </div>
                </button>
                <div className='pt-42 flex-1 flex flex-col gap-[1.8rem]'>
                    <LnbLink to='/' icon='/icon/icon-lnb-1.svg' activeIcon='/icon/icon-lnb-1-on.svg' active={true}>
                        <span className={`text-[1.4rem] font-semibold w-[8.4rem] ${active ? 'block' : 'hidden'}`}>
                            홈
                        </span>
                    </LnbLink>
                    <LnbLink to='/' icon='/icon/icon-lnb-2.svg' activeIcon='/icon/icon-lnb-2-on.svg'>
                        <span className={`text-[1.4rem] font-semibold w-[8.4rem] ${active ? 'block' : 'hidden'}`}>
                            숏폼
                        </span>
                    </LnbLink>
                    <LnbLink to='/community' icon='/icon/icon-lnb-3.svg' activeIcon='/icon/icon-lnb-3-on.svg'>
                        <span className={`text-[1.4rem] font-semibold w-[8.4rem] ${active ? 'block' : 'hidden'}`}>
                            커뮤니티
                        </span>
                    </LnbLink>
                </div>
                <div className={`shrink-0 pb-8 ${active ? 'block' : 'hidden'}`}>
                    <p className='text-[1rem] font-normal leading-[135%] text-moneed-gray-8 mt-[2.4rem]'>
                        고객센터: moneed@example.com
                    </p>
                    <div className='flex items-center gap-x-[.8rem] flex-wrap mt-[.8rem]'>
                        <Link to='' className='text-moneed-gray-7 text-[1rem] font-semibold leading-[135%]'>
                            이용약관
                        </Link>
                        <i className='w-[.1rem] h-4 bg-moneed-gray-7'></i>
                        <Link to='' className='text-moneed-gray-7 text-[1rem] font-semibold leading-[135%]'>
                            개인정보처리방침
                        </Link>
                        <i className='w-[.1rem] h-4 bg-moneed-gray-7'></i>
                        <Link to='' className='text-moneed-gray-7 text-[1rem] font-semibold leading-[135%]'>
                            게시판이용정책
                        </Link>
                        <i className='w-[.1rem] h-4 bg-moneed-gray-7'></i>
                        <Link to='' className='text-moneed-gray-7 text-[1rem] font-semibold leading-[135%]'>
                            법적고지
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Lnb;
