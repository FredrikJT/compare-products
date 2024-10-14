import React, { createContext, ReactNode, useContext, useState } from "react";
import { Item } from "../types/common";

export interface CsvContextType {
  csvData: Item[][];
  setCsvData: React.Dispatch<React.SetStateAction<Item[][]>>;
}

const CsvContext = createContext<CsvContextType | undefined>(undefined);

interface CsvProviderProps {
  children: ReactNode;
}

export const CsvProvider: React.FC<CsvProviderProps> = ({ children }) => {
  const [csvData, setCsvData] = useState<Item[][]>([]);

  return (
    <CsvContext.Provider value={{ csvData, setCsvData }}>
      {children}
    </CsvContext.Provider>
  );
};

export const useCsvContext = () => {
  const context = useContext(CsvContext);
  if (context === undefined) {
    throw new Error("useCsvContext must be used within a CsvProvider");
  }
  return context;
};
