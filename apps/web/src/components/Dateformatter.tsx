import { useMemo } from 'react';
import { changeFormatDate } from '@/utils/date';

type DateFormatterPropsType = {
    createdAt: Date;
};

const DateFormatter = ({ createdAt }: DateFormatterPropsType) => {
    // formattedDate 값을 useMemo로 계산
    const formattedDate = useMemo(() => changeFormatDate(createdAt), [createdAt]);

    return <span className='text-[1.4rem] font-normal leading-[142%] text-moneed-gray-7'>{formattedDate}</span>;
};

export default DateFormatter;
