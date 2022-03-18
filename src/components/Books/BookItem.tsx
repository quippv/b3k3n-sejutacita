import { Book } from "app/api/book";
import { FC, HTMLAttributes } from "react";
import { Link } from "react-router-dom";

export interface Props extends HTMLAttributes<HTMLDivElement> {
  book: Book;
}

export const BookItem: FC<Props> = ({ book }) => {
  const { id, cover_url, title, authors } = book;

  return (
    <Link to={`/${id}`}>
      <img src={cover_url} alt={title} className="rounded-xl w-full" />
      <h6 className="text-md sm:text-lg font-bold mt-3">{title}</h6>
      <p className="text-xs md:text-sm font-normal">{authors[0]}</p>
    </Link>
  );
};
