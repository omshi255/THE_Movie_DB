import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPopularPeople } from "../../api/tmdb";

export const getPopularPeople = createAsyncThunk(
  "people/getPopular",
  async (page: number) => {
    const data = await fetchPopularPeople(page);
    return { results: data.results, page };
  }
);

interface PeopleState {
  people: any[];
  loading: boolean;
  page: number;
}

const initialState: PeopleState = {
  people: [],
  loading: false,
  page: 1,
};

const peopleSlice = createSlice({
  name: "people",
  initialState,
  reducers: {
    resetPeople: (state) => {
      state.people = [];
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPopularPeople.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPopularPeople.fulfilled, (state, action) => {
        state.loading = false;

        const incoming = action.payload.results;

        const uniquePeople = incoming.filter(
          (p: any) => !state.people.some((e: any) => e.id === p.id)
        );

        state.people = [...state.people, ...uniquePeople];
        state.page = action.payload.page;
      })
      .addCase(getPopularPeople.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetPeople } = peopleSlice.actions;
export default peopleSlice.reducer;