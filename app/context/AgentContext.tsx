"use client"

import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';

type AgentContextProviderProps = {} & PropsWithChildren
type AgentContextType = { investedBalance: number, setInvestedBalance: Dispatch<SetStateAction<number>> };

const AgentContext = createContext({} as AgentContextType);
export const useAgentContext = () => useContext(AgentContext);

export function AgentContextProvider({ children }: AgentContextProviderProps) {
  const [investedBalance, setInvestedBalance] = useState<number>(0);

  return (
    <AgentContext.Provider value={{ investedBalance, setInvestedBalance }}>
      {children}
    </AgentContext.Provider>
  );
}