import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router";

const WrapperScrollToTop = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return <>{children}</>;
};

export default WrapperScrollToTop;
