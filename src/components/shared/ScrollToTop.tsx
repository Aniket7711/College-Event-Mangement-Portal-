import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Instantly scrolls to top on route change — no animation delay. */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
