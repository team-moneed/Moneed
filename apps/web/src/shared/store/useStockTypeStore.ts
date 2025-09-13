import { create } from 'zustand';

interface StockState {
    selectedStockNames: string[];
}

interface StockAction {
    addStockType: (stockType: string) => void;
    removeStockType: (stockType: string) => void;
}

const useStockTypeStore = create<StockState & StockAction>(set => ({
    selectedStockNames: [],
    addStockType: (stocktype: string) =>
        set(state => {
            if (state.selectedStockNames.length >= 10) return state;
            return {
                selectedStockNames: [...state.selectedStockNames, stocktype],
            };
        }),
    removeStockType: (stocktype: string) =>
        set(state => ({
            selectedStockNames: state.selectedStockNames.filter(
                (selectedStockType: string) => selectedStockType !== stocktype,
            ),
        })),
}));

export default useStockTypeStore;
