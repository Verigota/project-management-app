import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { api } from '../api/Api';
import { IBoardResp } from '../api/models/BoardsInterfaces';
import { ErrorResponse } from '../api/models/ErrorResponse';

interface IBoardsListState {
  boards: IBoardResp[];
  isLoading: boolean;
  modalIsOpen: boolean;
}

const initialState: IBoardsListState = {
  boards: [],
  isLoading: false,
  modalIsOpen: false
};

export const loadUserBoards = createAsyncThunk<
  IBoardResp[],
  string,
  {
    rejectValue: number | undefined;
  }
>('getAllUserBoards', async (userId, thunkApi) => {
  try {
    return await api.getAllUserBoards(userId);
  } catch (e) {
    return thunkApi.rejectWithValue((<AxiosError<ErrorResponse>>e).response?.status);
  }
});

export const boardsList = createSlice({
  name: 'boardsList',
  initialState,
  reducers: {
    clearBoardsList: (state) => {
      state.boards = initialState.boards;
    },
    toggleIsLoading: (state) => {
      state.isLoading = !state.isLoading;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserBoards.fulfilled, (state, action: PayloadAction<IBoardResp[]>) => {
        state.boards = action.payload;
      })
      .addCase(loadUserBoards.rejected, (state) => {
        state.boards = [];
      });
  }
});
export const { clearBoardsList, toggleIsLoading } = boardsList.actions;

export default boardsList.reducer;
