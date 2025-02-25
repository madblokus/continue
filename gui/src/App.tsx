import { useDispatch } from "react-redux";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import Layout from "./components/Layout";
import { VscThemeProvider } from "./context/VscTheme";
import useSetup from "./hooks/useSetup";
import { AddNewModel, ConfigureProvider } from "./pages/AddNewModel";
import ConfigErrorPage from "./pages/config-error";
import ErrorPage from "./pages/error";
import Chat from "./pages/gui";
import History from "./pages/history";
import MigrationPage from "./pages/migration";
import MorePage from "./pages/More";
import Stats from "./pages/stats";
<<<<<<< HEAD
import Inventory from "./pages/inventory";
import PerplexityGUI from "./integrations/perplexity/perplexitygui";
import Welcome from "./pages/welcome/welcomeGui";
import { ContextMenuProvider } from './components/ContextMenuProvider';
import Mem0GUI from "./integrations/mem0/mem0gui";
// import PerplexitySidebarGUI from "./integrations/perplexity/PerplexitySidebarGUI";
import Mem0SidebarGUI from "./integrations/mem0/Mem0SidebarGUI";
=======
import { ROUTES } from "./util/navigation";
import { SubmenuContextProvidersProvider } from "./context/SubmenuContextProviders";
import ConfigPage from "./pages/config";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d


declare global {
  interface Window {
    initialRoute?: string;
    isFirstLaunch?: boolean;
    isPearOverlay?: boolean;
    viewType?: 'pearai.chatView' | 'pearai.mem0View' | 'pearai.searchView';
  }
}

const router = createMemoryRouter(
  [
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/index.html",
          element: <GUI />,
        },
        {
          path: "/",
          element: window.viewType === 'pearai.chatView' ? <GUI /> :
                   window.viewType === 'pearai.searchView' ? <PerplexityGUI /> :
                   window.viewType === 'pearai.mem0View' ? <Mem0SidebarGUI /> :
                  <GUI />, // default to GUI if viewType is undefined or different

        },
        {
          path: "/perplexityMode",
          element: <PerplexityGUI />,
        },
        {
          path: "/history",
          element: <History from={
            window.viewType === 'pearai.chatView' ? 'continue' :
            window.viewType === 'pearai.searchView' ? 'perplexity' :
            'continue' // default fallback
          }/>
        },
        {
          path: "/stats",
          element: <Stats />,
        },
        {
          path: "/help",
          element: <Help />,
        },
        {
          path: "/settings",
          element: <SettingsPage />,
        },
        {
          path: "/addModel",
          element: <AddNewModel />,
        },
        {
          path: "/addModel/provider/:providerName",
          element: <ConfigureProvider />,
        },
        {
          path: "/help",
          element: <HelpPage />,
        },
        {
          path: "/monaco",
          element: <MonacoPage />,
        },
        {
          path: "/onboarding",
          element: <Onboarding />,
        },
        {
          path: "/localOnboarding",
          element: <LocalOnboarding />,
        },
        {
          path: "/migration",
          element: <MigrationPage />,
        },
        {
          path: "/apiKeysOnboarding",
          element: <ApiKeysOnboarding />,
        },
        {
          path: "/apiKeyAutocompleteOnboarding",
          element: <ApiKeyAutocompleteOnboarding />,
        },
        {
          path: "/inventory/*",
          element: <Inventory />,
        },
        {
          path: "/welcome",
          element: <Welcome/>
        },
      ],
    },
  ],
  // TODO: Remove replace /welcome with /inventory when done testing
  {
<<<<<<< HEAD
    initialEntries: [
      window.isPearOverlay
        ? (window.isFirstLaunch ? "/welcome" : "/inventory/home")
        : window.initialRoute
=======
    path: ROUTES.HOME,
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/index.html",
        element: <Chat />,
      },
      {
        path: ROUTES.HOME,
        element: <Chat />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/stats",
        element: <Stats />,
      },
      {
        path: "/addModel",
        element: <AddNewModel />,
      },
      {
        path: "/addModel/provider/:providerName",
        element: <ConfigureProvider />,
      },
      {
        path: "/more",
        element: <MorePage />,
      },
      {
        path: ROUTES.CONFIG_ERROR,
        element: <ConfigErrorPage />,
      },
      {
        path: ROUTES.CONFIG,
        element: <ConfigPage />,
      },
      {
        path: "/migration",
        element: <MigrationPage />,
      },
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    ],
    // FOR DEV'ing welcome:
    // initialEntries: [window.isPearOverlay ? "/welcome" : window.initialRoute],
  },

);




/*
  Prevents entire app from rerendering continuously with useSetup in App
  TODO - look into a more redux-esque way to do this
*/
function SetupListeners() {
  useSetup();
  return <></>;
}

function App() {
<<<<<<< HEAD
  const dispatch = useDispatch();
  useSetup(dispatch);

  const vscTheme = useVscTheme();
  const submenuContextProvidersMethods = useSubmenuContextProviders();
  return (
    <ContextMenuProvider>
      <VscThemeContext.Provider value={vscTheme}>
        <SubmenuContextProvidersContext.Provider
          value={submenuContextProvidersMethods}
        >
          <RouterProvider router={router} />
        </SubmenuContextProvidersContext.Provider>
      </VscThemeContext.Provider>
    </ContextMenuProvider>
=======
  return (
    <VscThemeProvider>
      <SubmenuContextProvidersProvider>
        <RouterProvider router={router} />
      </SubmenuContextProvidersProvider>
      <SetupListeners />
    </VscThemeProvider>
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  );
}

export default App;
