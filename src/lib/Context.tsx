import React, { createContext, useContext, useState } from "react";

interface DataContextType {
  product: any ,
   setProduct:(v:any) => void,
   suggestion:string | null, 
   setSuggestion:(v:string) => void,
   threeLowestPrice:Array<any>, 
   setThreeLowestPrice:(v:any) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [product, setProduct] = useState<any | null>(null)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [threeLowestPrice, setThreeLowestPrice] = useState<Array<any>>([])
    return (
        <DataContext.Provider
          value={{
            product, setProduct, suggestion, setSuggestion,threeLowestPrice, setThreeLowestPrice
          }}
        >
          {children}
        </DataContext.Provider>
      )
}
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
      throw new Error("useData must be used within a DataProvider");
    }
    return context;
  };