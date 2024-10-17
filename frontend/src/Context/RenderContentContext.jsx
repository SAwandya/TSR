// RenderContentContext.jsx
import React, { createContext, useContext } from "react";

const RenderContentContext = createContext();

export const useRenderContent = () => useContext(RenderContentContext);

export const RenderContentProvider = ({ children, renderContent }) => (
  <RenderContentContext.Provider value={renderContent}>
    {children}
  </RenderContentContext.Provider>
);
