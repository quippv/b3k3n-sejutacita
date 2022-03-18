import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book, getBooksApi } from "app/api/book";
import { RootState } from ".";

export interface BookState {
  results: { [id: string]: Book };
  loading: boolean;
  params: {
    sorting: "asc" | "desc" | "";
    search: string;
    page: number;
  };
  error: boolean;
}

const initialState: BookState = {
  results: {},
  loading: false,
  params: {
    search: "",
    sorting: "",
    page: 0,
  },
  error: false,
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    bookLoading(state) {
      if (!state.loading) {
        state.loading = true;
      }
    },
    bookSetError(state) {
      state.error = true;
      state.loading = false;
    },
    bookReceive(state, action: PayloadAction<Book[]>) {
      if (state.loading) {
        const books = action.payload;
        for (const key of books) {
          state.results[key.id] = key;
        }
        state.error = false;
        state.loading = false;
      }
    },
    booksRemove(state) {
      state.results = {};
    },
    booksSearching(state, action: PayloadAction<{ search: string }>) {
      state.params.search = action.payload.search;
      state.loading = false;
    },
    booksSort(state, action: PayloadAction<{ id: "asc" | "desc" | "" | any }>) {
      state.params.sorting = action.payload.id;
      state.loading = false;
    },
    bookSetPage(state, action: PayloadAction<{ page: number }>) {
      state.params.page = action.payload.page;
    },
  },
});

export const {
  bookLoading,
  bookSetError,
  bookReceive,
  booksRemove,
  booksSearching,
  booksSort,
  bookSetPage,
} = bookSlice.actions;
export default bookSlice.reducer;

/**
 * * Fetching books
 * @param dispatch
 * @param params
 */
export const fetchBooks = async (
  dispatch: Function,
  params: {
    categoryId: number;
    page?: number;
    size?: number;
  }
) => {
  dispatch(bookLoading());
  const data = await getBooksApi(params);
  if (data.length > 0) {
    dispatch(bookReceive(data));
  } else {
    dispatch(bookSetError());
  }
};

export const getBooks = createSelector(
  (state: RootState) => state.book,
  ({ results, params: { search, sorting } }) => {
    let data: Book[] = Object.values(results);

    if (search !== "") {
      data = data.filter((result) => {
        let searchArray: string = result.title.toLowerCase();

        result.authors.forEach((author) => {
          searchArray += ` ${author.toLowerCase()}`;
        });

        return searchArray.search(search.toLocaleLowerCase()) > -1
          ? true
          : false;
      });
    }

    if (sorting !== "") {
      data = data.sort((a, b) =>
        sorting === "desc"
          ? a.title < b.title
            ? 1
            : -1
          : a.title > b.title
          ? 1
          : -1
      );
    }

    return data;
  }
);
