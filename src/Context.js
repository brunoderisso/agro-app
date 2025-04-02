import React from 'react';

export const value = {
    environment: null,
    environments: [],
    devices: [],
    token: null,
    isAdmin: false,
    start: null,
    end: null,
    showFilter: false,
    showPreference: false,
    showInvite: false,
    user: null,
};

// Context
const Context = React.createContext({value});

export const ContextProvider = Context.Provider;
export const ContextConsumer = Context.Consumer;