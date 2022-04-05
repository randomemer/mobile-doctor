import React from 'react';

// Creating user context
const defaultVal = {profile: {}, signOutCallback: undefined};
export const MainContext = React.createContext(defaultVal);
