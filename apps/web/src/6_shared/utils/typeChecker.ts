export const isFile = (value: any): value is File => {
    if (value instanceof File) {
        return true;
    } else if (value?.name && value?.size && value?.type && value?.lastModified) {
        return true;
    }
    return false;
};
