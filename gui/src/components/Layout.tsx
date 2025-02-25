<<<<<<< HEAD
import { IndexingProgressUpdate } from "core";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import {
  CustomScrollbarDiv,
  defaultBorderRadius,
  vscForeground,
  vscInputBackground,
  vscBackground,
  vscEditorBackground,
} from ".";
import { IdeMessengerContext } from "../context/IdeMessenger";
import { useWebviewListener } from "../hooks/useWebviewListener";
import { defaultModelSelector } from "../redux/selectors/modelSelectors";
=======
import { useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CustomScrollbarDiv, defaultBorderRadius } from ".";
import { AuthProvider } from "../context/Auth";
import { useWebviewListener } from "../hooks/useWebviewListener";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { focusEdit, setEditStatus } from "../redux/slices/editModeState";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import {
  addCodeToEdit,
  newSession,
  selectIsInEditMode,
  setMode,
  updateApplyState,
} from "../redux/slices/sessionSlice";
import { setShowDialog } from "../redux/slices/uiSlice";
import { exitEditMode } from "../redux/thunks";
import { loadLastSession, saveCurrentSession } from "../redux/thunks/session";
import { getFontSize, isMetaEquivalentKeyPressed } from "../util";
<<<<<<< HEAD
import { getLocalStorage, setLocalStorage } from "../util/localStorage";
import PostHogPageView from "./PosthogPageView";
import ShortcutContainer from "./ShortcutContainer";
import InventoryPreview from "../components/InventoryPreview";
import TextDialog from "./dialogs";


// check mac or window
const platform = navigator.userAgent.toLowerCase();
const isMac = platform.includes("mac");
const isWindows = platform.includes("win");

// #region Styled Components
const HEADER_HEIGHT = "1.55rem";
export const FOOTER_HEIGHT = "9.5rem";

const GlobalStyle = createGlobalStyle`
  :root {
	background-color:${vscBackground};
    --overlay-border-radius: 12px;
    --overlay-box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }
`;

const BottomMessageDiv = styled.div<{ displayOnBottom: boolean }>`
  position: fixed;
  bottom: ${(props) => (props.displayOnBottom ? "50px" : undefined)};
  top: ${(props) => (props.displayOnBottom ? undefined : "50px")};
  left: 0;
  right: 0;
  margin: 8px;
  margin-top: 0;
  background-color: ${vscInputBackground};
  color: ${vscForeground};
  border-radius: ${defaultBorderRadius};
  padding: 12px;
  z-index: 100;
  box-shadow: 0px 0px 2px 0px ${vscForeground};
  max-height: 35vh;
`;

const OverlayContainer = styled.div<{ isPearOverlay: boolean, path: string }>`
  ${props => props.isPearOverlay && `
    width: 100%;
    height: 100%;
    border-radius: var(--overlay-border-radius, 12px);
    box-shadow: ${props.path === "/inventory/home" ? "none" : "var(--overlay-box-shadow, 0 8px 24px rgba(0, 0, 0, 0.25))"};
    position: relative;
    overflow: hidden; // Ensure content doesn't overflow
    display: flex;
    flex-direction: column; // Add this to ensure proper content flow
    background-color: ${props.path === "/inventory/home" ? "transparent" : vscBackground};
  `}
`;

=======
import { incrementFreeTrialCount } from "../util/freeTrial";
import { ROUTES } from "../util/navigation";
import TextDialog from "./dialogs";
import Footer from "./Footer";
import { isNewUserOnboarding, useOnboardingCard } from "./OnboardingCard";
import OSRContextMenu from "./OSRContextMenu";
import PostHogPageView from "./PosthogPageView";

const LayoutTopDiv = styled(CustomScrollbarDiv)`
  height: 100%;
  border-radius: ${defaultBorderRadius};
  position: relative;
  overflow-x: hidden;
`;

const GridDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100vh;
  overflow-x: visible;
`;

>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const onboardingCard = useOnboardingCard();
  const { pathname } = useLocation();

<<<<<<< HEAD
  const historyLength = useSelector((state: RootState) => state.state.history.length);

  const dialogMessage = useSelector(
    (state: RootState) => state.uiState.dialogMessage,
  );
  const showDialog = useSelector(
    (state: RootState) => state.uiState.showDialog,
=======
  const configError = useAppSelector((state) => state.config.configError);

  const hasFatalErrors = useMemo(() => {
    return configError?.some((error) => error.fatal);
  }, [configError]);

  const dialogMessage = useAppSelector((state) => state.ui.dialogMessage);

  const showDialog = useAppSelector((state) => state.ui.showDialog);

  useWebviewListener(
    "newSession",
    async () => {
      navigate(ROUTES.HOME);
      await dispatch(
        saveCurrentSession({
          openNewSession: true,
          generateTitle: true,
        }),
      );
      dispatch(exitEditMode());
    },
    [],
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  );

  useWebviewListener(
    "isContinueInputFocused",
    async () => {
      return false;
    },
    [location.pathname],
    location.pathname === ROUTES.HOME,
  );

<<<<<<< HEAD
  const showInteractiveContinueTutorial = useSelector((state: RootState) => state.state.showInteractiveContinueTutorial);

  const timeline = useSelector((state: RootState) => state.state.history);
=======
  useWebviewListener(
    "focusContinueInputWithNewSession",
    async () => {
      navigate(ROUTES.HOME);
      await dispatch(
        saveCurrentSession({
          openNewSession: true,
          generateTitle: true,
        }),
      );
      dispatch(exitEditMode());
    },
    [location.pathname],
    location.pathname === ROUTES.HOME,
  );
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

  useWebviewListener(
    "addModel",
    async () => {
      navigate("/models");
    },
    [navigate],
  );

  useWebviewListener(
    "navigateTo",
    async (data) => {
      if (data.toggle && location.pathname === data.path) {
        navigate("/");
      } else {
        navigate(data.path);
      }
    },
    [location, navigate],
  );

  useWebviewListener(
    "incrementFtc",
    async () => {
      incrementFreeTrialCount();
    },
    [],
  );

  useWebviewListener(
    "updateApplyState",
    async (state) => {
      // dispatch(
      //   updateCurCheckpoint({
      //     filepath: state.filepath,
      //     content: state.fileContent,
      //   }),
      // );
      dispatch(updateApplyState(state));
    },
    [],
  );

  useWebviewListener(
    "openOnboardingCard",
    async () => {
      onboardingCard.open("Best");
    },
    [],
  );

  useWebviewListener(
    "setupLocalConfig",
    async () => {
      onboardingCard.open("Local");
    },
    [],
  );

  useWebviewListener(
    "focusEdit",
    async () => {
      await dispatch(
        saveCurrentSession({
          openNewSession: false,
          // Because this causes a lag before Edit mode is focused. TODO just have that happen in background
          generateTitle: false,
        }),
      );
      dispatch(newSession());
      dispatch(focusEdit());
      dispatch(setMode("edit"));
    },
    [],
  );

  useWebviewListener(
    "focusEditWithoutClear",
    async () => {
      await dispatch(
        saveCurrentSession({
          openNewSession: true,
          generateTitle: true,
        }),
      );
      dispatch(focusEdit());
      dispatch(setMode("edit"));
    },
    [],
  );

  useWebviewListener(
    "addCodeToEdit",
    async (payload) => {
      dispatch(addCodeToEdit(payload));
    },
    [navigate],
  );

  useWebviewListener(
    "setEditStatus",
    async ({ status, fileAfterEdit }) => {
      dispatch(setEditStatus({ status, fileAfterEdit }));
    },
    [],
  );

  const isInEditMode = useAppSelector(selectIsInEditMode);
  useWebviewListener("exitEditMode", async () => {
    if (!isInEditMode) {
      return;
    }
    dispatch(
      loadLastSession({
        saveCurrentSession: false,
      }),
    );
    dispatch(exitEditMode());
  });

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (isMetaEquivalentKeyPressed(event) && event.code === "KeyC") {
        const selection = window.getSelection()?.toString();
        if (selection) {
          // Copy to clipboard
          setTimeout(() => {
            navigator.clipboard.writeText(selection);
          }, 100);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
<<<<<<< HEAD
  }, [timeline]);

  useWebviewListener(
    "addModel",
    async () => {
      navigate("/models");
    },
    [navigate],
  );

  // useWebviewListener("openSettings", async () => {
  //   ideMessenger.post("openConfigJson", undefined);
  // });

  useWebviewListener(
    "viewHistory",
    async () => {
      // Toggle the history page / main page
      if (location.pathname === "/history") {
        navigate("/");
      } else {
        navigate("/history", { state: { from: location.pathname } });
      }
    },
    [location, navigate],
  );

  useWebviewListener("indexProgress", async (data) => {
    setIndexingState(data);
  });

  useWebviewListener(
    "addApiKey",
    async () => {
      navigate("/apiKeyOnboarding");
    },
    [navigate],
  );

  useWebviewListener(
    "openOnboarding",
    async () => {
      navigate("/onboarding");
    },
    [navigate],
  );

  useWebviewListener(
    "incrementFtc",
    async () => {
      const u = getLocalStorage("ftc");
      if (u) {
        setLocalStorage("ftc", u + 1);
      } else {
        setLocalStorage("ftc", 1);
      }
    },
    [],
  );

  useWebviewListener(
    "setupLocalModel",
    async () => {
      ideMessenger.post("completeOnboarding", {
        mode: "localAfterFreeTrial",
      });
      navigate("/localOnboarding");
    },
    [navigate],
  );

  const [indexingState, setIndexingState] = useState<IndexingProgressUpdate>({
    desc: "Loading indexing config",
    progress: 0.0,
    status: "loading",
  });

  if (window.isPearOverlay) {
    return <OverlayContainer isPearOverlay={window.isPearOverlay} path={location.pathname}>
      <GlobalStyle />
      <Outlet />
    </OverlayContainer>;
  }

  return (
    <div className="bg-sidebar-background flex flex-col gap-1 h-screen">
      {
      <TextDialog
        showDialog={showDialog}
        onEnter={() => {
          dispatch(setShowDialog(false));
        }}
        onClose={() => {
          dispatch(setShowDialog(false));
        }}
        message={dialogMessage}
      />}

      <PostHogPageView />
      <Outlet />
      <BottomMessageDiv
        displayOnBottom={displayBottomMessageOnBottom}
        onMouseEnter={() => dispatch(setBottomMessageCloseTimeout(undefined))}
        onMouseLeave={(e) => {
          if (!e.buttons) {
            dispatch(setBottomMessage(undefined));
          }
        }}
        hidden={!bottomMessage}
      >
        {bottomMessage}
      </BottomMessageDiv>
      <div
        style={{ fontSize: `${getFontSize() - 4}px` }}
        id="tooltip-portal-div"
      />
    </div>
=======
  }, []);

  useEffect(() => {
    if (
      isNewUserOnboarding() &&
      (location.pathname === "/" || location.pathname === "/index.html")
    ) {
      onboardingCard.open("Quickstart");
    }
  }, [location]);

  return (
    <AuthProvider>
      <LayoutTopDiv>
        <OSRContextMenu />
        <div
          style={{
            scrollbarGutter: "stable both-edges",
            minHeight: "100%",
            display: "grid",
            gridTemplateRows: "1fr auto",
          }}
        >
          <TextDialog
            showDialog={showDialog}
            onEnter={() => {
              dispatch(setShowDialog(false));
            }}
            onClose={() => {
              dispatch(setShowDialog(false));
            }}
            message={dialogMessage}
          />

          <GridDiv className="">
            <PostHogPageView />
            <Outlet />

            {hasFatalErrors && pathname !== ROUTES.CONFIG_ERROR && (
              <div
                className="z-50 cursor-pointer bg-red-600 p-4 text-center text-white"
                role="alert"
                onClick={() => navigate(ROUTES.CONFIG_ERROR)}
              >
                <strong className="font-bold">Error!</strong>{" "}
                <span className="block sm:inline">
                  Could not load config.json
                </span>
                <div className="mt-2 underline">Learn More</div>
              </div>
            )}
            <Footer />
          </GridDiv>
        </div>
        <div
          style={{ fontSize: `${getFontSize() - 4}px` }}
          id="tooltip-portal-div"
        />
      </LayoutTopDiv>
    </AuthProvider>
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  );
};

export default Layout;
