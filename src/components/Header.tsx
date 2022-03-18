import { useAppDispatch } from "app/hooks/useAppDispatch";
import { useAppSelector } from "app/hooks/useAppSelector";
import {
  bookLoading,
  booksSearching,
  booksSort,
  fetchBooks,
} from "app/store/books";
import { getCategory } from "app/store/categories";
import { HTMLAttributes, FC, ChangeEvent, RefObject } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export interface Props extends HTMLAttributes<HTMLDivElement> {}

type FilterType = {
  [id: string]: {
    name: string;
    active: boolean;
  };
};

export const Header: FC<Props> = () => {
  const { search: searchValue, sorting } = useAppSelector(
    (state) => state.book.params
  );
  const category = useAppSelector(getCategory);

  const [filters, setFilters] = useState<FilterType>({
    asc: {
      name: `Judul A -> Z`,
      active: sorting === "asc" ? true : false,
    },
    desc: {
      name: `Judul Z -> A`,
      active: sorting === "desc" ? true : false,
    },
  });

  const [showFilter, setShowFilter] = useState<boolean>(false);
  const refSearchInput = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(bookLoading());
    dispatch(booksSearching({ search: e.target.value }));
  };

  const handleDeleteSearch = () => {
    dispatch(bookLoading());
    dispatch(booksSearching({ search: "" }));
    refSearchInput.current?.focus();
  };

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleSelectFilter = (id: string) => {
    const newFilters: FilterType = {};
    Object.keys(filters).forEach((key) => {
      newFilters[key] = {
        name: filters[key].name,
        active: id === key ? true : false,
      };
    });

    setFilters(newFilters);
  };

  const handleResetFilter = async () => {
    handleSelectFilter("");
    if (sorting !== "") {
      dispatch(bookLoading());
      dispatch(booksSort({ id: "" }));
      fetchBooks(dispatch, { categoryId: category.id });
    }
  };

  const handleSaveFilter = () => {
    const data = Object.entries(filters).filter(([key, data]) => data.active);
    if (data.length) {
      dispatch(bookLoading());
      dispatch(booksSort({ id: data.length ? data[0][0] : "" }));
      setShowFilter(false);
    }
  };

  return (
    <header className="w-full flex flex-col md:flex-row items-start md:items-center justify-between py-4 px-3 md:px-14 bg-white transition-all">
      <Link to="/">
        <img
          src="/assets/images/logo.png"
          alt="logo sejutacita"
          className="w-24"
        />
      </Link>
      <SearchFilterHeader
        onChangeSearch={handleChangeSearch}
        valueSearch={searchValue}
        onClickDeleteSearch={handleDeleteSearch}
        refSearchInput={refSearchInput}
        filters={filters}
        showFilter={showFilter}
        handleShowFilter={handleShowFilter}
        handleSelectFilter={handleSelectFilter}
        handleResetFilter={handleResetFilter}
        handleSaveFilter={handleSaveFilter}
      />
    </header>
  );
};

export interface PropsSearchFilter extends HTMLAttributes<HTMLDivElement> {
  onChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onClickDeleteSearch: () => void;
  valueSearch: string;
  refSearchInput: RefObject<HTMLInputElement>;
  filters: FilterType;
  handleSelectFilter: (id: string) => void;
  handleShowFilter: () => void;
  handleSaveFilter: () => void;
  handleResetFilter: () => void;
  showFilter: boolean;
}

const SearchFilterHeader: FC<PropsSearchFilter> = ({
  onChangeSearch,
  onClickDeleteSearch,
  valueSearch,
  refSearchInput,
  filters,
  handleSelectFilter,
  handleShowFilter,
  handleSaveFilter,
  handleResetFilter,
  showFilter,
}) => {
  return (
    <>
      <div className="grid grid-flow-col gap-4 self-end mt-4 md:mt-0">
        <div className="flex items-center relative w-auto md:w-96 text-gray-400">
          <span className="material-icons absolute text-lg top-1/2 transform -translate-y-1/2 left-3">
            search
          </span>
          <input
            type="text"
            ref={refSearchInput}
            onChange={onChangeSearch}
            value={valueSearch}
            placeholder="Cari buku"
            className="w-full h-full bg-white py-1 md:py-2 px-9 text-base font-normal placeholder:text-gray-400 border md:border-2 border-gray-400 rounded-lg outline-none focus-visible:border-primary focus-visible:text-gray-600"
          />
          {valueSearch !== "" && (
            <span
              className="material-icons absolute text-lg top-1/2 transform -translate-y-1/2 right-3 hover:text-red-500 hover:cursor-pointer"
              onClick={onClickDeleteSearch}
            >
              cancel
            </span>
          )}
        </div>
        <button
          type="button"
          className="grid grid-flow-col bg-white gap-2 items-center text-gray-400 border md:border-2 border-gray-400 rounded-lg py-1 md:py-2 px-4 hover:bg-gray-100"
          onClick={handleShowFilter}
        >
          <span className="material-icons text-lg">sort</span>
          <p className="text-base font-normal">Filter</p>
        </button>
      </div>
      {/* Modal Filter */}
      <div
        className={`fixed ${
          showFilter
            ? "right-0 bottom-0"
            : "-bottom-full sm:bottom-0 right-0 sm:-right-full"
        } h-1/2 sm:h-full w-full sm:w-5/12 xl:w-3/12 p-5 flex flex-col items-start justify-between rounded-br-none sm:rounded-l-xl rounded-t-xl sm:rounded-t-none bg-white z-50 transition-all`}
      >
        <div className="w-full">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-bold">Sortir</h6>
            <button
              type="button"
              className="text-primary font-medium text-sm"
              onClick={handleResetFilter}
            >
              Reset Semua
            </button>
          </div>
          <ul className="mt-8">
            {Object.entries(filters).map(([key, value]) => (
              <li
                key={key}
                className="cursor-pointer flex items-center mb-3"
                onClick={() => {
                  handleSelectFilter(key);
                }}
              >
                <RadioButton
                  className={`mr-3 ${value.active ? "active" : ""}`}
                />
                {value.name}
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className="w-full bg-primary hover:bg-blue-900 text-white text-base font-medium p-2 rounded-lg"
          onClick={handleSaveFilter}
        >
          Simpan
        </button>
      </div>
      {showFilter && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-30 z-40"
          onClick={handleShowFilter}
        />
      )}
    </>
  );
};

const RadioButton = styled.span`
  display: block;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  border: 1px solid rgb(107 114 128);
  position: relative;

  &.active {
    &::before {
      content: "";
      display: block;
      position: absolute;
      width: 60%;
      height: 60%;
      border-radius: 50%;
      background: #142879;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;
