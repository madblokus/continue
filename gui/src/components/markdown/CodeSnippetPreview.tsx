import {
  ChevronDownIcon,
<<<<<<< HEAD
  ChevronUpIcon,
  CodeBracketIcon,
  TrashIcon,
=======
  EyeSlashIcon,
  XMarkIcon,
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
} from "@heroicons/react/24/outline";
import { ContextItemWithId } from "core";
import { dedent, getMarkdownLanguageTagForFile } from "core/util";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { defaultBorderRadius, lightGray, vscBackground, vscEditorBackground } from "..";
import { IdeMessengerContext } from "../../context/IdeMessenger";
<<<<<<< HEAD
import HeaderButtonWithText from "../HeaderButtonWithText";
=======
import { getFontSize } from "../../util";
import FileIcon from "../FileIcon";
import HeaderButtonWithToolTip from "../gui/HeaderButtonWithToolTip";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import StyledMarkdownPreview from "./StyledMarkdownPreview";
import { ctxItemToRifWithContents } from "core/commands/util";
import { EyeIcon } from "@heroicons/react/24/solid";
import { useAppSelector } from "../../redux/hooks";

const PreviewMarkdownDiv = styled.div<{
  borderColor?: string;
}>`
  background-color: ${vscEditorBackground};
  border-radius: ${defaultBorderRadius};
  border: 1.5px solid #2A3238;
  overflow: hidden;
  position: relative;

  & div {
    background-color: ${vscEditorBackground};
		user-select: text;
  }
`;

<<<<<<< HEAD
const PreviewMarkdownHeader = styled.div`
  padding: 3px;
  border-radius: ${defaultBorderRadius};
  word-break: break-all;
  display: flex;
  align-items: center;
`;

=======
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
interface CodeSnippetPreviewProps {
  item: ContextItemWithId;
  onDelete?: () => void;
  borderColor?: string;
  inputId: string;
}
<<<<<<< HEAD
const MAX_PREVIEW_HEIGHT = 300;

// Pre-compile the regular expression outside of the function
=======

const MAX_PREVIEW_HEIGHT = 100;

>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
const backticksRegex = /`{3,}/gm;

function CodeSnippetPreview(props: CodeSnippetPreviewProps) {
  const ideMessenger = useContext(IdeMessengerContext);

  const [localHidden, setLocalHidden] = useState<boolean | undefined>();
  const [isSizeLimited, setIsSizeLimited] = useState(true);

  const newestCodeblockForInputId = useAppSelector(
    (store) => store.session.newestCodeblockForInput[props.inputId],
  );

  const hidden = useMemo(() => {
    return localHidden ?? newestCodeblockForInputId !== props.item.id.itemId;
  }, [localHidden, newestCodeblockForInputId, props.item]);

  const content = useMemo(() => {
    return dedent`${props.item.content}`;
  }, [props.item.content]);

  const fence = useMemo(() => {
    const backticks = content.match(backticksRegex);
    return backticks ? backticks.sort().at(-1) + "`" : "```";
  }, [content]);

  const codeBlockRef = useRef<HTMLDivElement>(null);

  const [codeblockDims, setCodeblockDims] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setCodeblockDims({
        width: codeBlockRef.current?.scrollWidth ?? 0,
        height: codeBlockRef.current?.scrollHeight ?? 0,
      });
    });

    if (codeBlockRef.current) {
      resizeObserver.observe(codeBlockRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [codeBlockRef]);

  return (
    <PreviewMarkdownDiv
      spellCheck={false}
      borderColor={props.borderColor}
      className="find-widget-skip"
    >
      <div
        className="m-0 flex cursor-pointer items-center justify-between break-all border-b px-[5px] py-1.5 hover:opacity-90"
        style={{
          fontSize: getFontSize() - 3,
        }}
        onClick={() => {
          setLocalHidden(!hidden);
        }}
      >
<<<<<<< HEAD

				<CodeBracketIcon className="h-4 w-4 stroke-2 pl-1" style={{ color: lightGray}}/>
        <div className="flex p-1 pl-2 gap-1 rounded-[4px] items-center" style={{ backgroundColor: vscBackground}}>
				{/* <FileIcon
            height="20px"
            width="20px"
            filename={props.item.name}
          ></FileIcon> */}
          {props.item.id.providerTitle === "code" && props.item.name.includes("(") && (
  					<span className="text-input-foreground">
    					{props.item.name.split("(")[1]?.split(")")?.at(0) || ""}
  					</span>
					)}
					<span className="font-[500]" style={{ color: lightGray}}>
  					{props.item.id.providerTitle === "code"
    					? (props.item.name.includes("(") ? props.item.name.split("(")[0] : props.item.name)
    					: props.item.name
  					}
					</span>
          {/* {props.onEdit && (
            <HeaderButtonWithText
              text="Edit"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onEdit();
              }}
              {...(props.editing && { color: "#f0f4" })}
            >
              <PaintBrushIcon width="1.1em" height="1.1em" />
            </HeaderButtonWithText>
          )} */}
          <HeaderButtonWithText
=======
        <div
          className="flex items-center gap-1 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            if (
              props.item.id.providerTitle === "file" &&
              props.item.uri?.value
            ) {
              ideMessenger.post("showFile", {
                filepath: props.item.uri.value,
              });
            } else if (props.item.id.providerTitle === "code") {
              const rif = ctxItemToRifWithContents(props.item, true);
              ideMessenger.ide.showLines(
                rif.filepath,
                rif.range.start.line,
                rif.range.end.line,
              );
            } else {
              ideMessenger.post("showVirtualFile", {
                content,
                name: props.item.name,
              });
            }
          }}
        >
          <FileIcon height="16px" width="16px" filename={props.item.name} />
          {props.item.name}
        </div>
        <div className="flex items-center gap-1">
          <HeaderButtonWithToolTip text={hidden ? "Show" : "Hide"}>
            {hidden ? (
              <EyeIcon width="1em" height="1em" />
            ) : (
              <EyeSlashIcon width="1em" height="1em" />
            )}
          </HeaderButtonWithToolTip>
          <HeaderButtonWithToolTip
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
            text="Delete"
            onClick={(e) => {
              e.stopPropagation();
              props.onDelete?.();
            }}
          >
<<<<<<< HEAD
            <TrashIcon className="h-3.5 w-3.5 stroke-2 stroke-[#D23782]" />
          </HeaderButtonWithText>
        </div>
      </PreviewMarkdownHeader>

      <div
        contentEditable={false}
        className="-mt-3"
=======
            <XMarkIcon width="1em" height="1em" />
          </HeaderButtonWithToolTip>
        </div>
      </div>
      <div
        contentEditable={false}
        className={`m-0 ${isSizeLimited ? "overflow-hidden" : "overflow-auto"} ${hidden ? "hidden" : ""}`}
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
        ref={codeBlockRef}
        style={{
          maxHeight: isSizeLimited ? MAX_PREVIEW_HEIGHT : undefined, // Could switch to max-h-[33vh] but then chevron icon shows when height can't change
        }}
      >
        <StyledMarkdownPreview
<<<<<<< HEAD
          source={`${fence}${props.item.language || getMarkdownLanguageTagForFile(
            props.item.description,
          )}\n${props.item.content.trimEnd()}\n${fence}`}
          showCodeBorder={false}
					isCodeSnippet={true}
=======
          source={`${fence}${getMarkdownLanguageTagForFile(props.item.name)} ${props.item.description}\n${content}\n${fence}`}
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
        />
      </div>

      {codeblockDims.height > MAX_PREVIEW_HEIGHT && (
        <HeaderButtonWithToolTip
          className="absolute bottom-1 right-2"
          text={isSizeLimited ? "Expand" : "Collapse"}
        >
<<<<<<< HEAD
          {collapsed ? (
            <ChevronDownIcon
              className="h-4 w-4 stroke-2"
              onClick={() => setCollapsed(false)}
            />
          ) : (
            <ChevronUpIcon
              className="h-4 w-4 stroke-2"
              onClick={() => setCollapsed(true)}
            />
          )}
        </HeaderButtonWithText>
=======
          <ChevronDownIcon
            className="h-5 w-5 transition-all"
            style={{
              transform: isSizeLimited ? "" : "rotate(180deg)",
            }}
            onClick={() => setIsSizeLimited((v) => !v)}
          />
        </HeaderButtonWithToolTip>
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      )}
    </PreviewMarkdownDiv>
  );
}

export default CodeSnippetPreview;
