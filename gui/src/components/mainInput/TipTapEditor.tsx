import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import HardBreak from "@tiptap/extension-hard-break";
import { Plugin } from "@tiptap/pm/state";
import { Editor, EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { ContextProviderDescription, InputModifiers } from "core";
import { rifWithContentsToContextItem } from "core/commands/util";
import { modelSupportsImages } from "core/llm/autodetect";
import { debounce } from "lodash";
import { usePostHog } from "posthog-js/react";
<<<<<<< HEAD
import { useContext, useEffect, useMemo, useRef, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
=======
import {
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import styled from "styled-components";
import {
  defaultBorderRadius,
  lightGray,
  vscBadgeBackground,
  vscCommandCenterActiveBorder,
  vscCommandCenterInactiveBorder,
  vscForeground,
  vscInputBackground,
<<<<<<< HEAD
  vscInputBorder,
  vscSidebarBorder,
  vscBackground,
  vscEditorBackground,
=======
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  vscInputBorderFocus,
} from "..";
import { IdeMessengerContext } from "../../context/IdeMessenger";
import { useSubmenuContextProviders } from "../../context/SubmenuContextProviders";
import { useInputHistory } from "../../hooks/useInputHistory";
import useIsOSREnabled from "../../hooks/useIsOSREnabled";
import useUpdatingRef from "../../hooks/useUpdatingRef";
import { useWebviewListener } from "../../hooks/useWebviewListener";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectUseActiveFile } from "../../redux/selectors";
import { selectDefaultModel } from "../../redux/slices/configSlice";
import {
  addCodeToEdit,
  clearCodeToEdit,
  selectHasCodeToEdit,
  selectIsInEditMode,
  setMainEditorContentTrigger,
  setNewestCodeblocksForInput,
} from "../../redux/slices/sessionSlice";
import { exitEditMode } from "../../redux/thunks";
import {
  loadLastSession,
  loadSession,
  saveCurrentSession,
} from "../../redux/thunks/session";
import {
  getFontSize,
  isJetBrains,
  isMetaEquivalentKeyPressed,
} from "../../util";
import { AddCodeToEdit } from "./AddCodeToEditExtension";
import { CodeBlockExtension } from "./CodeBlockExtension";
import { SlashCommand } from "./CommandsExtension";
<<<<<<< HEAD
import InputToolbar from "./InputToolbar";
import ContextToolbar from "./ContextToolbar";
=======
import { MockExtension } from "./FillerExtension";
import InputToolbar, { ToolbarOptions } from "./InputToolbar";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import { Mention } from "./MentionExtension";
import "./TipTapEditor.css";
import {
  getContextProviderDropdownOptions,
  getSlashCommandDropdownOptions,
} from "./getSuggestion";
import {
  handleJetBrainsOSRMetaKeyIssues,
  handleVSCMetaKeyIssues,
} from "./handleMetaKeyIssues";
import { ComboBoxItem } from "./types";
import { useLocation } from "react-router-dom";
import { TipTapContextMenu } from './TipTapContextMenu';

<<<<<<< HEAD
const InputBoxDiv = styled.div<{ isNewSession?: boolean }>`
	position: relative;
  resize: none;
  gap: 12px;
  padding: 12px;
=======
const InputBoxDiv = styled.div<{}>`
  resize: none;
  padding-bottom: 4px;
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  font-family: inherit;
  border-radius: 12px;
  margin: 0;
<<<<<<< HEAD
  width: 100%;
  background-color: ${vscEditorBackground};
  color: ${vscForeground};
  font-size: ${getFontSize()}px;
  line-height: 18px;
  word-break: break-word;
=======
  height: auto;
  width: 100%;
  background-color: ${vscInputBackground};
  color: ${vscForeground};

  border: 1px solid ${vscCommandCenterInactiveBorder};
  transition: border-color 0.15s ease-in-out;
  &:focus-within {
    border: 1px solid ${vscCommandCenterActiveBorder};
  }

  outline: none;
  font-size: ${getFontSize()}px;

  &:focus {
    outline: none;

    border: 0.5px solid ${vscInputBorderFocus};
  }
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

  &::placeholder {
    color: ${lightGray}cc;
  }

  // styles for ProseMirror placeholder
  .ProseMirror p.is-editor-empty:first-child::before {
    color: ${lightGray}cc;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
    white-space: pre-wrap; // Allow wrapping
    width: 100%; // Ensure it takes full width
  }

  display: flex;
  flex-direction: column;

  .ProseMirror {
    max-height: 300px;
    min-height: ${props => props.isNewSession ? `${getFontSize() * 6}px` : 'auto'}; // Approximately 2.5 lines of text
    // Alternative fixed height approach:
    // min-height: 60px;
    flex: 1;
    overflow-y: auto;
  }
`;

const HoverDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0.5;
  background-color: ${vscBadgeBackground};
	border-radius: ${defaultBorderRadius};
  color: ${vscForeground};
<<<<<<< HEAD
  z-index: 20;
=======
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  display: flex;
  align-items: center;
  justify-content: center;
	pointer-events: none;
`;

const HoverTextDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  color: ${vscForeground};
<<<<<<< HEAD
  z-index: 20;
=======
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  display: flex;
  align-items: center;
  justify-content: center;
	pointer-events: none;
`;

<<<<<<< HEAD
const getPlaceholder = (historyLength: number, location: any, source: 'perplexity' | 'continue') => {
=======
const IMAGE_RESOLUTION = 1024;
function getDataUrlForFile(
  file: File,
  img: HTMLImageElement,
): string | undefined {
  const targetWidth = IMAGE_RESOLUTION;
  const targetHeight = IMAGE_RESOLUTION;
  const scaleFactor = Math.min(
    targetWidth / img.width,
    targetHeight / img.height,
  );
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

  if (source === 'perplexity') {
    return historyLength === 0 ? "Ask Search about up-to-date information, like documentation changes." : "Ask a follow-up";
  }

  return historyLength === 0
    ? "Ask questions about code or make changes. Use / for commands, and @ to add context."
    : "Ask a follow-up";
};

export function getDataUrlForFile(file: File, img: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Error getting image data url: 2d context not found");
    return;
  }
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
  return dataUrl;
}

interface TipTapEditorProps {
  availableContextProviders: ContextProviderDescription[];
  availableSlashCommands: ComboBoxItem[];
  isMainInput: boolean;
  onEnter: (
    editorState: JSONContent,
    modifiers: InputModifiers,
    editor: Editor,
  ) => void;
  editorState?: JSONContent;
<<<<<<< HEAD
  source?: 'perplexity' | 'continue';
  onChange?: (newState: JSONContent) => void;
  onHeightChange?: (height: number) => void;
}

export const handleImageFile = async (
  file: File,
  onError?: (message: string) => void
): Promise<[HTMLImageElement, string] | undefined> => {
  const filesize = file.size / 1024 / 1024; // filesize in MB

  if (
    [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/svg",
      "image/webp",
    ].includes(file.type) &&
    filesize < 10
  ) {
    const img = new (globalThis as any).Image() as HTMLImageElement;
    const objectUrl = URL.createObjectURL(file);

    img.src = objectUrl;

    return await new Promise((resolve) => {
      const safeRevokeURL = () => {
        try {
          URL.revokeObjectURL(img.src);
        } catch (error) {
          console.error('Error revoking URL:', error);
        }
      };

      img.onload = function () {
        const dataUrl = getDataUrlForFile(file, img);
        const image = new (window as any).Image() as HTMLImageElement;

        image.src = dataUrl;
        image.onload = function () {
          resolve([image, dataUrl]);
          safeRevokeURL();
        };
        image.onerror = function() {
          safeRevokeURL();
          resolve(undefined);
        };
      };
      img.onerror = function() {
        safeRevokeURL();
        resolve(undefined);
      };
    });
  } else if (onError) {
    onError("Images need to be in an accepted format and less than 10MB in size.");
  }
};

export const handleCopy = (editor: Editor) => {
  const selection = editor.state.selection;
  const text = editor.state.doc.textBetween(selection.from, selection.to, '\n');
  navigator.clipboard.writeText(text);
};

export const handleCut = (editor: Editor) => {
  const selection = editor.state.selection;
  const text = editor.state.doc.textBetween(selection.from, selection.to, '\n');
  navigator.clipboard.writeText(text);
  editor.commands.deleteSelection();
};

export const handlePaste = async (editor: Editor) => {
  try {
    const items = await navigator.clipboard.read();

    for (const item of items) {
      // Handle images
      if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
        try {
          const imageBlob = await item.getType(item.types.find(type => type.startsWith('image/')) || 'image/png');
          const file = new File([imageBlob], 'pasted-image.png', { type: 'image/png' });
          const result = await handleImageFile(file);

          if (result) {
            const [, dataUrl] = result;

            editor.commands.setImage({ src: dataUrl });
            return true;
          }
        } catch (err) {
          console.error('Failed to paste image:', err);
        }
      }
    }

    // Fall back to text handling if no image
  const clipboardText = await navigator.clipboard.readText();

  if (clipboardText) {
    editor.commands.deleteSelection();
    editor.commands.insertContent(clipboardText.trim());
    return true;
  }
  } catch (error) {
    console.error('Error handling paste:', error);
  }

  return false;
};

const TipTapEditor = memo(function TipTapEditor({
  availableContextProviders,
  availableSlashCommands,
  isMainInput,
  onEnter,
  editorState,
  source = 'continue',
  onChange,
  onHeightChange,
}: TipTapEditorProps) {
  const dispatch = useDispatch();
=======
  toolbarOptions?: ToolbarOptions;
  placeholder?: string;
  historyKey: string;
  inputId: string;
}

export const TIPPY_DIV_ID = "tippy-js-div";

function TipTapEditor(props: TipTapEditorProps) {
  const dispatch = useAppDispatch();
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

  const ideMessenger = useContext(IdeMessengerContext);
  const { getSubmenuContextItems } = useSubmenuContextProviders();

<<<<<<< HEAD
  const historyLength = useSelector(
    (store: RootState) => {
      switch(source) {
        case 'perplexity':
          return store.state.perplexityHistory.length;
        default:
          return store.state.history.length;
      }
    }
  );

  // Create a unique key for each editor instance
  const editorKey = useMemo(() => `${(source || 'continue')}-editor`, [source]);

  const useActiveFile = useSelector(selectUseActiveFile);

  const { saveSession } = useHistory(dispatch, source);
=======
  const historyLength = useAppSelector((store) => store.session.history.length);

  const useActiveFile = useAppSelector(selectUseActiveFile);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

  const posthog = usePostHog();

  const inSubmenuRef = useRef<string | undefined>(undefined);
  const inDropdownRef = useRef(false);

  const isOSREnabled = useIsOSREnabled();

  const enterSubmenu = async (editor: Editor, providerId: string) => {
    const contents = editor.getText();
    const indexOfAt = contents.lastIndexOf("@");
    if (indexOfAt === -1) {
      return;
    }

    // Find the position of the last @ character
    // We do this because editor.getText() isn't a correct representation including node views
    let startPos = editor.state.selection.anchor;
    while (
      startPos > 0 &&
      editor.state.doc.textBetween(startPos, startPos + 1) !== "@"
    ) {
      startPos--;
    }
    startPos++;

    editor.commands.deleteRange({
      from: startPos,
      to: editor.state.selection.anchor,
    });
    inSubmenuRef.current = providerId;

    // to trigger refresh of suggestions
    editor.commands.insertContent(":");
    editor.commands.deleteRange({
      from: editor.state.selection.anchor - 1,
      to: editor.state.selection.anchor,
    });
  };

  const onClose = () => {
    inSubmenuRef.current = undefined;
    inDropdownRef.current = false;
  };

  const onOpen = () => {
    inDropdownRef.current = true;
  };

<<<<<<< HEAD
  const contextItems = useSelector(
    (store: RootState) => store.state.contextItems,
  );
  const defaultModel = useSelector(defaultModelSelector);
  const defaultModelRef = useUpdatingRef(defaultModel);
=======
  const defaultModel = useAppSelector(selectDefaultModel);
  const defaultModelRef = useUpdatingRef(defaultModel);

>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  const getSubmenuContextItemsRef = useUpdatingRef(getSubmenuContextItems);
  const availableContextProvidersRef = useUpdatingRef(availableContextProviders)

  const historyLengthRef = useUpdatingRef(historyLength);
  const availableSlashCommandsRef = useUpdatingRef(
    availableSlashCommands,
  );

<<<<<<< HEAD
  const active = useSelector((store: RootState) => {
    switch(source) {
      case 'perplexity':
        return store.state.perplexityActive;
      default:
        return store.state.active;
    }
  });

  const activeRef = useUpdatingRef(active);
=======
  const isStreaming = useAppSelector((state) => state.session.isStreaming);
  const isStreamingRef = useUpdatingRef(isStreaming);

  const isInEditMode = useAppSelector(selectIsInEditMode);
  const isInEditModeRef = useUpdatingRef(isInEditMode);
  const hasCodeToEdit = useAppSelector(selectHasCodeToEdit);
  const isEditModeAndNoCodeToEdit = isInEditMode && !hasCodeToEdit;
  async function handleImageFile(
    file: File,
  ): Promise<[HTMLImageElement, string] | undefined> {
    let filesize = file.size / 1024 / 1024; // filesize in MB
    // check image type and size
    if (
      [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/svg",
        "image/webp",
      ].includes(file.type) &&
      filesize < 10
    ) {
      // check dimensions
      let _URL = window.URL || window.webkitURL;
      let img = new window.Image();
      img.src = _URL.createObjectURL(file);

      return await new Promise((resolve) => {
        img.onload = function () {
          const dataUrl = getDataUrlForFile(file, img);
          if (!dataUrl) {
            return;
          }

          let image = new window.Image();
          image.src = dataUrl;
          image.onload = function () {
            resolve([image, dataUrl]);
          };
        };
      });
    } else {
      ideMessenger.post("showToast", [
        "error",
        "Images need to be in jpg or png format and less than 10MB in size.",
      ]);
    }
  }
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

  const { prevRef, nextRef, addRef } = useInputHistory(props.historyKey);

<<<<<<< HEAD
  const { prevRef, nextRef, addRef } = useInputHistory();
  const location = useLocation();

  // Keep track of the last valid content
  const lastContentRef = useRef(editorState);

  useEffect(() => {
    if (editorState) {
      lastContentRef.current = editorState;
    }
  }, [editorState]);

  const editor: Editor = useEditor({
=======
  const editor: Editor | null = useEditor({
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    extensions: [
      Document,
      History,
      Image.extend({
        renderHTML({ HTMLAttributes }) {
          const wrapper = document.createElement('div');
          wrapper.className = 'image-wrapper';

          const img = document.createElement('img');
          Object.entries(HTMLAttributes).forEach(([key, value]) => {
            img.setAttribute(key, value as string);
          });

          const deleteButton = document.createElement('button');
          deleteButton.className = 'image-delete-button';
          deleteButton.textContent = 'Image';
          deleteButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Dispatch a custom event that we'll handle in the editor
            const event = new CustomEvent('deleteImage', {
              detail: { imgElement: (e.target as HTMLElement).parentElement?.querySelector('img') }
            });
            window.dispatchEvent(event);
          };

          wrapper.appendChild(img);
          wrapper.appendChild(deleteButton);

          return wrapper;
        },
        addProseMirrorPlugins() {
          const plugin = new Plugin({
            props: {
              handleDOMEvents: {
                paste(view, event) {
<<<<<<< HEAD
                  const items = event.clipboardData.items;
                  for (const item of items) {
                    const file = item.getAsFile();
                    const model = defaultModelRef.current;

                    file &&
                      modelSupportsImages(
                        model.provider,
                        model.model,
                        model.title,
                        model.capabilities,
                      ) &&
                      handleImageFile(file).then((resp) => {
                        if (!resp) {
                          return;
                        }
                        const [img, dataUrl] = resp;
                        const { schema } = view.state;
                        const node = schema.nodes.image.create({
                          src: dataUrl,
=======
                  const model = defaultModelRef.current;
                  if (!model) return;
                  const items = event.clipboardData?.items;
                  if (items) {
                    for (const item of items) {
                      const file = item.getAsFile();
                      file &&
                        modelSupportsImages(
                          model.provider,
                          model.model,
                          model.title,
                          model.capabilities,
                        ) &&
                        handleImageFile(file).then((resp) => {
                          if (!resp) return;
                          const [img, dataUrl] = resp;
                          const { schema } = view.state;
                          const node = schema.nodes.image.create({
                            src: dataUrl,
                          });
                          const tr = view.state.tr.insert(0, node);
                          view.dispatch(tr);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
                        });
                    }
                  }
                },
              },
            },
          });
          return [plugin];
        },
      }).configure({
        HTMLAttributes: {
          class: "object-contain max-h-[210px] max-w-full mx-1",
        },
      }),
      Placeholder.configure({
<<<<<<< HEAD
        placeholder: () => getPlaceholder(historyLengthRef.current, location, source),
=======
        placeholder: getPlaceholderText(
          props.placeholder,
          historyLengthRef.current,
        ),
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      }),
      Paragraph.extend({
        addKeyboardShortcuts() {
          return {
            Enter: () => {
              if (inDropdownRef.current) {
                return false;
              }

              onEnterRef.current({
                useCodebase: false,
                noContext: !useActiveFile,
              });
              return true;
            },

            "Mod-Enter": () => {
              onEnterRef.current({
                useCodebase: true,
                noContext: !useActiveFile,
              });
              return true;
            },
            "Alt-Enter": () => {
              posthog.capture("gui_use_active_file_enter");

              onEnterRef.current({
                useCodebase: false,
                noContext: !!useActiveFile,
              });

              return true;
            },
            "Mod-Backspace": () => {
              // If you press cmd+backspace wanting to cancel,
              // but are inside of a text box, it shouldn't
              // delete the text
              if (isStreamingRef.current) {
                return true;
              }
              return false;
            },
            "Shift-Enter": () =>
              this.editor.commands.first(({ commands }) => [
                () => commands.newlineInCode(),
                () => commands.createParagraphNear(),
                () => commands.liftEmptyBlock(),
                () => commands.splitBlock(),
              ]),

            ArrowUp: () => {
              if (this.editor.state.selection.anchor > 1) {
                return false;
              }

              const previousInput = prevRef.current(
                this.editor.state.toJSON().doc,
              );
              if (previousInput) {
                this.editor.commands.setContent(previousInput);
                setTimeout(() => {
                  this.editor.commands.blur();
                  this.editor.commands.focus("start");
                }, 0);
                return true;
              }
              return false;
            },
            Escape: () => {
              if (inDropdownRef.current || !isInEditModeRef.current) {
                return false;
              }
              (async () => {
                await dispatch(
                  loadLastSession({
                    saveCurrentSession: false,
                  }),
                );
                dispatch(exitEditMode());
              })();

              return true;
            },
            ArrowDown: () => {
              if (
                this.editor.state.selection.anchor <
                this.editor.state.doc.content.size - 1
              ) {
                return false;
              }
              const nextInput = nextRef.current();
              if (nextInput) {
                this.editor.commands.setContent(nextInput);
                setTimeout(() => {
                  this.editor.commands.blur();
                  this.editor.commands.focus("end");
                }, 0);
                return true;
              }
              return false;
            },
          };
        },
      }).configure({
        HTMLAttributes: {
          class: "m-0",
        },
      }),
      Text,
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: getContextProviderDropdownOptions(
          availableContextProvidersRef,
          getSubmenuContextItemsRef,
          enterSubmenu,
          onClose,
          onOpen,
          inSubmenuRef,
          ideMessenger,
        ),
        renderHTML: (props) => {
          return `@${props.node.attrs.label || props.node.attrs.id}`;
        },
      }),

      AddCodeToEdit.configure({
        HTMLAttributes: {
          class: "add-code-to-edit",
        },
        suggestion: {
          ...getContextProviderDropdownOptions(
            availableContextProvidersRef,
            getSubmenuContextItemsRef,
            enterSubmenu,
            onClose,
            onOpen,
            inSubmenuRef,
            ideMessenger,
          ),
          allow: () => isInEditModeRef.current,
          command: async ({ editor, range, props }) => {
            editor.chain().focus().insertContentAt(range, "").run();
            const filepath = props.id;
            const contents = await ideMessenger.ide.readFile(filepath);
            dispatch(
              addCodeToEdit({
                filepath,
                contents,
              }),
            );
          },
          items: async ({ query }) => {
            // Only display files in the dropdown
            const results = getSubmenuContextItemsRef.current("file", query);
            return results.map((result) => ({
              ...result,
              label: result.title,
              type: "file",
              query: result.id,
              icon: result.icon,
            }));
          },
        },
      }),
      props.availableSlashCommands.length
        ? SlashCommand.configure({
            HTMLAttributes: {
              class: "mention",
            },
            suggestion: getSlashCommandDropdownOptions(
              availableSlashCommandsRef,
              onClose,
              onOpen,
              ideMessenger,
            ),
            renderText: (props) => {
              return props.node.attrs.label;
            },
          })
        : MockExtension,
      CodeBlockExtension,
      HardBreak.extend({
        renderText() {
          return '\n'
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "outline-none",
        style: `font-size: ${getFontSize()}px;`,
      },
    },
<<<<<<< HEAD
    content: lastContentRef.current,
    editable: true,
    onFocus: () => setIsEditorFocused(true),
    onBlur: () => setIsEditorFocused(false),
    onCreate({ editor }) {
      if (lastContentRef.current) {
        editor.commands.setContent(lastContentRef.current);
      }
    }
  }, []);  // Remove dependencies to prevent recreation
=======
    content: props.editorState,
    editable: !isStreaming || props.isMainInput,
  });
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

  const [shouldHideToolbar, setShouldHideToolbar] = useState(false);
  const debouncedShouldHideToolbar = debounce((value) => {
    setShouldHideToolbar(value);
  }, 200);

  function getPlaceholderText(
    placeholder: TipTapEditorProps["placeholder"],
    historyLength: number,
  ) {
    if (placeholder) {
      return placeholder;
    }

    return historyLength === 0
      ? "Ask anything, '@' to add context"
      : "Ask a follow-up";
  }

  useEffect(() => {
    if (!editor) {
      return;
    }
    const placeholder = getPlaceholderText(
      props.placeholder,
      historyLengthRef.current,
    );

    editor.extensionManager.extensions.filter(
      (extension) => extension.name === "placeholder",
    )[0].options["placeholder"] = placeholder;

    editor.view.dispatch(editor.state.tr);
  }, [editor, props.placeholder, historyLengthRef.current]);

  useEffect(() => {
    if (props.isMainInput) {
      editor?.commands.clearContent(true);
    }
  }, [editor, isInEditMode, props.isMainInput]);

  useEffect(() => {
    if (editor) {
      const handleFocus = () => {
        debouncedShouldHideToolbar(false);
      };

      const handleBlur = () => {
        debouncedShouldHideToolbar(true);
      };

      editor.on("focus", handleFocus);
      editor.on("blur", handleBlur);

      return () => {
        editor.off("focus", handleFocus);
        editor.off("blur", handleBlur);
      };
    }
  }, [editor]);

  const editorFocusedRef = useUpdatingRef(editor?.isFocused, [editor]);

<<<<<<< HEAD

  const isPerplexity = source === 'perplexity';

  useEffect(() => {
    const handleShowFile = (event: CustomEvent) => {
      const filepath = event.detail.filepath;
      ideMessenger.post("showFile", { filepath });
    };

    window.addEventListener('showFile', handleShowFile as EventListener);
    return () => {
      window.removeEventListener('showFile', handleShowFile as EventListener);
    };
  }, [ideMessenger]);

  useEffect(() => {
    if (isJetBrains()) {
      // This is only for VS Code .ipynb files
      return;
    }

    if (isWebEnvironment()) {
      const handleKeyDown = async (event: KeyboardEvent) => {
        if (!editor || !editorFocusedRef.current) {
          return;
        }
        if ((event.metaKey || event.ctrlKey) && event.key === "x") {
          // Cut
          const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
          );
          navigator.clipboard.writeText(selectedText);
          editor.commands.deleteSelection();
          event.preventDefault();
        } else if ((event.metaKey || event.ctrlKey) && event.key === "c") {
          // Copy
          const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
          );
          navigator.clipboard.writeText(selectedText);
          event.preventDefault();
        } else if ((event.metaKey || event.ctrlKey) && event.key === "v") {
          // Paste
          event.preventDefault(); // Prevent default paste behavior
          const clipboardText = await navigator.clipboard.readText();
          editor.commands.insertContent(clipboardText.trim());
        }
      };
=======
  /**
   * This handles various issues with meta key actions
   * - In JetBrains, when using OSR in JCEF, there is a bug where using the meta key to
   *   highlight code using arrow keys is not working
   * - In VS Code, while working with .ipynb files there is a problem where copy/paste/cut will affect
   *   the actual notebook cells, even when performing them in our GUI
   *
   *  Currently keydown events for a number of keys are not registering if the
   *  meta/shift key is pressed, for example "x", "c", "v", "z", etc.
   *  Until this is resolved we can't turn on OSR for non-Mac users due to issues
   *  with those key actions.
   */
  const handleKeyDown = async (e: KeyboardEvent<HTMLDivElement>) => {
    if (!editor) {
      return;
    }

    setActiveKey(e.key);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

    if (!editorFocusedRef?.current || !isMetaEquivalentKeyPressed(e)) return;

    if (isOSREnabled) {
      handleJetBrainsOSRMetaKeyIssues(e, editor);
    } else if (!isJetBrains()) {
      await handleVSCMetaKeyIssues(e, editor);
    }
  };

<<<<<<< HEAD
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (!editor || !editorFocusedRef.current) {
        return;
      }

      if (event.metaKey && event.key === "x") {
        document.execCommand("cut");
        event.stopPropagation();
        event.preventDefault();
      } else if (event.metaKey && event.key === "v") {
        document.execCommand("paste");
        event.stopPropagation();
        event.preventDefault();
      } else if (event.metaKey && event.key === "c") {
        document.execCommand("copy");
        event.stopPropagation();
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, editorFocusedRef]);

  useEffect(() => {
    if (mainEditorContent && editor) {
      editor.commands.setContent(mainEditorContent);
      dispatch(consumeMainEditorContent());
    }
  }, [mainEditorContent, editor]);
=======
  const handleKeyUp = () => {
    setActiveKey(null);
  };
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

  const onEnterRef = useUpdatingRef(
    (modifiers: InputModifiers) => {
      if (!editor) {
        return;
      }
      if (isStreaming || isEditModeAndNoCodeToEdit) {
        return;
      }

      const json = editor.getJSON();

      // Don't do anything if input box is empty
      if (!json.content?.some((c) => c.content)) {
        return;
      }

<<<<<<< HEAD
      onEnter(json, modifiers);

      if (isMainInput) {
        const content = editor.state.toJSON().doc;
        addRef.current(content);
        editor.commands.clearContent(true);
=======
      if (props.isMainInput) {
        addRef.current(json);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      }

      props.onEnter(json, modifiers, editor);
    },
    [onEnter, editor, isMainInput],
  );

  useEffect(() => {
    if (props.isMainInput) {
      /**
       * I have a strong suspicion that many of the other focus
       * commands are redundant, especially the ones inside
       * useTimeout.
       */
      editor?.commands.focus();
    }
  }, [props.isMainInput, editor]);

  // Re-focus main input after done generating
  useEffect(() => {
<<<<<<< HEAD
    if (editor && !active && isMainInput && document.hasFocus()) {
      editor.commands.focus(undefined, { scrollIntoView: false });
    }
  }, [isMainInput, active, editor]);
=======
    if (editor && !isStreaming && props.isMainInput && document.hasFocus()) {
      editor.commands.focus(undefined, { scrollIntoView: false });
    }
  }, [props.isMainInput, isStreaming, editor]);

  // This allows anywhere in the app to set the content of the main input
  const mainInputContentTrigger = useAppSelector(
    (store) => store.session.mainEditorContentTrigger,
  );
  useEffect(() => {
    if (!props.isMainInput || !mainInputContentTrigger) {
      return;
    }
    queueMicrotask(() => {
      editor?.commands.setContent(mainInputContentTrigger);
    });
    dispatch(setMainEditorContentTrigger(undefined));
  }, [editor, props.isMainInput, mainInputContentTrigger]);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

  // IDE event listeners
  useWebviewListener(
    "userInput",
    async (data) => {
      if (!isMainInput) {
        return;
      }
      editor?.commands.insertContent(data.input);
      onEnterRef.current({ useCodebase: false, noContext: true });
    },
    [editor, onEnterRef.current, isMainInput],
  );

  useWebviewListener(
    "addPerplexityContextinChat",
    async (data) => {
      if (!isMainInput || !editor) {
        return;
      }

      const item: ContextItemWithId = {
        content: data.text,
        name: "Context from PearAI Search",
        description: "Context from result of Perplexity AI",
        id: {
          providerTitle: "code",
          itemId: data.text,
        },
        language: data.language,
      };

      let index = 0;
      for (const el of editor.getJSON().content) {
        if (el.type === "codeBlock") {
          index += 2;
        } else {
          break;
        }
      }
      editor
        .chain()
        .insertContentAt(index, {
          type: "codeBlock",
          attrs: {
            item,
          },
        })
        .run();

      setTimeout(() => {
          editor.commands.blur();
          editor.commands.focus("end");
      }, 20);
    },
    [editor, onEnterRef.current, isMainInput],
  );

  useWebviewListener("jetbrains/editorInsetRefresh", async () => {
    editor?.chain().clearContent().focus().run();
  });

  useWebviewListener(
    "focusContinueInput",
    async (data) => {
      if (!isMainInput) {
        return;
      }

      dispatch(clearCodeToEdit());

      if (historyLength > 0) {
        await dispatch(
          saveCurrentSession({
            openNewSession: false,
            generateTitle: true,
          }),
        );
      }
      setTimeout(() => {
        editor?.commands.blur();
        editor?.commands.focus("end");
      }, 20);
    },
<<<<<<< HEAD
    [historyLength, saveSession, editor, isMainInput],
=======
    [historyLength, editor, props.isMainInput],
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  );

  useWebviewListener(
    "focusContinueInputWithoutClear",
    async () => {
      if (!isMainInput) {
        return;
      }
      setTimeout(() => {
        editor?.commands.focus("end");
      }, 20);
    },
    [editor, isMainInput],
  );

  useWebviewListener(
    "focusContinueInputWithNewSession",
    async () => {
      if (!isMainInput) {
        return;
      }
      await dispatch(
        saveCurrentSession({
          openNewSession: true,
          generateTitle: true,
        }),
      );
      setTimeout(() => {
        editor?.commands.focus("end");
      }, 20);
    },
    [editor, isMainInput],
  );

  useWebviewListener(
    "highlightedCode",
    async (data) => {
      if (!data.rangeInFileWithContents.contents || !isMainInput || !editor) {
        return;
      }

      const contextItem = rifWithContentsToContextItem(
        data.rangeInFileWithContents,
      );

      let index = 0;
      for (const el of editor.getJSON()?.content ?? []) {
        if (el.attrs?.item?.name === contextItem.name) {
          return; // Prevent exact duplicate code blocks
        }
        if (el.type === "codeBlock") {
          index += 2;
        } else {
          break;
        }
      }
      editor
        .chain()
        .insertContentAt(index, {
          type: "codeBlock",
          attrs: {
            item: contextItem,
            inputId: props.inputId,
          },
        })
        .run();
      dispatch(
        setNewestCodeblocksForInput({
          inputId: props.inputId,
          contextItemId: contextItem.id.itemId,
        }),
      );
      if (data.prompt) {
        editor.commands.focus("end");
        editor.commands.insertContent(data.prompt);
      }

      if (data.shouldRun) {
        onEnterRef.current({ useCodebase: false, noContext: true });
      }

      setTimeout(() => {
        editor.commands.blur();
        editor.commands.focus("end");
      }, 20);
    },
<<<<<<< HEAD
    [
      editor,
      isMainInput,
      historyLength,
      ignoreHighlightedCode,
      isMainInput,
      onEnterRef.current,
    ],
=======
    [editor, props.isMainInput, historyLength, onEnterRef.current],
  );

  useWebviewListener(
    "focusEdit",
    async () => {
      if (!props.isMainInput) {
        return;
      }

      setTimeout(() => {
        editor?.commands.focus("end");
      }, 20);
    },
    [editor, props.isMainInput],
  );

  useWebviewListener(
    "focusEditWithoutClear",
    async () => {
      if (!props.isMainInput) {
        return;
      }

      setTimeout(() => {
        editor?.commands.focus("end");
      }, 2000);
    },
    [editor, props.isMainInput],
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  );

  useWebviewListener(
    "isContinueInputFocused",
    async () => {
<<<<<<< HEAD
      return isMainInput && editorFocusedRef.current;
=======
      return props.isMainInput && !!editorFocusedRef.current;
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    },
    [editorFocusedRef, isMainInput],
    !isMainInput,
  );

  useWebviewListener(
    "focusContinueSessionId",
    async (data) => {
      if (!props.isMainInput || !data.sessionId) {
        return;
      }
      await dispatch(
        loadSession({
          sessionId: data.sessionId,
          saveCurrentSession: true,
        }),
      );
    },
    [props.isMainInput],
  );

  const [showDragOverMsg, setShowDragOverMsg] = useState(false);

  useEffect(() => {
    const overListener = (event: DragEvent) => {
      if (event.shiftKey) {
        return;
      }
      setShowDragOverMsg(true);
    };
    window.addEventListener("dragover", overListener);

    const leaveListener = (event: DragEvent) => {
      if (event.shiftKey) {
        setShowDragOverMsg(false);
      } else {
        setTimeout(() => setShowDragOverMsg(false), 2000);
      }
    };
    window.addEventListener("dragleave", leaveListener);

    return () => {
      window.removeEventListener("dragover", overListener);
      window.removeEventListener("dragleave", leaveListener);
    };
  }, []);

  const [activeKey, setActiveKey] = useState<string | null>(null);

  const insertCharacterWithWhitespace = useCallback(
    (char: string) => {
      if (!editor) {
        return;
      }
      const text = editor.getText();
      if (!text.endsWith(char)) {
        if (text.length > 0 && !text.endsWith(" ")) {
          editor.commands.insertContent(` ${char}`);
        } else {
          editor.commands.insertContent(char);
        }
      }
    },
    [editor],
  );

  // Use onTransaction to track content changes
  useEffect(() => {
    if (editor) {
      editor.on('transaction', () => {
        const newContent = editor.getJSON();
        lastContentRef.current = newContent;
        onChange?.(newContent);

        // If /edit is typed and no context items are selected, select the first

        if (contextItems.length > 0) {
          return;
        }

        const codeBlock = newContent.content?.find((el) => el.type === "codeBlock");
        if (!codeBlock) {
          return;
        }

        // Search for slashcommand type
        for (const p of newContent.content) {
          if (
            p.type !== "paragraph" ||
            !p.content ||
            typeof p.content === "string"
          ) {
            continue;
          }
          for (const node of p.content) {
            if (
              node.type === "slashcommand" &&
              ["/edit", "/comment"].includes(node.attrs.label)
            ) {
              // Update context items
              dispatch(
                setEditingContextItemAtIndex({ item: codeBlock.attrs.item }),
              );
              return;
            }
          }
        }
      });
    }
  }, [editor, onChange, contextItems, dispatch]);

  // Prevent content flash during streaming
  useEffect(() => {
    if (editor && lastContentRef.current) {
      const currentContent = editor.getJSON();
      if (JSON.stringify(currentContent) !== JSON.stringify(lastContentRef.current)) {
        editor.commands.setContent(lastContentRef.current);
      }
    }
  }, [editor, source]);


  const [contextMenu, setContextMenu] = useState<{
    position: { x: number; y: number };
  } | null>(null);

  // Add context menu handler
  useEffect(() => {
    if (!editor) return;

    const handleContextMenu = (event: MouseEvent) => {
      if (!editor.view.dom.contains(event.target as Node)) return;

      event.preventDefault();
      event.stopPropagation();

      setContextMenu({
        position: { x: event.clientX, y: event.clientY },
      });
    };

    const editorDom = editor.view.dom;
    editorDom.addEventListener('contextmenu', handleContextMenu);

    return () => {
      editorDom.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [editor]);

  // Add this effect in your component
  useEffect(() => {
    if (!editor) return;

    const handleDeleteImage = (event: CustomEvent) => {
      const imgElement = event.detail.imgElement;
      if (imgElement && editor) {
        // Find all image nodes in the editor
        editor.state.doc.descendants((node, pos) => {
          if (node.type.name === 'image' && node.attrs.src === imgElement.src) {
            // Delete the specific image node at this position
            editor.commands.deleteRange({ from: pos, to: pos + 1 });
            return false; // Stop searching
          }
        });
      }
    };

    window.addEventListener('deleteImage', handleDeleteImage as EventListener);
    return () => {
      window.removeEventListener('deleteImage', handleDeleteImage as EventListener);
    };
  }, [editor]);

  const inputBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputBoxRef.current && onHeightChange) {
      const observer = new ResizeObserver(() => {
        onHeightChange(inputBoxRef.current!.offsetHeight);
      });
      observer.observe(inputBoxRef.current);

      return () => observer.disconnect();
    }
  }, [onHeightChange]);

  return (
    <InputBoxDiv
<<<<<<< HEAD
      ref={inputBoxRef}
      isNewSession={historyLength === 0}
      onKeyDown={(e) => {
        if (e.key === "Alt") {
          setOptionKeyHeld(true);
        }
      }}
      onKeyUp={(e) => {
        if (e.key === "Alt") {
          setOptionKeyHeld(false);
        }
      }}
=======
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      className="cursor-text"
      onClick={() => {
        editor?.commands.focus();
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setShowDragOverMsg(true);
      }}
      onDragLeave={(e) => {
        if (e.relatedTarget === null) {
          if (e.shiftKey) {
            setShowDragOverMsg(false);
          } else {
            setTimeout(() => setShowDragOverMsg(false), 2000);
          }
        }
      }}
      onDragEnter={() => {
        setShowDragOverMsg(true);
      }}
      onDrop={(event) => {
        if (
          !defaultModel ||
          !modelSupportsImages(
            defaultModel.provider,
            defaultModel.model,
            defaultModel.title,
            defaultModel.capabilities,
          )
        ) {
          return;
        }
        setShowDragOverMsg(false);
<<<<<<< HEAD
        const file = event.dataTransfer.files[0];
        handleImageFile(file).then(([img, dataUrl]) => {
          const { schema } = editor.state;
          const node = schema.nodes.image.create({ src: dataUrl });
          const tr = editor.state.tr.insert(0, node);
          editor.view.dispatch(tr);
=======
        let file = event.dataTransfer.files[0];
        handleImageFile(file).then((result) => {
          if (!editor) {
            return;
          }
          if (result) {
            const [_, dataUrl] = result;
            const { schema } = editor.state;
            const node = schema.nodes.image.create({ src: dataUrl });
            const tr = editor.state.tr.insert(0, node);
            editor.view.dispatch(tr);
          }
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
        });
        event.preventDefault();
      }}
    >
<<<<<<< HEAD
      <ContextToolbar
hidden={!(editorFocusedRef.current || isMainInput) || isPerplexity}
        onImageFileSelected={(file) => {
          handleImageFile(file).then(([img, dataUrl]) => {
            const { schema } = editor.state;
            const node = schema.nodes.image.create({ src: dataUrl });
            editor.commands.command(({ tr }) => {
              tr.insert(0, node);
              return true;
            });
          });
        }}
        onAddContextItem={() => {
          if (editor.getText().endsWith("@")) {
          } else {
            // Add space so that if there's text right before, it still activates the dropdown
            editor.commands.insertContent(" @");
          }
        }}
				editor={editor}
      />

      <EditorContent
        spellCheck={false}
        editor={editor}
        onClick={(event) => {
          event.stopPropagation();
        }}
      />

      <InputToolbar
        showNoContext={optionKeyHeld}
        hidden={!(editorFocusedRef.current || isMainInput)}
        onAddContextItem={() => {
          if (editor.getText().endsWith("@")) {
          } else {
            // Add space so that if there's text right before, it still activates the dropdown
            editor.commands.insertContent(" @");
          }
        }}
        onEnter={onEnterRef.current}
        onImageFileSelected={(file) => {
          handleImageFile(file).then(([img, dataUrl]) => {
            const { schema } = editor.state;
            const node = schema.nodes.image.create({ src: dataUrl });
            editor.commands.command(({ tr }) => {
              tr.insert(0, node);
              return true;
            });
          });
        }}
        source={source}
      />
=======
      <div className="px-2.5 pb-1 pt-2">
        <EditorContent
          className={`scroll-container overflow-y-scroll ${props.isMainInput ? "max-h-[70vh]" : ""}`}
          spellCheck={false}
          editor={editor}
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
        <InputToolbar
          toolbarOptions={props.toolbarOptions}
          activeKey={activeKey}
          hidden={shouldHideToolbar && !props.isMainInput}
          onAddContextItem={() => insertCharacterWithWhitespace("@")}
          onAddSlashCommand={() => insertCharacterWithWhitespace("/")}
          onEnter={onEnterRef.current}
          onImageFileSelected={(file) => {
            handleImageFile(file).then((result) => {
              if (!editor) {
                return;
              }
              if (result) {
                const [_, dataUrl] = result;
                const { schema } = editor.state;
                const node = schema.nodes.image.create({ src: dataUrl });
                editor.commands.command(({ tr }) => {
                  tr.insert(0, node);
                  return true;
                });
              }
            });
          }}
          disabled={isStreaming}
        />
      </div>
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

      {showDragOverMsg &&
        modelSupportsImages(
          defaultModel?.provider || "",
          defaultModel?.model || "",
          defaultModel?.title,
          defaultModel?.capabilities,
        ) && (
          <>
            <HoverDiv></HoverDiv>
            <HoverTextDiv>Drop Here</HoverTextDiv>
          </>
<<<<<<< HEAD
        )
			}
      {contextMenu && editor && (
        <TipTapContextMenu
          editor={editor}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
          defaultModel={defaultModel}
          ideMessenger={ideMessenger}
          handleImageFile={handleImageFile}
        />
      )}
=======
        )}
      <div id={TIPPY_DIV_ID} className="fixed z-50" />
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    </InputBoxDiv>
  );
});

export default TipTapEditor;
