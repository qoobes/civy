import React, { useContext, useState } from "react";

const CompanyContext = React.createContext();

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState();

  return (
    <CompanyContext.Provider value={[company, setCompany]}>
      {children}
    </CompanyContext.Provider>
  );
};
