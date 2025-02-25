import {
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { ContextItemWithId } from "core";
import { ctxItemToRifWithContents } from "core/commands/util";
import { getUriPathBasename } from "core/util/uri";
import { useContext, useMemo, useState } from "react";
import { AnimatedEllipsis, lightGray, vscBackground } from "..";
import { IdeMessengerContext } from "../../context/IdeMessenger";
import { useAppSelector } from "../../redux/hooks";
import { selectIsGatheringContext } from "../../redux/slices/sessionSlice";
import FileIcon from "../FileIcon";
import SafeImg from "../SafeImg";
import { getIconFromDropdownItem } from "./MentionList";

function isSafeUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}


interface ContextItemsPeekProps {
  contextItems?: ContextItemWithId[];
  isCurrentContextPeek: boolean;
}

interface ContextItemsPeekItemProps {
  contextItem: ContextItemWithId;
}

function ContextItemsPeekItem({ contextItem }: ContextItemsPeekItemProps) {
  const ideMessenger = useContext(IdeMessengerContext);
  const isUrl = contextItem.uri?.type === "url";

  function openContextItem() {
    const { uri, name, content } = contextItem;

    if (isUrl) {
      if (uri?.value) {
        ideMessenger.post("openUrl", uri.value);
      } else {
        console.error("Couldn't open url", uri);
      }
    } else if (uri) {
      const isRangeInFile = name.includes(" (") && name.endsWith(")");

<<<<<<< HEAD
  function openContextItem(contextItem: ContextItemWithId) {
    if (contextItem.description.startsWith("http")) {
      window.open(isSafeUrl(contextItem.description) ? contextItem.description : '#', "_blank");
    } else if (
      contextItem.description.startsWith("/") ||
      contextItem.description.startsWith("\\")
    ) {
      if (contextItem.name.includes(" (") && contextItem.name.endsWith(")")) {
        const rif = contextItemToRangeInFileWithContents(contextItem);
=======
      if (isRangeInFile) {
        const rif = ctxItemToRifWithContents(contextItem);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
        ideMessenger.ide.showLines(
          rif.filepath,
          rif.range.start.line,
          rif.range.end.line,
        );
      } else {
        ideMessenger.ide.openFile(uri.value);
      }
    } else {
      ideMessenger.ide.showVirtualFile(name, content);
    }
  }

  function getContextItemIcon() {
    const dimensions = "18px";

    if (contextItem.icon) {
      return (
        <SafeImg
          className="mr-2 flex-shrink-0 rounded-md p-1"
          src={contextItem.icon}
          height={dimensions}
          width={dimensions}
          fallback={null}
        />
      );
    }

    // Heuristic to check if it's a file
    const shouldShowFileIcon =
      contextItem.content.includes("```") || contextItem.uri?.type === "file";

    if (shouldShowFileIcon) {
      return (
        <div className="mr-2 flex-shrink-0">
          <FileIcon
            filename={
              contextItem.description.split(" ").shift()?.split("#").shift() ||
              ""
            }
            height={dimensions}
            width={dimensions}
          />
        </div>
      );
    }

    const ProviderIcon = getIconFromDropdownItem(
      contextItem.id.providerTitle,
      "contextProvider",
    );

    return (
      <ProviderIcon
        className="mr-2 flex-shrink-0"
        height={dimensions}
        width={dimensions}
      />
    );
  }

  return (
    <div
      onClick={openContextItem}
      className="group mr-2 flex cursor-pointer items-center overflow-hidden text-ellipsis whitespace-nowrap rounded px-1.5 py-1 text-xs hover:bg-white/10"
      data-testid="context-items-peek-item"
    >
      <div className="flex w-full items-center">
        {getContextItemIcon()}
        <div className="flex min-w-0 flex-1 gap-2 text-xs">
          <div
            className={`max-w-[50%] flex-shrink-0 truncate ${isUrl ? "hover:underline" : ""}`}
          >
            {contextItem.name}
          </div>
          <div
            className={`min-w-0 flex-1 overflow-hidden truncate whitespace-nowrap text-xs text-gray-400 ${isUrl ? "hover:underline" : ""}`}
          >
            {contextItem.uri?.type === "file"
              ? getUriPathBasename(contextItem.description)
              : contextItem.description}
          </div>
        </div>

        {isUrl && (
          <ArrowTopRightOnSquareIcon className="mx-2 h-4 w-4 flex-shrink-0 text-gray-400 opacity-0 group-hover:opacity-100" />
        )}
      </div>
    </div>
  );
}

function ContextItemsPeek({
  contextItems,
  isCurrentContextPeek,
}: ContextItemsPeekProps) {
  const [open, setOpen] = useState(false);

  const ctxItems = useMemo(() => {
    return contextItems?.filter((ctxItem) => !ctxItem.hidden) ?? [];
  }, [contextItems]);

  const isGatheringContext = useAppSelector(selectIsGatheringContext);

  const indicateIsGathering = isCurrentContextPeek && isGatheringContext;

  if ((!ctxItems || ctxItems.length === 0) && !indicateIsGathering) {
    return null;
  }

  return (
    <div
      className={`pl-2 pt-2`}
      style={{
<<<<<<< HEAD
        paddingLeft: "8px",
        paddingTop: "8px",
        backgroundColor: window.isPearOverlay ?  "transparent" : vscBackground,
=======
        backgroundColor: vscBackground,
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      }}
    >
      <div
        className="flex cursor-pointer items-center justify-start text-xs text-gray-300"
        onClick={() => setOpen((prev) => !prev)}
        data-testid="context-items-peek"
      >
        <div className="relative mr-1 h-4 w-4">
          <ChevronRightIcon
            className={`absolute h-4 w-4 transition-all duration-200 ease-in-out text-[${lightGray}] ${
              open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
            }`}
          />
          <ChevronDownIcon
<<<<<<< HEAD
            width="1.0em"
            height="1.0em"
            style={{ color: lightGray }}
          ></ChevronDownIcon>
        )}
        <span className="ms-1">Context Used</span>
      </div>
      {open && (
        <div
          style={{
            paddingTop: "2px",
          }}
        >
          {props.contextItems?.map((contextItem, idx) => {
            if (contextItem.description.startsWith("http")) {
              return (
                <a
                  key={idx}
                  href={isSafeUrl(contextItem.description) ? contextItem.description : '#'} // Protects against Client-side URL Redirects
                  target="_blank"
                  style={{ color: vscForeground, textDecoration: "none" }}
                >
                  <ContextItemDiv
                    onClick={() => {
                      openContextItem(contextItem);
                    }}
                  >
                    {!!contextItem.icon ? (
                      <SafeImg
                        className="flex-shrink-0 pr-2"
                        src={contextItem.icon}
                        height="18em"
                        width="18em"
                        fallback={null}
                      />
                    ) : (
                      <FileIcon
                        filename={
                          contextItem.description
                            .split(" ")
                            .shift()
                            .split("#")
                            .shift() || ""
                        }
                        height="1.6em"
                        width="1.6em"
                      ></FileIcon>
                    )}
                    {contextItem.name}
                  </ContextItemDiv>
                </a>
              );
            }

            return (
              <ContextItemDiv
                key={idx}
                onClick={() => {
                  openContextItem(contextItem);
                }}
              >
                {!!contextItem.icon ? (
                  <SafeImg
                    className="flex-shrink-0 pr-2"
                    src={contextItem.icon}
                    height="18em"
                    width="18em"
                    fallback={null}
                  />
                ) : (
                  <FileIcon
                    filename={contextItem.description.split(" ").shift()}
                    height="1.6em"
                    width="1.6em"
                  ></FileIcon>
                )}
                {contextItem.name}
              </ContextItemDiv>
            );
          })}
=======
            className={`absolute h-4 w-4 transition-all duration-200 ease-in-out text-[${lightGray}] ${
              open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
            }`}
          />
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
        </div>
        <span className="ml-1 text-xs text-gray-400 transition-colors duration-200">
          {isGatheringContext ? (
            <>
              Gathering context
              <AnimatedEllipsis />
            </>
          ) : (
            `${ctxItems.length} context ${
              ctxItems.length > 1 ? "items" : "item"
            }`
          )}
        </span>
      </div>

      <div
        className={`mt-2 overflow-y-auto transition-all duration-300 ease-in-out ${
          open ? "max-h-[50vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {ctxItems &&
          ctxItems.map((contextItem, idx) => (
            <ContextItemsPeekItem key={idx} contextItem={contextItem} />
          ))}
      </div>
    </div>
  );
}

export default ContextItemsPeek;
