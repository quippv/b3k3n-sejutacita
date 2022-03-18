import { Book } from "app/api/book";
import { useAppSelector } from "app/hooks/useAppSelector";
import { getBooks } from "app/store/books";
import Skeleton from "react-loading-skeleton";
import { BookItem } from "./BookItem";
import styled from "styled-components";

const SkeletonComponent = styled(Skeleton)`
  border-radius: 12px;
  height: 300px;

  @media (min-width: 768px) {
    height: 380px;
  }
  @media (min-width: 1024px) {
    height: 400px;
  }
  @media (min-width: 1280px) {
    height: 480px;
  }
`;

export const Books = () => {
  const { loading } = useAppSelector((state) => state.book);
  const books = useAppSelector<Book[]>(getBooks);

  return (
    <div className="grid gap-5 md:gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 transition-all">
      {loading ? (
        [...Array(20)].map((data, i) => (
          <SkeletonComponent key={`${i}-skeleton`} />
        ))
      ) : books.length ? (
        books.map((book) => <BookItem key={book.id} book={book} />)
      ) : (
        <p className="text-center font-medium col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-5">
          Data not found
        </p>
      )}
    </div>
  );
};
