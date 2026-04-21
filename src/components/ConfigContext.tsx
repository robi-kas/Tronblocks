import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

interface LevelProgression {
  level: number;
  price: number;
  directReq: number;
  reqLevel: number;
}

interface ConfigData {
  version: string;
  effectiveTime: string;
  entryPrice: number;
  maxLevel: number;
  currency: string;
  networks: string[];
  levelProgression: LevelProgression[];
  rulesText: {
    activateSeat: string;
    publicMatrix: string;
    teamPerformance: string;
    differential: string;
    matrixRules: string;
  }
}

const ConfigContext = createContext<{ config: ConfigData | null, isLoading: boolean }>({
  config: null,
  isLoading: true
});

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: config, isLoading } = useQuery({
    queryKey: ['systemConfig'],
    queryFn: async () => {
      const res = await fetch('/api/config');
      if (!res.ok) throw new Error('Failed to fetch config');
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <ConfigContext.Provider value={{ config: config || null, isLoading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useSystemConfig = () => useContext(ConfigContext);
