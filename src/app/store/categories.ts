import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, getCategoriesApi } from "app/api/category";
import { RootState } from ".";

export interface CategoryState {
  results: Category[];
  loading: boolean;
}

const initialState: CategoryState = {
  results: [],
  loading: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    categoryLoading(state) {
      if (!state.loading) {
        state.loading = true;
      }
    },
    categoryReceive(state, action: PayloadAction<Category[]>) {
      if (state.loading) {
        state.results = action.payload;
        state.loading = false;
      }
    },
    categoryUpdateId(state, action: PayloadAction<{ selectId: number }>) {
      if (state.loading) {
        state.results = state.results.map(({ id, name, icon }) => ({
          id,
          name,
          icon,
          active: id === action.payload.selectId ? true : false,
        }));
        state.loading = false;
      }
    },
  },
});

export const { categoryLoading, categoryReceive, categoryUpdateId } =
  categorySlice.actions;
export default categorySlice.reducer;

const iconObj = [
  "sentiment_very_satisfied",
  "work",
  "checklist",
  "psychology",
  "savings",
];

/**
 * * Fetching categories
 * @param dispatch
 */
export const fetchCategories = async (dispatch: Function) => {
  dispatch(categoryLoading());
  const data = await getCategoriesApi();
  dispatch(
    categoryReceive(
      data.map(({ id, name }, i) => ({
        id,
        name,
        active: id === 1 ? true : false,
        icon: iconObj[i],
      }))
    )
  );
};

export const getCategory = createSelector(
  (state: RootState) => state.category.results,
  (categories) => {
    return categories?.filter((category) => category.active)[0];
  }
);
