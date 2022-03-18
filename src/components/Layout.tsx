import { HTMLAttributes, FC, ReactChild, useState, useCallback } from "react";
import { Header } from "./Header";

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactChild;
}

export const Layout: FC<Props> = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = useCallback(() => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  }, []);

  const handleToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.addEventListener("scroll", toggleVisible);

  return (
    <>
      <Header />
      <main className="min-h-screen container mx-auto pt-5 pb-20 px-3 md:px-0">
        {children}
      </main>
      <footer className="w-full py-4 px-3">
        <p className="text-sm font-normal text-center">
          Made with ❤️️ by <strong>SejutCita Community</strong>
        </p>
      </footer>
      {visible && (
        <div
          onClick={handleToTop}
          className="fixed z-30 bottom-5 right-5 h-12 w-12 rounded-full bg-primary text-white flex items-center cursor-pointer hover:animate-bounce justify-center transition-all"
        >
          <span className="material-icons">arrow_upward</span>
        </div>
      )}
    </>
  );
};
