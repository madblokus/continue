import { Editor, JSONContent } from "@tiptap/react";
import { ContextItemWithId, InputModifiers } from "core";
import { useDispatch } from "react-redux";
import styled, { keyframes } from "styled-components";
<<<<<<< HEAD
import { defaultBorderRadius, lightGray, vscBackground } from "..";
import { useWebviewListener } from "../../hooks/useWebviewListener";
import { selectSlashCommands } from "../../redux/selectors";
import { newSession, setMessageAtIndex } from "../../redux/slices/stateSlice";
import { RootState } from "../../redux/store";
import ContextItemsPeek from "./ContextItemsPeek";
import TipTapEditor from "./TipTapEditor";
import { useMemo, memo, useState, useEffect, useCallback } from "react";
import { getContextProviders } from "../../integrations/util/integrationSpecificContextProviders";
import { getFontSize } from "../../util";
import { cn } from "@/lib/utils";
import { Tail } from "@/components/ui/tail";
=======
import { defaultBorderRadius, vscBackground } from "..";
import { selectSlashCommandComboBoxInputs } from "../../redux/selectors";
import ContextItemsPeek from "./ContextItemsPeek";
import TipTapEditor from "./TipTapEditor";
import { useAppSelector } from "../../redux/hooks";
import { ToolbarOptions } from "./InputToolbar";
import { useMemo } from "react";

interface ContinueInputBoxProps {
  isEditMode?: boolean;
  isLastUserInput: boolean;
  isMainInput?: boolean;
  onEnter: (
    editorState: JSONContent,
    modifiers: InputModifiers,
    editor: Editor,
  ) => void;
  editorState?: JSONContent;
  contextItems?: ContextItemWithId[];
  hidden?: boolean;
  inputId: string; // used to keep track of things per input in redux
}

const EDIT_DISALLOWED_CONTEXT_PROVIDERS = [
  "codebase",
  "tree",
  "open",
  "web",
  "diff",
  "folder",
  "search",
  "debugger",
  "repo-map",
];
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

const gradient = keyframes`
  0% {
    background-position: 0px 0;
  }
  100% {
    background-position: 100em 0;
  }
`;

const GradientBorder = styled.div<{
  borderRadius?: string;
  borderColor?: string;
  loading: 0 | 1;
}>`
  border-radius: ${(props) => props.borderRadius || "0"};
  padding: ${(props) => props.loading ? "2px" : "0"};
  background: ${(props) =>
    props.borderColor
      ? props.borderColor
      : `repeating-linear-gradient(
      101.79deg,
      #4DA587 0%,
      #EBF5DF 16%,
      #4DA587 33%,
      #EBF5DF 55%,
      #4DA587 67%,
      #4DA587 85%,
      #4DA587 99%
    )`};
  animation: ${(props) => (props.loading ? gradient : "")} 6s linear infinite;
  background-size: 200% 200%;
  width: 100% - 0.6rem;
  display: flex;
  flex-direction: row;
  align-items: center;
<<<<<<< HEAD
  position: relative;
`;

const wave = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.85); opacity: 0.5; }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  color: ${lightGray};
  font-size: ${getFontSize() - 3}px;
  padding: 0 0.6rem;
  width: 100%;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  margin-top 8px;
`;

const Dot = styled.div<{ delay: number }>`
  width: 3px;
  height: 3px;
  background-color: #4DA587;
  border-radius: 50%;
  animation: ${wave} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: inherit;
    border-radius: inherit;
    animation: ${pulse} 1.5s ease-in-out infinite;
    animation-delay: ${props => props.delay}s;
  }
`;

interface ContinueInputBoxProps {
  isLastUserInput: boolean;
  isMainInput?: boolean;
  onEnter: (editorState: JSONContent, modifiers: InputModifiers) => void;
  editorState?: JSONContent;
  contextItems?: ContextItemWithId[];
  hidden?: boolean;
  source?: "perplexity" | "continue";
  className?: string;
  onHeightChange?: (height: number) => void;
}

const ContinueInputBox = memo(function ContinueInputBox({
  isLastUserInput,
  isMainInput,
  onEnter,
  editorState,
  contextItems,
  hidden,
  source = "continue",
  className,
  onHeightChange,
}: ContinueInputBoxProps) {
  const dispatch = useDispatch();

  const active = useSelector((store: RootState) => {
    switch (source) {
      case "perplexity":
        return store.state.perplexityActive;
      default:
        return store.state.active;
    }
  });

  const availableSlashCommands = useSelector(selectSlashCommands);
  let availableContextProviders = getContextProviders();
  const bareChatMode = source === "continue";

  useWebviewListener(
    "newSessionWithPrompt",
    async (data) => {
      if (isMainInput) {
        dispatch(newSession({ session: undefined, source }));
        dispatch(
          setMessageAtIndex({
            message: { role: "user", content: data.prompt },
            index: 0,
            contextItems: [],
            source,
          }),
        );
      }
    },
    [isMainInput],
  );
=======
`;

function ContinueInputBox(props: ContinueInputBoxProps) {
  const isStreaming = useAppSelector((state) => state.session.isStreaming);
  const availableSlashCommands = useAppSelector(
    selectSlashCommandComboBoxInputs,
  );
  const availableContextProviders = useAppSelector(
    (state) => state.config.config.contextProviders,
  );
  const editModeState = useAppSelector((state) => state.editModeState);

  const filteredSlashCommands = props.isEditMode ? [] : availableSlashCommands;
  const filteredContextProviders = useMemo(() => {
    if (!props.isEditMode) {
      return availableContextProviders ?? [];
    }

    return (
      availableContextProviders?.filter(
        (provider) =>
          !EDIT_DISALLOWED_CONTEXT_PROVIDERS.includes(provider.title),
      ) ?? []
    );
  }, [availableContextProviders]);

  const historyKey = props.isEditMode ? "edit" : "chat";
  const placeholder = props.isEditMode
    ? "Describe how to modify the code - use '#' to add files"
    : undefined;

  const toolbarOptions: ToolbarOptions = props.isEditMode
    ? {
        hideAddContext: false,
        hideImageUpload: false,
        hideUseCodebase: true,
        hideSelectModel: false,
        hideTools: true,
        enterText: editModeState.editStatus === "accepting" ? "Retry" : "Edit",
      }
    : {};
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

  // check if lastActiveIntegration === source, if so, activate gradient border and tiptap editor
  // actually can get history here and check if last message of passed in source was a lastUserInput
  // Preserve editor state between renders
  const [preservedState, setPreservedState] = useState(editorState);

  useEffect(() => {
    if (editorState) {
      setPreservedState(editorState);
    }
  }, [editorState]);

  const handleEditorChange = useCallback((newState: JSONContent) => {
    setPreservedState(newState);
  }, []);

  return (
<<<<<<< HEAD
    <div>
      <GradientBorder
        loading={active && isLastUserInput ? 1 : 0}
        isFirst={false}
        isLast={false}
        borderColor={active && isLastUserInput ? undefined : vscBackground}
        borderRadius={"12px"}
      >
        <TipTapEditor
          editorState={preservedState}
          onEnter={onEnter}
          isMainInput={isMainInput}
          availableContextProviders={availableContextProviders}
          availableSlashCommands={
            bareChatMode ? undefined : availableSlashCommands
          }
          source={source}
          onChange={handleEditorChange}
          onHeightChange={onHeightChange}
        />
        {!isMainInput && !(active&& isLastUserInput ? 1 : 0) && <Tail/>}
      </GradientBorder>

      {active && isLastUserInput && (
        <LoadingContainer>
          <DotsContainer>
            {[0, 1, 2].map((i) => (
              <Dot key={i} delay={i * 0.2} />
            ))}
          </DotsContainer>
          <span style={{ marginTop: "4px" }}>Responding...</span>
        </LoadingContainer>
      )}
      <ContextItemsPeek contextItems={contextItems}></ContextItemsPeek>
=======
    <div className={`${props.hidden ? "hidden" : ""}`}>
      <div className={`relative flex flex-col px-2`}>
        <GradientBorder
          loading={isStreaming && props.isLastUserInput ? 1 : 0}
          borderColor={
            isStreaming && props.isLastUserInput ? undefined : vscBackground
          }
          borderRadius={defaultBorderRadius}
        >
          <TipTapEditor
            editorState={props.editorState}
            onEnter={props.onEnter}
            placeholder={placeholder}
            isMainInput={props.isMainInput ?? false}
            availableContextProviders={filteredContextProviders}
            availableSlashCommands={filteredSlashCommands}
            historyKey={historyKey}
            toolbarOptions={toolbarOptions}
            inputId={props.inputId}
          />
        </GradientBorder>
      </div>
      <ContextItemsPeek
        contextItems={props.contextItems}
        isCurrentContextPeek={props.isLastUserInput}
      />
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    </div>
  );
});

export default ContinueInputBox;
