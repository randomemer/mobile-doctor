import React from 'react';

// Creating user context
const defaultVal = {profile: {}, signOutCallback: undefined, ip: ''};
export const MainContext = React.createContext(defaultVal);
