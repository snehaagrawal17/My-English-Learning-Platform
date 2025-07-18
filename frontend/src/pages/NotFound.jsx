
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import './NotFound.css';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <p>Oops! Page not found</p>
        <a href="/" className="home-link">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
