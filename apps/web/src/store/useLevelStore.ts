import { create } from 'zustand';

interface LevelState {
    selectedLevel: string;
}

interface LevelAction {
    setSelectLevel: (level: string) => void;
}

const useLevelStore = create<LevelState & LevelAction>(set => ({
    selectedLevel: '',
    setSelectLevel: (level: string) =>
        set(() => ({
            selectedLevel: level,
        })),
}));

export default useLevelStore;
