const Vote = ({ id }: { id: string }) => {
    const title = '지금 핫한 투표';
    const standardDate =
        new Date().toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
        }) +
        ' ' +
        new Date().getHours() +
        '시';
    return (
        <section id={id} className='mt-[2.8rem]'>
            <div className='flex items-baseline gap-[.8rem] mb-[1.8rem]'>
                <h2 className='text-[2.2rem] leading-[145%] font-bold text-moneed-black lg:text-[2.4rem] lg:leading-[140%]'>
                    {title}
                </h2>
                <span className='text-moneed-gray-7 text-[1.2rem] font-normal leading-[135%]'>{standardDate} 기준</span>
            </div>
            <div className='bg-moneed-navy h-48 rounded-[.8rem] text-center  pt-16'>
                <span className='text-[2rem] leading-[145%] font-bold text-moneed-white'>comming soon</span>
            </div>
        </section>
    );
};

export default Vote;
