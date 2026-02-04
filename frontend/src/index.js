import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-circular-progressbar/dist/styles.css";
import { Toaster } from "react-hot-toast";
import * as serviceWorker from "./serviceWorker";
import AttendanceContextProvider from "./Context/AttendanceContext/AttendanceContextProvider";
import { SidebarProvider } from "./Context/AttendanceContext/smallSidebarcontext";
import { ThemeProvider } from "./Context/TheamContext/ThemeContext";
import { BrandingProvider } from "./Context/BrandingContext/BrandingContext";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import NoInternetError from "./Utils/NoInternetError/NoInternetError";
import { ViewProvider } from "./Context/ViewContax/viewType";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 sec cache
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NoInternetError />
    <Provider store={store}>
      <ThemeProvider>
        <SidebarProvider>
          <AttendanceContextProvider>
            <BrandingProvider>
              <ViewProvider>
                <QueryClientProvider client={queryClient}>
                  <App />
                </QueryClientProvider>
              </ViewProvider>
            </BrandingProvider>
          </AttendanceContextProvider>
        </SidebarProvider>
      </ThemeProvider>
    </Provider>
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: "",
        duration: 5000,
        style: {
          background: "#363636",
          color: "#fff",
        },

        success: {
          duration: 3000,
          theme: {
            primary: "green",
            secondary: "black",
          },
        },
      }}
    />{" "}
  </React.StrictMode>,
);

serviceWorker.unregister();
