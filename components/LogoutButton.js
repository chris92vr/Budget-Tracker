import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const LogoutButton = () => {
  const submitHandler = async (e) => {
    e.preventDefault();
    // Remove the token from the cookie
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // Redirect to the login page
    window.location.href = '/login';
  };

  return (
    <form onSubmit={submitHandler}>
      <button type="submit" className="btn btn-link">
        <FontAwesomeIcon icon={faSignOutAlt} />
        Logout
      </button>
    </form>
  );
};

export default LogoutButton;
