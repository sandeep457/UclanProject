import create from 'zustand';

export const useAuthStore = create((set) => ({
    auth : {
        username : '',
        active : false
    },
    setUsername : (name) => set((state) => ({ auth : { ...state.auth, username : name }})),
    setCategory:(name) => set((state) => ({ auth : { ...state.category, category : name }}))
}))

export const useCategoryStore = create((set) => ({
    value : {
        category : 'None'
    },
    setCategory:(name) => set((state) => ({ value : { ...state.category, category : name }}))
}))