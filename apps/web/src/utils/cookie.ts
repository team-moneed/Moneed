export const getCookie = (key: string) => {
    const cookie = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith(`${key}=`))
        ?.split('=')[1];
    return cookie;
};
