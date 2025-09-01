import { create } from 'zustand';

interface SearchKeywordState {
    searchKeyword: string;
}

interface SearchKeywordAction {
    setSearchKeyword: (keyword: string) => void;
}

const useSearchStore = create<SearchKeywordState & SearchKeywordAction>(set => ({
    searchKeyword: '',
    setSearchKeyword: (keyword: string) =>
        set(() => ({
            searchKeyword: keyword,
        })),
}));

export default useSearchStore;
