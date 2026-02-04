import React from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./Routes.jsx";
import { ShowHideProvider } from "./Context/ShowHideContext/ShowHideContext.js";
import { ShowStickeyProvider } from "./Context/ShowStickeyContext/ShowStickeyContext.js";
import { ShowTodoProvider } from "./Context/ShowTodoListContext/ShowTodoListContext.js";
import { ShowBreakPushPoupProvider } from "./Context/BreakPushPoupContext/BreakPushPoupContext.js";
import { ApiRefreshProvider } from "./Context/ApiRefreshContext/ApiRefreshContext.js";
import FaviconUpdater from "./Utils/favicons/FaviconUpdater.jsx";

// style={{ userSelect: "none" }}

const App = () => {
  return (
    <div >
      <FaviconUpdater />
      <ShowBreakPushPoupProvider>
        <ApiRefreshProvider>
          <ShowTodoProvider>
            <ShowStickeyProvider>
              <ShowHideProvider>
                <RouterProvider router={router} />
              </ShowHideProvider>
            </ShowStickeyProvider>
          </ShowTodoProvider>
        </ApiRefreshProvider>
      </ShowBreakPushPoupProvider>
    </div>
  );
};

export default App;
