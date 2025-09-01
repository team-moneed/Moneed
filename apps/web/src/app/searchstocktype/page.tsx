'use client';
import MyStockBox from '@/components/Mypage/MyStockBox';
import { useState } from 'react';
import Hangul from 'hangul-js';
import { useSelectedStocks } from '@/queries/stock.query';

export const dynamic = 'force-dynamic';

function SearchStockTypeContent() {
    const [searchStockType, setsearchStockType] = useState('');
    const { data: stocks = [], isLoading, error } = useSelectedStocks();

    const getInitialConsonant = (str: string) => {
        return Hangul.d(str)
            .map((char: string) => char.charAt(0))
            .join('');
    };

    const filteredStocks = stocks?.filter(stock => {
        if (!searchStockType) {
            return true;
        }

        // console.log(Hangul.disassemble(item.name).includes(Hangul.disassemble(searchStockType)))

        return (
            stock.name.toLowerCase().includes(searchStockType) ||
            getInitialConsonant(stock.name).includes(getInitialConsonant(searchStockType))
        );
    });

    if (isLoading) {
        return <div className='px-8 max-w-512 mx-auto'>로딩중...</div>;
    }

    if (error) {
        return <div className='px-8 max-w-512 mx-auto'>선택한 종목을 불러올 수 없습니다.</div>;
    }

    return (
        <>
            <div className='px-8 max-w-512 mx-auto'>
                <div className='relative'>
                    <img
                        src='/icon/icon-search.svg'
                        alt='search icon'
                        className='absolute left-4 top-[50%] transform -translate-y-[50%] w-[1.6rem] h-[1.6rem]'
                    />
                    <input
                        type='text'
                        placeholder='게시판 종목을 검색 해 주세요.'
                        value={searchStockType}
                        onChange={e => setsearchStockType(e.target.value)}
                        className='pl-12 pr-4 py-[.8rem] w-full border border-solid border-moneed-gray-5 bg-moneed-black-3 rounded-[1.6rem] text-[1.6rem] text-moneed-gray-7'
                    />
                </div>
                <div className='text-[1.6rem] font-semibold leading-[140%] pb-4 pt-[2.2rem]'>
                    나의 선호 종목 [{filteredStocks.length}]개
                </div>
                <div className='px-[2.4rem] py-[.8rem]'>
                    {filteredStocks.map(stock => (
                        <MyStockBox
                            key={stock.id}
                            stock={stock}
                            href={`/writepost?symbol=${stock.symbol}&stockName=${stock.name}`}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default SearchStockTypeContent;
