"use client";
import { SessionProvider } from "next-auth/react";
import { store } from "@/lib/store";
import { Provider } from "react-redux";

function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}

export default ReduxProvider;