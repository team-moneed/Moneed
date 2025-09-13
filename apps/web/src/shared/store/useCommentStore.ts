import { create } from 'zustand';

interface CommentState {
    isEditingComment: boolean;
    editCommentId: number | null;
    editCommentContent: string;
}

interface CommentActions {
    setIsEditingComment: (isEditingComment: boolean) => void;
    setEditCommentId: (editCommentId: number | null) => void;
    setEditCommentContent: (editCommentContent: string) => void;
}

export const useCommentStore = create<CommentState & CommentActions>(set => ({
    isEditingComment: false,
    editCommentId: null,
    editCommentContent: '',
    setIsEditingComment: (isEditingComment: boolean) => set({ isEditingComment }),
    setEditCommentId: (editCommentId: number | null) => set({ editCommentId }),
    setEditCommentContent: (editCommentContent: string) => set({ editCommentContent }),
}));
