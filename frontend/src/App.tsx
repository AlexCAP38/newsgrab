import {useCallback, useState} from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {AppContext, initState, State} from '@context/Context';
import {ThemeProvider} from '@components/ThemeProvider'
import {
  MainPage,
  LoginPage
} from '@pages/index';
import {Toaster} from "@/components/ui/sonner";


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
  const [state, setState] = useState<State>(initState.state);

  const updateState = useCallback((newState: Partial<State>) => {
    setState(prevState => ({
      ...prevState,
      ...newState,
    }));
  }, []);

  return (
    <>
      <AppContext.Provider value={{state, setState: updateState}}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <Toaster position='top-center' />
        </ThemeProvider>
      </AppContext.Provider>
    </>
  );
}