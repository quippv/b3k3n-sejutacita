import { Book } from "app/api/book";
import { useAppSelector } from "app/hooks/useAppSelector";
import WrapperScrollToTop from "app/utils/WrapperScrollToTop";
import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookmark, setBookmark] = useState(false);
  const storage = useMemo(
    () => localStorage.getItem("bookmark_sejutacita_book"),
    []
  );

  const book = useAppSelector<Book>(
    (state) => state.book.results[id as string]
  );

  useEffect(() => {
    !book && navigate("/");
  }, [book, navigate]);

  useEffect(() => {
    if (book) {
      if (storage && JSON.parse(storage)[book.id]) {
        setBookmark(true);
      }
    }
  }, [book, storage]);

  const handleBookmark = () => {
    const data: {
      [id: string]: true;
    } = storage ? JSON.parse(storage) : {};

    if (id) {
      if (bookmark) {
        delete data[id];
      } else {
        data[id] = true;
      }
    }

    localStorage.setItem("bookmark_sejutacita_book", JSON.stringify(data));
    setBookmark(!bookmark);
  };

  const ButtonActions = (
    <>
      <button className="flex items-center justify-center text-base text-primary font-medium border border-primary bg-white hover:bg-gray-50 rounded-lg w-11/12 p-2">
        <span className="material-icons mr-2">headphones</span> Dengar
      </button>
      <button className="flex items-center justify-center text-base text-white font-medium border border-primary bg-primary hover:bg-blue-900 rounded-lg w-11/12 p-2">
        <span className="material-icons mr-2">auto_stories</span> Baca
      </button>
    </>
  );

  return book ? (
    <WrapperScrollToTop>
      <div className="flex items-center justify-between mb-16">
        <span
          className="material-icons text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        >
          arrow_back_ios
        </span>
        <span
          className="material-icons text-2xl text-primary cursor-pointer"
          onClick={handleBookmark}
        >
          {bookmark ? "bookmark" : "bookmark_border"}
        </span>
      </div>
      <div className="flex flex-col md:flex-row items-start">
        <img
          src={book.cover_url}
          alt={book.title}
          className="w-8/12 sm:w-6/12 mx-auto md:mx-0 md:w-5/12 rounded-2xl shadow-xl"
        />
        <div className="grid md:hidden grid-flow-col mt-8 w-full">
          {ButtonActions}
        </div>
        <div className="w-full ml-0 md:ml-14 mt-14 md:mt-0">
          <h1 className="text-2xl sm:text-5xl font-bold">{book.title}</h1>
          <p className="mt-3 text-base font-medium">
            {book.authors.map((author, index) => {
              const length = book.authors.length;
              let text = author;

              if (length > 1 && length - 1 !== index) {
                text += `, ${author}`;
              } else if (length > 1 && length - 1 === index) {
                text += ` & ${author}`;
              }

              return text;
            })}
          </p>
          <div className="flex items-center text-base mt-4 py-4 border-t border-b border-gray-200">
            <p className="flex items-center mr-4">
              <span className="material-icons text-base mr-1">description</span>{" "}
              {book.sections.length} bab
            </p>
            <p className="flex items-center">
              <span className="material-icons text-base mr-1">alarm</span>{" "}
              {Math.ceil(book.audio_length / 60)} menit
            </p>
          </div>
          <div className="hidden md:grid grid-flow-col mt-8">
            {ButtonActions}
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold">Tentang buku ini?</h3>
            <p className="text-base font-normal mt-3">{book.description}</p>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold">Apa saja di dalamnya?</h3>
            <ul className="text-base font-normal mt-3">
              {book.sections.map((section, i) => (
                <li
                  key={section.title}
                  className="flex w-full items-start text-lg cursor-pointer font-medium text-primary"
                >
                  <span className="mr-4 py-4">{i + 1}</span>
                  <span className="py-4 border-b w-full block border-gray-300">
                    {section.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </WrapperScrollToTop>
  ) : (
    <></>
  );
};
