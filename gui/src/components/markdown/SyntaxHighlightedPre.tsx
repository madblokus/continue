import { useContext } from "react";
import styled from "styled-components";
<<<<<<< HEAD
import { vscBackground, vscButtonBackground, vscEditorBackground, vscForeground } from "..";
=======
import { defaultBorderRadius, vscForeground } from "..";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import { VscThemeContext } from "../../context/VscTheme";

const generateThemeStyles = (theme: any) => {
  return Object.keys(theme)
    .map((key) => {
      return `
        & ${key} {
          color: ${theme[key]};
        }
      `;
    })
    .join("");
};

const StyledPre = styled.pre<{ theme: any }>`
  & .hljs {
    color: ${vscForeground};
    background: ${window.isPearOverlay ? vscBackground : vscEditorBackground};
  }

  margin-top: 0;
  margin-bottom: 0;
  border-radius: 0 0 ${defaultBorderRadius} ${defaultBorderRadius} !important;

  ${(props) => generateThemeStyles(props.theme)}
`;

export const SyntaxHighlightedPre = (props: any) => {
  const currentTheme = useContext(VscThemeContext);
  return <StyledPre {...props} theme={currentTheme.theme} />;
};
