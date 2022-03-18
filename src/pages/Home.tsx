import { useAppDispatch } from "app/hooks/useAppDispatch";
import { useAppSelector } from "app/hooks/useAppSelector";
import {
  bookSetPage,
  booksRemove,
  booksSearching,
  booksSort,
  fetchBooks,
} from "app/store/books";
import {
  categoryLoading,
  categoryUpdateId,
  fetchCategories,
  getCategory,
} from "app/store/categories";
import { Books } from "components/Books/Books";
import { LoaderDot } from "components/Loader";
import { useEffect } from "react";
import styled from "styled-components";

const CategoryContainer = styled.div`
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const { results: categories, loading } = useAppSelector(
    (state) => state.category
  );
  const page = useAppSelector<number>((state) => state.book.params.page);
  const category = useAppSelector(getCategory);
  const noData = useAppSelector((state) =>
    Object.keys(state.book.results).length > 0 ? false : true
  );
  const errorBook = useAppSelector((state) => state.book.error);

  window.onscroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >
      document.documentElement.offsetHeight - 100
    ) {
      if (!noData && !errorBook) {
        const currentPage = page + 1;
        dispatch(booksSearching({ search: "" }));
        dispatch(booksSort({ id: "" }));
        dispatch(bookSetPage({ page: currentPage }));
        fetchBooks(dispatch, { categoryId: category.id, page: currentPage });
      }
    }
  };

  useEffect(() => {
    !categories.length && fetchCategories(dispatch);
  }, [categories]);

  useEffect(() => {
    if (category) {
      dispatch(bookSetPage({ page: 0 }));
      fetchBooks(dispatch, { categoryId: category.id, page: 0 });
    }
  }, [category]);

  const handleSelectCategory = (id: number) => {
    dispatch(booksRemove());
    dispatch(categoryLoading());
    dispatch(categoryUpdateId({ selectId: id }));
  };

  return (
    <>
      <h3 className="font-bold text-xl mb-4">Eksplor Kategori</h3>
      {loading ? (
        <div className="flex justify-center w-full">
          <LoaderDot />
        </div>
      ) : (
        <>
          <CategoryContainer className="flex items-center overflow-x-auto pb-4 lg:pb-0">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`mr-3 text-base flex items-center p-3 border ${
                  category.active
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 bg-white hover:bg-gray-100 text-black"
                } hover:cursor-pointer rounded-md min-w-max`}
                onClick={() => {
                  handleSelectCategory(category.id);
                }}
              >
                <span className="material-icons text-base mr-4">
                  {category.icon}
                </span>
                {category.name}
              </div>
            ))}
          </CategoryContainer>
          <h1 className="font-bold text-xl mt-14 mb-8">{category?.name}</h1>
          <Books />
        </>
      )}
    </>
  );
};
