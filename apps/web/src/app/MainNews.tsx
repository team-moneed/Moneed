'use client';

import Card from '@/components/Card';

const NewsData = [
    {
        cardImgages: '/temp/sample1.png',
        title: '미국 정부 임시예산안 상/하원 통과...셧다운 피했다(종합2보)',
        content:
            '미국 하원에 이어 상원까지 21일(현지시간) 내년 3월 중순까지 연방정부 운영에 필요한 임시예산안(CR)을 의결했다.',
        date: '2024-12-22',
    },
    {
        cardImgages: '/temp/sample2.png',
        title: '미국 정부 임시예산안 상/하원 통과...셧다운 피했다(종합2보)',
        content:
            '미국 조 바이든 행정부가 삼성전자에 지급하는 반도체 보조금을 당초 발표된 금액 대비 약 26% 삭감시켜 논란이 일고 있습니다. ',
        date: '2024-12-21',
    },
    {
        cardImgages: '/temp/sample1.png',
        title: '미국, 삼성 반도체 보조금 6조9천억 원 확정...원안보다 26%줄어',
        content:
            '이번 주에는 미국 연방준비제도(Fed)의 기준금리 인하 지연 가능성에 코스피지수가 급락했다. 다음주 국내 증시에서는 고금리 이번 주에는 미국 연방준비제도(Fed)의 기준금리 인하 지연 가능성에 코스피지수가 급락했다.',
        date: '2024-12-20',
    },
];

const movetoNewsLink = () => {};

const MainNews = () => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[3.8rem] gap-x-[1.6rem]'>
            {NewsData.map((news, index) => (
                <Card
                    key={index}
                    cardImgages={news.cardImgages}
                    title={news.title}
                    content={news.content}
                    date={news.date}
                    onClick={movetoNewsLink}
                />
            ))}
        </div>
    );
};

export default MainNews;
