import React, {useCallback, useState} from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


// import {Route, Routes} from 'react-router-dom';
// import {AppContext, defaultState, State} from '@context/Context';
import {ThemeProvider} from '@components/ThemeProvider'
import {
  MainPage,
  LoginPage
} from '@pages/index';




const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);







export function App() {
  // const [state, setState] = useState<State>(defaultState.state);

  // const updateState = useCallback((newState: Partial<State>) => {
  //   setState(prevState => ({
  //     ...prevState,
  //     ...newState,
  //   }));
  // }, []);

  return (
    <>

      <RouterProvider router={router} />
    </>
    // <AppContext.Provider value={{state, setState: updateState}}>
    //   <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    //     <Routes>
    //       <Route path="/" element={<MainPage />}>
    //         {/* <Route index element={<RentPage />} />
    //           <Route path="inventory" element={<InventoryPage />} />
    //           <Route path="user" element={<UserPage />} /> */}
    //       </Route>
    //     </Routes>
    //   </ThemeProvider>
    // </AppContext.Provider>
  );
}