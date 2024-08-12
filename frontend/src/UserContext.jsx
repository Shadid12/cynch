import { createContext, useState } from 'react';
import PropTypes from 'prop-types'; // Add this line to import PropTypes

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [sentiment, setSentiment] = useState('');

  return (
    <UserContext.Provider value={{ sentiment, setSentiment }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

// Add prop validation for 'children'
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
