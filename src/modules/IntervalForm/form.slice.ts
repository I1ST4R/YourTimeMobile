import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreIntervalType } from '../IntervalList/slices/interval/intervalStorage';

export type FormType = "delete" | "create" | "update"

type FormIntervalState = {
  isOpen: boolean,
  type: FormType,
  currentInterval: StoreIntervalType | null
}

const initialState: FormIntervalState = {
  isOpen: false,
  type: "create",
  currentInterval: null
};

const formIntevalSlice = createSlice({
  name: 'formInterval',
  initialState,
  reducers: {
    openForm: (state) => {
      state.isOpen = true
    },
    closeForm: (state) => {
      state.isOpen = false
    },
    changeTypeOnDelete : (state) => {
      state.type = "delete"
    },
    changeTypeOnCreate : (state) => {
      state.type = "create"
    },
    changeTypeOnUpdate : (state) => {
      state.type = "update"
    },
    changeCurrentInterval : (state, action: PayloadAction<StoreIntervalType>) => {
      state.currentInterval = action.payload
    }
  },
  selectors: {
    selectIsOpen: (state) => state.isOpen,
    selectFormType: (state) => state.type,
    selectCurrentInterval: (state) => state.currentInterval,
  }
});

export const { 
  openForm,
  closeForm,
  changeTypeOnDelete,
  changeTypeOnCreate,
  changeTypeOnUpdate,
  changeCurrentInterval
} = formIntevalSlice.actions;

export const { 
  selectIsOpen,
  selectFormType,
  selectCurrentInterval
} = formIntevalSlice.selectors;

export default formIntevalSlice.reducer;