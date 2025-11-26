// src/app/providers/StoreProvider.tsx
"use client";

import { createContext } from "react";
import { store } from "./store";

export const StoreCtx = createContext({ store });

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoreCtx.Provider value={{ store }}>{children}</StoreCtx.Provider>;
}
