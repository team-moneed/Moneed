import { AxiosError } from 'axios';
import { userApi } from '@/4_features/user/api';
import { useMutation } from '@tanstack/react-query';
import { useDebounce } from '@/6_shared/hooks/useDebounce';
import { useState } from 'react';

interface NicknameInputProps {
    nickname: string;
    onChange: (nickname: string) => void;
}

export default function NicknameInput({ nickname, onChange }: NicknameInputProps) {
    const [duplicationError, setDuplicationError] = useState<string | null>(null);
    const [invalidMessage, setInvalidMessage] = useState<string[]>([]);
    const [isValid, setIsValid] = useState<boolean>(true);

    const { mutate: checkDuplicateNicknameMutation } = useMutation({
        mutationFn: userApi.checkDuplicateNickname,
        onSuccess: () => {
            setDuplicationError(null);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            if (error?.response?.status === 409) {
                setDuplicationError(error.response.data.message);
            } else {
                setDuplicationError('닉네임 중복 확인에 실패했습니다.');
            }
        },
    });

    const handleChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        checkDuplication(e.target.value);
        const input = e.currentTarget;

        if (e.target.value.trim().length < 10 && input.validity.valid) {
            setIsValid(true);
            return;
        }

        const message: string[] = [];
        if (input.validity.valueMissing) {
            message.push('닉네임을 입력해주세요.');
        }
        if (input.validity.tooShort || e.target.value.trim().length < 2) {
            message.push('닉네임은 2-10자까지 입력하실 수 있습니다.');
        }
        if (input.validity.tooLong || e.target.value.trim().length >= 10) {
            message.push('닉네임은 2-10자까지 입력하실 수 있습니다.');
        }
        if (input.validity.patternMismatch) {
            message.push('닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.');
        }

        setIsValid(false);
        setInvalidMessage(message);
    };

    const checkDuplication = useDebounce((nickname: string) => {
        checkDuplicateNicknameMutation({ nickname });
    }, 500);

    return (
        <div>
            <label
                className='text-[1.6rem] font-normal leading-[140%] text-moneed-black mt-[6.9rem]'
                htmlFor='nickname'
            >
                닉네임
            </label>
            <input
                name='nickname'
                title='닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.'
                required
                minLength={2}
                maxLength={10}
                pattern={'^[가-힣a-zA-Z0-9]+$'}
                onChange={handleChangeNickname}
                value={nickname}
                className='bg-moneed-gray-4 text-[1.6rem] rounded-[1.2rem] px-[2.4rem] py-[.8rem] h-[5.4rem] w-full'
            />
            {isValid && (
                <p className='text-[1.4rem] font-normal leading-[140%] text-moneed-green mt-[.8rem]'>
                    사용 가능한 닉네임입니다.
                </p>
            )}
            {!isValid && (
                <ul className='list-disc list-inside'>
                    {invalidMessage.map((message, index) => (
                        <li key={index} className='text-[1.4rem] font-normal leading-[140%] text-moneed-red mt-[.8rem]'>
                            {message}
                        </li>
                    ))}
                </ul>
            )}
            {duplicationError && (
                <p className='text-[1.4rem] font-normal leading-[140%] text-moneed-red mt-[.8rem]'>
                    {duplicationError}
                </p>
            )}
        </div>
    );
}
