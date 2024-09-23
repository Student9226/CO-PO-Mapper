import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import avatar from '../assets/avatar.png';

export const Profile = ({ user, picture }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Welcome, {user}!</h2>
      <img src={avatar} alt="Profile" />
      <div>
        You can log in to your account for more features.
        <button onClick={() => navigate('/login')} role="button" tabIndex={0}>Log in</button>
      </div>
    </div>
  );
};

Profile.defaultProps = {
  user: 'User',
  picture: {avatar}
};

Profile.propTypes = {
  user: PropTypes.string.isRequired,
};
