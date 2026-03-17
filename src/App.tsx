import { FC, useEffect } from "react";
import {
  useLaunchParams,
  useSignal,
  miniApp,
  initData,
} from "@tma.js/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { useActions } from "@/hooks/use-actions/useActions";
import GeneralLayout from "./components/layouts/general-layout/GeneralLayout";
import { Toaster } from "@/components/ui/toaster/Toaster";
import { useColorMode } from "./components/ui/provider/color-mode";
import moment from "moment";
import "moment/dist/locale/ru";
import "moment/dist/locale/uz";
import "moment/dist/locale/uz-latn";
import "moment/dist/locale/en-gb";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./plugin/tanstack-query/queryConfig";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const App: FC = () => {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);

  const theme = useColorMode();
  const { setInitData } = useActions();
  const params = useSelector((state: RootState) => state.params);

  useEffect(() => {
    document.addEventListener("contextmenu", (event) => event.preventDefault());

    // TODO:
    theme.setColorMode("light");

    const userData = initData.raw();
    if (userData) setInitData(userData);

    moment.locale("en-gb");
  }, []);

  useEffect(() => {
    moment.locale(params.language);
  }, [params.language]);

  return (
    <AppRoot
      appearance={isDark ? "dark" : "light"}
      platform={["macos", "ios"].includes(lp.tgWebAppPlatform) ? "ios" : "base"}
      className="w-full h-screen"
    >
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <GeneralLayout>
            <AppRoutes />

            <Toaster />
          </GeneralLayout>
          {import.meta.env.VITE_ENABLE_DEVTOOLS === "true" && (
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
          )}
        </QueryClientProvider>
      </BrowserRouter>
    </AppRoot>
  );
};
