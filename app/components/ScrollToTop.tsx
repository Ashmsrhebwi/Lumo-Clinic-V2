import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * ScrollToTop component ensures that the window scroll position 
 * is reset to (0, 0) whenever the route's pathname changes.
 * 
 * It respects hash/anchor links by skipping the reset if a hash is present,
 * allowing the browser to handle the specific element navigation.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Scroll to top on page navigation, unless a hash is present 
    // for anchor-based navigation (e.g. #contact)
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
