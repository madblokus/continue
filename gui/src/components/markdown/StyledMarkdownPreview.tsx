import { ctxItemToRifWithContents } from "core/commands/util";
import { memo, useEffect, useMemo } from "react";
import { useRemark } from "react-remark";
import rehypeHighlight, { Options } from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import styled from "styled-components";
import { visit } from "unist-util-visit";
import { v4 as uuidv4 } from "uuid";
import {
  defaultBorderRadius,
  vscBackground,
  vscEditorBackground,
  vscForeground,
} from "..";
import useUpdatingRef from "../../hooks/useUpdatingRef";
import { useAppSelector } from "../../redux/hooks";
import { selectUIConfig } from "../../redux/slices/configSlice";
import { getContextItemsFromHistory } from "../../redux/thunks/updateFileSymbols";
import { getFontSize, isJetBrains } from "../../util";
import { ToolTip } from "../gui/Tooltip";
import FilenameLink from "./FilenameLink";
import "./katex.css";
import "./markdown.css";
<<<<<<< HEAD
import { Citation } from "core";

const StyledMarkdown = styled.div<{
  fontSize?: number;
  showBorder?: boolean;
	isCodeSnippet?: boolean;
}>`
  pre {
    background-color: ${window.isPearOverlay ?  vscBackground : vscEditorBackground};
=======
import StepContainerPreActionButtons from "./StepContainerPreActionButtons";
import StepContainerPreToolbar from "./StepContainerPreToolbar";
import SymbolLink from "./SymbolLink";
import { SyntaxHighlightedPre } from "./SyntaxHighlightedPre";
import { isSymbolNotRif, matchCodeToSymbolOrFile } from "./utils";
import { fixDoubleDollarNewLineLatex } from "./utils/fixDoubleDollarLatex";
import { patchNestedMarkdown } from "./utils/patchNestedMarkdown";
import { remarkTables } from "./utils/remarkTables";

const StyledMarkdown = styled.div<{
  fontSize?: number;
  whiteSpace: string;
  bgColor: string;
}>`
  pre {
    white-space: ${(props) => props.whiteSpace};
    background-color: ${vscEditorBackground};
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    border-radius: ${defaultBorderRadius};

    max-width: calc(100vw - 24px);
    overflow-x: scroll;
    overflow-y: hidden;

<<<<<<< HEAD
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    -ms-overflow-style: none;
    scroll-behavior: smooth;

    ${(props) => {
      if (props.showBorder) {
        return `
          border: 0.5px solid #8888;
        `;
      }
    }}
    padding: ${props => props.isCodeSnippet ? '0px 4px 4px 4px' : '32px 12px 12px 12px'};
=======
    padding: 16px 8px;
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  }

  code {
    span.line:empty {
      display: none;
    }
    word-wrap: break-word;
    background-color: ${vscEditorBackground};
    font-size: ${getFontSize() - 2}px;
    font-family: var(--vscode-editor-font-family);
  }

  code:not(pre > code) {
    font-family: var(--vscode-editor-font-family);
    color: #f78383;
  }

<<<<<<< HEAD
  background-color: ${window.isPearOverlay ?  "transparent" : vscBackground};
=======
  background-color: ${(props) => props.bgColor};
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  font-family:
    var(--vscode-font-family),
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    "Open Sans",
    "Helvetica Neue",
    sans-serif;
  font-size: ${(props) => props.fontSize || getFontSize()}px;
  padding-left: 8px;
  padding-right: 8px;
  color: ${vscForeground};

  p,
  li,
  ol,
  ul {
    line-height: 1.5;
  }

  > *:first-child {
    margin-top: 8px;
  }

  > *:last-child {
    margin-bottom: 0;
  }
`;

interface StyledMarkdownPreviewProps {
  source?: string;
  className?: string;
  isRenderingInStepContainer?: boolean; // Currently only used to control the rendering of codeblocks
  scrollLocked?: boolean;
<<<<<<< HEAD
  isStreaming?: boolean;
  isLast?: boolean;
  messageIndex?: number;
  integrationSource?: "perplexity" | "continue";
  citations?: Citation[];
	isCodeSnippet?: boolean;
}

interface FadeInWordsProps extends StyledMarkdownPreviewProps {
  children: any;
}

const FadeInWords: React.FC<FadeInWordsProps> = (props: FadeInWordsProps) => {
  const { children, integrationSource, isStreaming, messageIndex, showCodeBorder, isLast, ...otherProps } = props;
  const active = props.integrationSource === "continue"
    ? useSelector((store: RootState) => store.state.active)
    : useSelector((store: RootState) => store.state.perplexityActive)

  // Get the appropriate history based on the source
  const history = useSelector((store: RootState) => {
    switch (integrationSource) {
      case "perplexity":
        return store.state.perplexityHistory;
      default:
        return store.state.history;
    }
  });

  // The last message in the history array is the one being streamed
  // Only apply animation after initial render
  const isStreamingMessage = active && messageIndex === history.length - 1;

  const words = children
    .map((child, childIndex) => {
      if (typeof child === "string") {
        return child.split(/(\s+)/).map((word, index) => (
          <span
            className={word.trim() && isStreamingMessage ? "fade-in-span" : undefined}
            key={`${childIndex}-${index}-${word}`}
          >
            {word}
          </span>
        ));
      } else {
        return <span key={`child-${childIndex}`} className={isStreamingMessage ? "fade-in-span" : undefined}>{child}</span>;
      }
    })
    .flat();

  return <p {...otherProps}>{words}</p>;
};
=======
  itemIndex?: number;
  useParentBackgroundColor?: boolean;
}

const HLJS_LANGUAGE_CLASSNAME_PREFIX = "language-";

function getLanuageFromClassName(className: any): string | null {
  if (!className || typeof className !== "string") {
    return null;
  }

  const language = className
    .split(" ")
    .find((word) => word.startsWith(HLJS_LANGUAGE_CLASSNAME_PREFIX))
    ?.split("-")[1];

  return language ?? null;
}

function getCodeChildrenContent(children: any) {
  if (typeof children === "string") {
    return children;
  } else if (
    Array.isArray(children) &&
    children.length > 0 &&
    typeof children[0] === "string"
  ) {
    return children[0];
  }
  return undefined;
}
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d


interface FadeInElementProps extends StyledMarkdownPreviewProps {
  children: any;
  as?: keyof JSX.IntrinsicElements;
}


const FadeInElement: React.FC<FadeInElementProps> = (props: FadeInElementProps) => {
  const { children, integrationSource, isStreaming, messageIndex, showCodeBorder, isLast, as = 'p', ...otherProps } = props;
  const ElementType = as;

  const active = props.integrationSource === "continue"
    ? useSelector((store: RootState) => store.state.active)
    : useSelector((store: RootState) => store.state.perplexityActive)

  const history = useSelector((store: RootState) => {
    switch (integrationSource) {
      case "perplexity":
        return store.state.perplexityHistory;
      default:
        return store.state.history;
    }
  });

  // The last message in the history array is the one being streamed
  const isStreamingMessage = active && messageIndex === history.length - 1;

  if (!children) {
    return <ElementType {...otherProps}></ElementType>;
  }

  if (typeof children === 'string' || !Array.isArray(children)) {
    return (
      <ElementType {...otherProps}>
        <span className={isStreamingMessage ? "fade-in-span" : undefined}>
          {children}
        </span>
      </ElementType>
    );
  }

  const words = children
    .map((child, childIndex) => {
      if (!child) return null;
      if (typeof child === "string") {
        return child.split(/(\s+)/).map((word, index) => (
          <span
            className={word.trim() && isStreamingMessage ? "fade-in-span" : undefined}
            key={`${childIndex}-${index}-${word}`}
          >
            {word}
          </span>
        ));
      } else {
        return React.cloneElement(child, {
          key: `element-${childIndex}`,
          className: isStreamingMessage ? "fade-in-span" : undefined
        });
      }
    })
    .filter(Boolean)
    .flat();

  return <ElementType {...otherProps}>{words}</ElementType>;
};

const processCitations = (text: string, citations?: Citation[]) => {
  if (!citations) return text;

  return text.replace(/\[(\d+)\]/g, (match, num) => {
    const citation = citations[parseInt(num) - 1];
    if (!citation) return match;
    return `[[${num}]](${citation.url})`;
  });
};


const StyledMarkdownPreview = memo(function StyledMarkdownPreview(
  props: StyledMarkdownPreviewProps,
) {
  // The refs are a workaround because rehype options are stored on initiation
  // So they won't use the most up-to-date state values
  // So in this case we just put them in refs

  // The logic here is to get file names from
  // 1. Context items found in past messages
  // 2. Toolbar Codeblocks found in past messages
  const history = useAppSelector((state) => state.session.history);
  const allSymbols = useAppSelector((state) => state.session.symbols);
  const pastFileInfo = useMemo(() => {
    const index = props.itemIndex;
    if (index === undefined) {
      return {
        symbols: [],
        rifs: [],
      };
    }
    const pastContextItems = getContextItemsFromHistory(history, index);
    const rifs = pastContextItems.map((item) =>
      ctxItemToRifWithContents(item, true),
    );
    const symbols = Object.entries(allSymbols)
      .filter((e) => pastContextItems.find((item) => item.uri!.value === e[0]))
      .map((f) => f[1])
      .flat();

    return {
      symbols,
      rifs,
    };
  }, [props.itemIndex, history, allSymbols]);
  const pastFileInfoRef = useUpdatingRef(pastFileInfo);

  const [reactContent, setMarkdownSource] = useRemark({
    remarkPlugins: [
      remarkTables,
      [
        remarkMath,
        {
          singleDollarTextMath: false,
        },
      ],
      () => (tree: any) => {
        const lastNode = tree.children[tree.children.length - 1];
        const lastCodeNode = lastNode.type === "code" ? lastNode : null;

        visit(tree, "code", (node: any) => {
          if (!node.lang) {
            node.lang = "javascript";
          } else if (node.lang.includes(".")) {
            node.lang = node.lang.split(".").slice(-1)[0];
          }

          node.data = node.data || {};
          node.data.hProperties = node.data.hProperties || {};

          node.data.hProperties["data-isgeneratingcodeblock"] =
            lastCodeNode === node;
          node.data.hProperties["data-codeblockcontent"] = node.value;

          if (node.meta) {
            let meta = node.meta.split(" ");
            node.data.hProperties["data-relativefilepath"] = meta[0];
            node.data.hProperties.range = meta[1];
          }
        });
      },
    ],
    rehypePlugins: [
      rehypeKatex as any,
      {},
      rehypeHighlight as any,
      // Note: An empty obj is the default behavior, but leaving this here for scaffolding to
      // add unsupported languages in the future. We will need to install the `lowlight` package
      // to use the `common` language set in addition to unsupported languages.
      // https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md
      {
        // languages: {},
      } as Options,
      () => {
        let codeBlockIndex = 0;
        return (tree) => {
          visit(tree, { tagName: "pre" }, (node: any) => {
            // Add an index (0, 1, 2, etc...) to each code block.
            node.properties = { "data-codeblockindex": codeBlockIndex };
            codeBlockIndex++;
          });
        };
      },
      {},
    ],
    rehypeReactOptions: {
      components: {
        a: ({ ...aProps }) => {
          const tooltipId = uuidv4();

          return (
            <>
              <a
                href={aProps.href}
                target="_blank"
                className="hover:underline"
                data-tooltip-id={tooltipId}
              >
                {aProps.children}
              </a>
              <ToolTip id={tooltipId} place="top" className="m-0 p-0">
                {aProps.href}
              </ToolTip>
            </>
          );
        },
        pre: ({ ...preProps }) => {
          const codeBlockIndex = preProps["data-codeblockindex"];

          const preChildProps = preProps?.children?.[0]?.props ?? {};
          const { className, range } = preChildProps;
          const relativeFilePath = preChildProps["data-relativefilepath"];
          const codeBlockContent = preChildProps["data-codeblockcontent"];
          const isGeneratingCodeBlock =
            preChildProps["data-isgeneratingcodeblock"];

          if (!props.isRenderingInStepContainer) {
            return <SyntaxHighlightedPre {...preProps} />;
          }

          const language = getLanuageFromClassName(className);

          // If we don't have a filepath show the more basic toolbar
          // that is just action buttons on hover.
          // We also use this in JB since we haven't yet implemented
          // the logic forfileUri lazy apply.
          if (!relativeFilePath || isJetBrains()) {
            return (
              <StepContainerPreActionButtons
                language={language}
                codeBlockContent={codeBlockContent}
                codeBlockIndex={codeBlockIndex}
              >
                <SyntaxHighlightedPre {...preProps} />
              </StepContainerPreActionButtons>
            );
          }

          // We use a custom toolbar for codeblocks in the step container
          return (
            <StepContainerPreToolbar
              codeBlockContent={codeBlockContent}
              codeBlockIndex={codeBlockIndex}
              language={language}
              relativeFilepath={relativeFilePath}
              isGeneratingCodeBlock={isGeneratingCodeBlock}
              range={range}
            >
              <SyntaxHighlightedPre {...preProps} />
            </StepContainerPreToolbar>
          );
        },
<<<<<<< HEAD
        //   pre: ({ node, ...preProps }) => {
        //     const codeString =
        //       preProps.children?.[0]?.props?.children?.[0].trim() || "";
        //     const monacoEditor = (
        //       <MonacoCodeBlock
        //         showBorder={props.showCodeBorder}
        //         language={
        //           preProps.children?.[0]?.props?.className?.split("-")[1] ||
        //           "typescript"
        //         }
        //         preProps={preProps}
        //         codeString={codeString}
        //       />
        //     );
        //     return props.showCodeBorder ? (
        //       <PreWithToolbar copyvalue={codeString}>
        //         <SyntaxHighlightedPre {...preProps}></SyntaxHighlightedPre>
        //       </PreWithToolbar>
        //     ) : (
        //       <SyntaxHighlightedPre {...preProps}></SyntaxHighlightedPre>
        //     );
        //   },

        h1: ({ node, ...hProps }) => {
          if (props.isLast) {
            return (
              <FadeInElement as="h1" {...hProps} {...props}>
                {hProps.children}
              </FadeInElement>
            );
          }
          return <h1 {...hProps}>{hProps.children}</h1>;
        },
        h2: ({ node, ...hProps }) => {
          if (props.isLast) {
            return (
              <FadeInElement as="h2" {...hProps} {...props}>
                {hProps.children}
              </FadeInElement>
            );
          }
          return <h2 {...hProps}>{hProps.children}</h2>;
        },
        h3: ({ node, ...hProps }) => {
          if (props.isLast) {
            return (
              <FadeInElement as="h3" {...hProps} {...props}>
                {hProps.children}
              </FadeInElement>
            );
          }
          return <h3 {...hProps}>{hProps.children}</h3>;
        },
        h4: ({ node, ...hProps }) => {
          if (props.isLast) {
            return (
              <FadeInElement as="h4" {...hProps} {...props}>
                {hProps.children}
              </FadeInElement>
            );
          }
          return <h4 {...hProps}>{hProps.children}</h4>;
        },

        p: ({ node, ...pProps }) => {
          // pProps is the props of the paragraph node from rehypeReact
          // props is the actual props of StyledMarkdownPreview
          if (props.isLast) {
            return (
              <FadeInWords {...pProps} {...props}>
                {pProps.children}
              </FadeInWords>
            );
          }
          return <p {...pProps}>{pProps.children}</p>;
        },
        li: ({ node, ...liProps }) => {
          // liProps is the actual props of li node from rehype-react
          // props is the actual props of StyledMarkdownPreview
          if (props.isLast) {
            return (
              <FadeInElement as="li" {...liProps} {...props}>
                {liProps.children}
              </FadeInElement>
            );
          }
          return <li {...liProps}>{liProps.children}</li>;
        },
        ul: ({ node, ...ulProps }) => {
          // ulProps is the actual props of ul node from rehype-react
          // props is the actual props of StyledMarkdownPreview
          if (props.isLast) {
            return (
              <FadeInElement as="ul" {...ulProps} {...props}>
                {ulProps.children}
              </FadeInElement>
            );
          }
          return <ul {...ulProps}>{ulProps.children}</ul>;
        },
        ol: ({ node, ...olProps }) => {
          // olProps is the actual props of ol node from rehype-react
          // props is the actual props of StyledMarkdownPreview
          if (props.isLast) {
            return (
              <FadeInElement as="ol" {...olProps} {...props}>
                {olProps.children}
              </FadeInElement>
            );
          }
          return <ol {...olProps}>{olProps.children}</ol>;
=======
        code: ({ ...codeProps }) => {
          const content = getCodeChildrenContent(codeProps.children);

          if (content) {
            const { symbols, rifs } = pastFileInfoRef.current;

            const matchedSymbolOrFile = matchCodeToSymbolOrFile(
              content,
              symbols,
              rifs,
            );
            if (matchedSymbolOrFile) {
              if (isSymbolNotRif(matchedSymbolOrFile)) {
                return (
                  <SymbolLink content={content} symbol={matchedSymbolOrFile} />
                );
              } else {
                return <FilenameLink rif={matchedSymbolOrFile} />;
              }
            }
          }
          return <code {...codeProps}>{codeProps.children}</code>;
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
        },
      },
    },
  });

  useEffect(() => {
    setMarkdownSource(
      // some patches to source markdown are applied here:
      fixDoubleDollarNewLineLatex(patchNestedMarkdown(props.source ?? "")),
    );
  }, [props.source, allSymbols]);

<<<<<<< HEAD
  useEffect(() => {
    const processedSource = processCitations(props.source || "", props.citations);
    setMarkdownSource(processedSource);
  }, [props.source, props.citations]);

  return (
    <StyledMarkdown fontSize={getFontSize()} showBorder={false} isCodeSnippet={props.isCodeSnippet}>
=======
  const uiConfig = useAppSelector(selectUIConfig);
  const codeWrapState = uiConfig?.codeWrap ? "pre-wrap" : "pre";
  return (
    <StyledMarkdown
      fontSize={getFontSize()}
      whiteSpace={codeWrapState}
      bgColor={props.useParentBackgroundColor ? "" : vscBackground}
    >
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      {reactContent}
    </StyledMarkdown>
  );
});

export default StyledMarkdownPreview;
