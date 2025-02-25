<<<<<<< HEAD
import {
  PhotoIcon as OutlinePhotoIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowTurnDownLeftIcon
} from "@heroicons/react/16/solid";
import { Button } from "@/components/ui/button";
import { InputModifiers } from "core";
import { modelSupportsImages } from "core/llm/autodetect";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
=======
import { AtSymbolIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { InputModifiers } from "core";
import { modelSupportsImages, modelSupportsTools } from "core/llm/autodetect";
import { useRef } from "react";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import styled from "styled-components";
import {
  defaultBorderRadius,
  lightGray,
  vscForeground,
  vscButtonForeground,
  vscButtonBackground,

  vscInputBackground,
} from "..";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectUseActiveFile } from "../../redux/selectors";
import { selectDefaultModel } from "../../redux/slices/configSlice";
import {
  selectHasCodeToEdit,
  selectIsInEditMode,
} from "../../redux/slices/sessionSlice";
import { exitEditMode } from "../../redux/thunks";
import { loadLastSession } from "../../redux/thunks/session";
import {
  getAltKeyLabel,
  getFontSize,
  getMetaKeyLabel,
  isMetaEquivalentKeyPressed,
} from "../../util";
<<<<<<< HEAD
import { setDefaultModel } from "../../redux/slices/stateSlice";
import { RootState } from "@/redux/store";
import { useLocation } from "react-router-dom";
import { ShortcutButton } from "../ui/shortcutButton";
import { cn } from "@/lib/utils";


const StyledDiv = styled.div<{ isHidden: boolean }>`
  display: ${(props) => (props.isHidden ? "none" : "flex")};
  justify-content: space-between;
  gap: 4px;
  align-items: flex-end;
  z-index: 10;
=======
import { ToolTip } from "../gui/Tooltip";
import ModelSelect from "../modelSelection/ModelSelect";
import HoverItem from "./InputToolbar/HoverItem";
import ToggleToolsButton from "./InputToolbar/ToggleToolsButton";

const StyledDiv = styled.div<{ isHidden?: boolean }>`
  padding-top: 4px;
  justify-content: space-between;
  gap: 1px;
  background-color: ${vscInputBackground};
  align-items: center;
  font-size: ${getFontSize() - 2}px;
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  cursor: ${(props) => (props.isHidden ? "default" : "text")};
  pointer-events: ${(props) => (props.isHidden ? "none" : "auto")};
<<<<<<< HEAD
=======
  user-select: none;

  & > * {
    flex: 0 0 auto;
  }
`;

const EnterButton = styled.button`
  all: unset;
  padding: 2px 4px;
  display: flex;
  align-items: center;
  background-color: ${lightGray}33;
  border-radius: ${defaultBorderRadius};
  color: ${vscForeground};
  cursor: pointer;

  :disabled {
    cursor: wait;
  }
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
`;

export interface ToolbarOptions {
  hideUseCodebase?: boolean;
  hideImageUpload?: boolean;
  hideAddContext?: boolean;
  enterText?: string;
  hideSelectModel?: boolean;
  hideTools?: boolean;
}

interface InputToolbarProps {
  onEnter?: (modifiers: InputModifiers) => void;
  onAddContextItem?: () => void;
  onAddSlashCommand?: () => void;
  onClick?: () => void;
  onImageFileSelected?: (file: File) => void;
  hidden?: boolean;
<<<<<<< HEAD
  showNoContext: boolean;
  source?: 'perplexity' | 'continue';
=======
  activeKey: string | null;
  toolbarOptions?: ToolbarOptions;
  disabled?: boolean;
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
}

function InputToolbar(props: InputToolbarProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
<<<<<<< HEAD
  const [fileSelectHovered, setFileSelectHovered] = useState(false);
  const defaultModel = useSelector(defaultModelSelector);
  const bareChatMode = props.source === 'continue';
  const perplexityMode = props.source === 'perplexity';

  const useActiveFile = useSelector(selectUseActiveFile);
  const allModels = useSelector(
    (state: RootState) => state.state.config.models,
  );

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (perplexityMode) {
      const perplexity = allModels.find((model) =>
        model?.title?.toLowerCase().includes("perplexity"),
      );
      dispatch(setDefaultModel({ title: perplexity?.title }));
    }
  }, [location, allModels]);

  return (
    <StyledDiv
      isHidden={props.hidden}
      onClick={props.onClick}
      id="input-toolbar"
    >
      <div className="flex-grow">
        {!perplexityMode && (
          <div className="flex gap-3 items-center">
            <ShortcutButton
              keys={["⎇", "⏎"]}
              label="Use current file"
              onClick={() => ({
                useCodebase: false,
                noContext: !useActiveFile,
              })}
            />
            {/* TODO:  add onClick to add file*/}
            <ShortcutButton
              keys={[getMetaKeyLabel(), "⏎"]}
              onClick={() => {
                props.onEnter({
                  useCodebase: true,
                  noContext: !useActiveFile,
                });
              }}
              label="Use codebase"
            />
          </div>
        )}
      </div>


      {/* <span className="flex gap-2 items-center whitespace-nowrap">
          <>
            {!perplexityMode && <ModelSelect />}
            <StyledSpan
              onClick={(e) => {
                props.onAddContextItem();
              }}
              className="hover:underline cursor-pointer"
            >
              Add Context{" "}
              <PlusIcon className="h-2.5 w-2.5" aria-hidden="true" />
            </StyledSpan>
          </>
          {defaultModel &&
            modelSupportsImages(
              defaultModel.provider,
              defaultModel.model,
              defaultModel.title,
              defaultModel.capabilities,
            ) && (
              <span
                className="ml-1 mt-0.5 cursor-pointer"
                onMouseLeave={() => setFileSelectHovered(false)}
                onMouseEnter={() => setFileSelectHovered(true)}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept=".jpg,.jpeg,.png,.gif,.svg,.webp"
                  onChange={(e) => {
                    for (const file of e.target.files) {
                      props.onImageFileSelected(file);
                    }
                  }}
                />
                {fileSelectHovered ? (
                  <SolidPhotoIcon
                    width="1.4em"
                    height="1.4em"
                    color={lightGray}
                    onClick={(e) => {
                      fileInputRef.current?.click();
                    }}
                  />
                ) : (
                  <OutlinePhotoIcon
                    width="1.4em"
                    height="1.4em"
                    color={lightGray}
                    onClick={(e) => {
                      fileInputRef.current?.click();
                    }}
                  />
                )}
              </span>
            )}
        </span> */}

      {/* {props.showNoContext ? (
            <span
              style={{
                color: props.usingCodebase ? vscBadgeBackground : lightGray,
                backgroundColor: props.usingCodebase
                  ? lightGray + "33"
                  : undefined,
                borderRadius: defaultBorderRadius,
                padding: "2px 4px",
              }}
            >
              {getAltKeyLabel()} ⏎{" "}
              {useActiveFile ? "No context" : "Use active file"}
            </span>
          ) : !bareChatMode ? (
            <StyledSpan
              style={{
                color: props.usingCodebase ? vscBadgeBackground : lightGray,
                backgroundColor: props.usingCodebase
                  ? lightGray + "33"
                  : undefined,
                borderRadius: defaultBorderRadius,
                padding: "2px 4px",
              }}
              onClick={(e) => {
                props.onEnter({
                  useCodebase: true,
                  noContext: !useActiveFile,
                });
              }}
              className={"hover:underline cursor-pointer float-right"}
            >
              {getMetaKeyLabel()} ⏎ Use codebase
            </StyledSpan>
          ) : null} */}
      <Button
        className={cn("gap-1 h-6 text-xs px-2", perplexityMode ?
          "bg-[#08a6a1] text-white"
          : "bg-[#AFF349] text-[#005A4E]")}

        onClick={(e) => {
          props.onEnter?.({
            useCodebase: false,
            noContext: !useActiveFile
          });
        }}
      >
        <ArrowTurnDownLeftIcon width="12px" height="12px" />
        Send
      </Button>
      {/* <EnterButton
            offFocus={props.usingCodebase}
            onClick={(e) => {
              props.onEnter({
                useCodebase: isMetaEquivalentKeyPressed(e),
                noContext: useActiveFile ? e.altKey : !e.altKey,
              });
=======
  const defaultModel = useAppSelector(selectDefaultModel);
  const useActiveFile = useAppSelector(selectUseActiveFile);
  const isInEditMode = useAppSelector(selectIsInEditMode);
  const hasCodeToEdit = useAppSelector(selectHasCodeToEdit);
  const isEditModeAndNoCodeToEdit = isInEditMode && !hasCodeToEdit;
  const isEnterDisabled = props.disabled || isEditModeAndNoCodeToEdit;
  const toolsSupported =
    defaultModel &&
    modelSupportsTools(defaultModel) &&
    !props.toolbarOptions?.hideTools;

  const supportsImages =
    defaultModel &&
    modelSupportsImages(
      defaultModel.provider,
      defaultModel.model,
      defaultModel.title,
      defaultModel.capabilities,
    );

  return (
    <>
      <StyledDiv
        isHidden={props.hidden}
        onClick={props.onClick}
        id="input-toolbar"
        className="find-widget-skip flex"
      >
        <div className="flex items-center justify-start gap-2 whitespace-nowrap">
          <ModelSelect />
          <div className="xs:flex -mb-1 hidden items-center text-gray-400 transition-colors duration-200">
            {props.toolbarOptions?.hideImageUpload ||
              (supportsImages && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".jpg,.jpeg,.png,.gif,.svg,.webp"
                    onChange={(e) => {
                      const files = e.target?.files ?? [];
                      for (const file of files) {
                        props.onImageFileSelected?.(file);
                      }
                    }}
                  />
                  <HoverItem>
                    <PhotoIcon
                      className="h-4 w-4 hover:brightness-125"
                      data-tooltip-id="image-tooltip"
                      onClick={(e) => {
                        fileInputRef.current?.click();
                      }}
                    />
                    <ToolTip id="image-tooltip" place="top-middle">
                      Attach an image
                    </ToolTip>
                  </HoverItem>
                </>
              ))}
            {props.toolbarOptions?.hideAddContext || (
              <HoverItem onClick={props.onAddContextItem}>
                <AtSymbolIcon
                  data-tooltip-id="add-context-item-tooltip"
                  className="h-4 w-4 hover:brightness-125"
                />

                <ToolTip id="add-context-item-tooltip" place="top-middle">
                  Add context (files, docs, urls, etc.)
                </ToolTip>
              </HoverItem>
            )}

            <ToggleToolsButton disabled={!toolsSupported} />
          </div>
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap text-gray-400">
          {!props.toolbarOptions?.hideUseCodebase && !isInEditMode && (
            <div
              className={`${toolsSupported ? "md:flex" : "sm:flex"} hover:underline" hidden transition-colors duration-200`}
            >
              {props.activeKey === "Alt" ? (
                <HoverItem className="underline">
                  {`${getAltKeyLabel()}⏎
                  ${useActiveFile ? "No active file" : "Active file"}`}
                </HoverItem>
              ) : (
                <HoverItem
                  className={props.activeKey === "Meta" ? "underline" : ""}
                  onClick={(e) =>
                    props.onEnter?.({
                      useCodebase: true,
                      noContext: !useActiveFile,
                    })
                  }
                >
                  <span data-tooltip-id="add-codebase-context-tooltip">
                    {getMetaKeyLabel()}⏎ @codebase
                  </span>
                  <ToolTip id="add-codebase-context-tooltip" place="top-end">
                    Submit with the codebase as context ({getMetaKeyLabel()}⏎)
                  </ToolTip>
                </HoverItem>
              )}
            </div>
          )}

          {isInEditMode && (
            <HoverItem
              className="hidden hover:underline sm:flex"
              onClick={async (e) => {
                await dispatch(
                  loadLastSession({
                    saveCurrentSession: false,
                  }),
                );
                dispatch(exitEditMode());
              }}
            >
              <span>
                <i>Esc</i> to exit
              </span>
            </HoverItem>
          )}

          <EnterButton
            data-testid="submit-input-button"
            onClick={async (e) => {
              if (props.onEnter) {
                props.onEnter({
                  useCodebase: isMetaEquivalentKeyPressed(e as any),
                  noContext: useActiveFile ? e.altKey : !e.altKey,
                });
              }
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
            }}
            disabled={isEnterDisabled}
          >
<<<<<<< HEAD
            ⏎ Send
          </EnterButton> */}
    </StyledDiv>
=======
            <span className="hidden md:inline">
              ⏎ {props.toolbarOptions?.enterText ?? "Enter"}
            </span>
            <span className="md:hidden">⏎</span>
          </EnterButton>
        </div>
      </StyledDiv>
    </>
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  );
}

export default InputToolbar;
