import styled from "styled-components";
import {
  defaultBorderRadius,
  lightGray,
  vscBackground,
  vscEditorBackground,
  vscForeground,
} from "../../components";
import { getPlatform, isJetBrains } from "../../util";
import { ToolTip } from "../../components/gui/Tooltip";

const GridDiv = styled.div`
  display: grid;
<<<<<<< HEAD:gui/src/components/dialogs/KeyboardShortcuts.tsx
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 1.3rem;
  padding: 2rem;
  justify-items: center;
  align-items: center;
  overflow-y: auto;
=======
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 1rem;
  padding: 1rem 0;
  justify-items: center;
  align-items: center;
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d:gui/src/pages/More/KeyboardShortcuts.tsx
`;

const StyledKeyDiv = styled.div`
  border: 0.5px solid ${lightGray};
  border-radius: ${defaultBorderRadius};
  padding: 2px;
  color: ${vscForeground};

  width: 16px;
  height: 16px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

<<<<<<< HEAD:gui/src/components/dialogs/KeyboardShortcuts.tsx
const keyToName = {
  "CMD": "Cmd",
  "CTRL": "Ctrl",
  "SHIFT": "Shift",
  "ENTER": "Enter",
  "BACKSPACE": "Backspace",
  "ALT": "Option",
  "⎇": "ALT",
=======
const keyToName: { [key: string]: string } = {
  "⌘": "Cmd",
  "⌃": "Ctrl",
  "⇧": "Shift",
  "⏎": "Enter",
  "⌫": "Backspace",
  "⌥": "Option",
  "⎇": "Alt",
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d:gui/src/pages/More/KeyboardShortcuts.tsx
};

function KeyDiv({ text }: { text: string }) {
  return (
    <>
      <span className="monaco-keybinding-key leading-3 tracking-widest" data-tooltip-id={`header_button_${text}`}>
        {text}
<<<<<<< HEAD:gui/src/components/dialogs/KeyboardShortcuts.tsx
      </span>
      {tooltipPortalDiv &&
        ReactDOM.createPortal(
          <StyledTooltip id={`header_button_${text}`} place="bottom">
            {keyToName[text]}
          </StyledTooltip>,
          tooltipPortalDiv,
        )}
=======
      </StyledKeyDiv>

      <ToolTip id={`header_button_${text}`} place="bottom">
        {keyToName[text]}
      </ToolTip>
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d:gui/src/pages/More/KeyboardShortcuts.tsx
    </>
  );
}

interface KeyboardShortcutProps {
  mac: string;
  windows: string;
  description: string;
}

function KeyboardShortcut(props: KeyboardShortcutProps) {
  const shortcut = getPlatform() === "mac" ? props.mac : props.windows;
  return (
<<<<<<< HEAD:gui/src/components/dialogs/KeyboardShortcuts.tsx
    <ShortcutContainer>
      <span
        className="tracking-wide"
        style={{
          color: vscForeground,
        }}
      >
        {props.description}
      </span>
      <ShortcutKeys className="flex float-right monaco-keybinding">
=======
    <div className="flex w-full items-center justify-between gap-x-4">
      <span className="text-sm">{props.description}</span>
      <div className="float-right flex gap-2">
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d:gui/src/pages/More/KeyboardShortcuts.tsx
        {shortcut.split(" ").map((key, i) => {
          return <KeyDiv key={i} text={key}></KeyDiv>;
        })}
      </ShortcutKeys>
    </ShortcutContainer>
  );
}

const ShortcutContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 400px) {
    flex-direction: column;
    align-items: flex-start;

    & > .monaco-keybinding {
      margin-top: 0.5rem;
    }
  }
`;

const ShortcutKeys = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const vscodeShortcuts: KeyboardShortcutProps[] = [
  {
<<<<<<< HEAD:gui/src/components/dialogs/KeyboardShortcuts.tsx
    mac: "CMD L",
    windows: "CTRL L",
    description: "New Session / Add Code",
=======
    mac: "⌘ '",
    windows: "⌃ '",
    description: "Toggle Selected Model",
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d:gui/src/pages/More/KeyboardShortcuts.tsx
  },
  {
    mac: "CMD I",
    windows: "CTRL I",
    description: "Quick Edit Selected code",
  },
  {
<<<<<<< HEAD:gui/src/components/dialogs/KeyboardShortcuts.tsx
    mac: "CMD \\",
    windows: "CTRL \\",
    description: "Big Chat",
  },
  {
    mac: "CMD :",
    windows: "CTRL :",
    description: "Close Chat",
  },
  {
    mac: "CMD H",
    windows: "CTRL H",
    description: "Open History",
  },
  {
    mac: "CMD SHIFT L",
    windows: "CTRL SHIFT L",
    description: "Append Code",
  },
  {
    mac: "CMD SHIFT ENTER",
    windows: "CTRL SHIFT ENTER",
    description: "Accept Diff",
  },
  {
    mac: "CMD SHIFT BACKSPACE",
    windows: "CTRL SHIFT BACKSPACE",
    description: "Reject Diff",
  },
  {
    mac: "CMD ALT Y",
    windows: "CTRL ALT Y",
    description: "Accept Top Change in Diff",
  },
  {
    mac: "CMD ALT N",
    windows: "CTRL ALT N",
    description: "Reject Top Change in Diff",
  },
  {
    mac: "CMD ALT L",
    windows: "CTRL ALT L",
    description: "Toggle PearAI Sidebar",
  },
  {
    mac: "CMD SHIFT R",
    windows: "CTRL SHIFT R",
    description: "Debug Terminal",
=======
    mac: "⌘ L",
    windows: "⌃ L",
    description:
      "New Chat / New Chat With Selected Code / Close Continue Sidebar If Chat Already In Focus",
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d:gui/src/pages/More/KeyboardShortcuts.tsx
  },
  {
    mac: "CMD BACKSPACE",
    windows: "CTRL BACKSPACE",
    description: "Cancel response",
  },
  {
<<<<<<< HEAD:gui/src/components/dialogs/KeyboardShortcuts.tsx
    mac: "CMD K CMD M",
    windows: "CTRL K CTRL M",
    description: "Toggle Full Screen",
  },
  {
    mac: "CMD '",
    windows: "CTRL '",
    description: "Toggle Selected Model",
  },
];

const jetbrainsShortcuts: KeyboardShortcutProps[] = [
  {
    mac: "CMD J",
    windows: "CTRL J",
    description: "Append Code + New Session",
  },
  {
    mac: "CMD SHIFT J",
    windows: "CTRL SHIFT J",
    description: "Select Code",
  },
  {
    mac: "CMD I",
    windows: "CTRL I",
    description: "Edit highlighted code",
  },
  {
    mac: "CMD SHIFT I",
    windows: "CTRL SHIFT I",
    description: "Toggle inline edit focus",
  },
  {
    mac: "CMD SHIFT ENTER",
    windows: "CTRL SHIFT ENTER",
    description: "Accept Diff",
  },
  {
    mac: "CMD SHIFT BACKSPACE",
    windows: "CTRL SHIFT BACKSPACE",
    description: "Reject Diff",
  },
  {
    mac: "ALT SHIFT J",
    windows: "ALT SHIFT J",
=======
    mac: "⌘ ⇧ I",
    windows: "⌃ ⇧ I",
    description: "Toggle inline edit focus",
  },
  {
    mac: "⌘ ⇧ L",
    windows: "⌃ ⇧ L",
    description:
      "Focus Current Chat / Add Selected Code To Current Chat / Close Continue Sidebar If Chat Already In Focus",
  },
  {
    mac: "⌘ ⇧ R",
    windows: "⌃ ⇧ R",
    description: "Debug Terminal",
  },
  {
    mac: "⌘ ⇧ ⌫",
    windows: "⌃ ⇧ ⌫",
    description: "Reject Diff",
  },
  {
    mac: "⌘ ⇧ ⏎",
    windows: "⌃ ⇧ ⏎",
    description: "Accept Diff",
  },
  {
    mac: "⌥ ⌘ N",
    windows: "Alt ⌃ N",
    description: "Reject Top Change in Diff",
  },
  {
    mac: "⌥ ⌘ Y",
    windows: "Alt ⌃ Y",
    description: "Accept Top Change in Diff",
  },
  {
    mac: "⌘ K ⌘ A",
    windows: "⌃ K ⌃ A",
    description: "Toggle Autocomplete Enabled",
  },
  {
    mac: "⌘ K ⌘ M",
    windows: "⌃ K ⌃ M",
    description: "Toggle Full Screen",
  },
];

const jetbrainsShortcuts: KeyboardShortcutProps[] = [
  {
    mac: "⌘ '",
    windows: "⌃ '",
    description: "Toggle Selected Model",
  },
  {
    mac: "⌘ I",
    windows: "⌃ I",
    description: "Edit highlighted code",
  },
  {
    mac: "⌘ J",
    windows: "⌃ J",
    description:
      "New Chat / New Chat With Selected Code / Close Continue Sidebar If Chat Already In Focus",
  },
  {
    mac: "⌘ ⌫",
    windows: "⌃ ⌫",
    description: "Cancel response",
  },
  {
    mac: "⌘ ⇧ I",
    windows: "⌃ ⇧ I",
    description: "Toggle inline edit focus",
  },
  {
    mac: "⌘ ⇧ J",
    windows: "⌃ ⇧ J",
    description:
      "Focus Current Chat / Add Selected Code To Current Chat / Close Continue Sidebar If Chat Already In Focus",
  },
  {
    mac: "⌘ ⇧ ⌫",
    windows: "⌃ ⇧ ⌫",
    description: "Reject Diff",
  },
  {
    mac: "⌘ ⇧ ⏎",
    windows: "⌃ ⇧ ⏎",
    description: "Accept Diff",
  },
  {
    mac: "⌥ ⇧ J",
    windows: "Alt ⇧ J",
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d:gui/src/pages/More/KeyboardShortcuts.tsx
    description: "Quick Input",
  },
  {
    mac: "CMD ALT J",
    windows: "CTRL ALT J",
    description: "Toggle Sidebar",
  },
<<<<<<< HEAD:gui/src/components/dialogs/KeyboardShortcuts.tsx
  {
    mac: "CMD BACKSPACE",
    windows: "CTRL BACKSPACE",
    description: "Cancel response",
  },
  {
    mac: "CMD '",
    windows: "CTRL '",
    description: "Toggle Selected Model",
  },
=======
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d:gui/src/pages/More/KeyboardShortcuts.tsx
];

function KeyboardShortcuts() {
  return (
<<<<<<< HEAD:gui/src/components/dialogs/KeyboardShortcuts.tsx
    <div className="p-2">
      <GridDiv className="rounded-xl w-3/4 mx-auto" style={{
          backgroundColor: vscEditorBackground,
        }}>
      <h3 className="my-1 text-center mb-0">Keyboard Shortcuts</h3>
        {(isJetBrains() ? jetbrainsShortcuts : vscodeShortcuts).map(
          (shortcut, i) => {
            return (
              <KeyboardShortcut
                key={i}
                mac={shortcut.mac}
                windows={shortcut.windows}
                description={shortcut.description}
              />
            );
          },
        )}
      </GridDiv>
    </div>
  );
}

export default KeyboardShortcutsDialog;
=======
    <GridDiv>
      {(isJetBrains() ? jetbrainsShortcuts : vscodeShortcuts).map(
        (shortcut, i) => {
          return (
            <KeyboardShortcut
              key={i}
              mac={shortcut.mac}
              windows={shortcut.windows}
              description={shortcut.description}
            />
          );
        },
      )}
    </GridDiv>
  );
}

export default KeyboardShortcuts;
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d:gui/src/pages/More/KeyboardShortcuts.tsx
