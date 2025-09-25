import { adjectives, nouns } from '@/config/nicknameSeed';

export const generateRandomNickname = () => {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective}${randomNoun}`;
};

export const generateRandomNumber = () => {
    return Math.floor(Math.random() * 9000) + 1000; // 1000-9999
};

export const generateRandomImage = () => {
    const randomNumber = Math.floor(Math.random() * 15) + 1;
    return `/profile/profile-${randomNumber}.svg`;
};
