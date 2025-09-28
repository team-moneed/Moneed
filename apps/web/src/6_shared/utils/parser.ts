export const urlToS3FileName = (url: string) => {
    return new URL(url).pathname.slice(1);
};

export const toUSD = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};
