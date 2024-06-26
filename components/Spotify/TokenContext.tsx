import { createContext } from "react";

export const TokenContext = createContext({
  token: null,
  setToken: (value: string) => {},
});
