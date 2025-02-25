import { defaultBorderRadius } from "..";
<<<<<<< HEAD

export enum ModelProviderTags {
  RequiresApiKey = "Requires API Key",
  Local = "Local",
  Free = "Free",
  OpenSource = "Open-Source",
  Recommended = "Recommended",
  Hosted = "Hosted",
}
=======
import { MODEL_PROVIDER_TAG_COLORS, ModelProviderTags } from "./utils";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

export interface ModelProviderTagProps {
  tag: ModelProviderTags;
}

<<<<<<< HEAD
export const MODEL_PROVIDER_TAG_COLORS = {
  [ModelProviderTags.RequiresApiKey]: "#FF0000",
  [ModelProviderTags.Local]: "#00bb00",
  [ModelProviderTags.OpenSource]: "#0033FF",
  [ModelProviderTags.Free]: "#ffff00",
  [ModelProviderTags.Recommended]: "#1E90FF",
  [ModelProviderTags.Hosted]: "#008000",
};

export default function ModelProviderTag({ tag }: ModelProviderTagProps) {
=======
export function ModelProviderTag({ tag }: ModelProviderTagProps) {
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  return (
    <span
      style={{
        fontSize: "0.9em",
        backgroundColor: `${MODEL_PROVIDER_TAG_COLORS[tag]}55`,
        color: "white",
        padding: "2px 4px",
        borderRadius: defaultBorderRadius,
        marginRight: "4px",
      }}
    >
      {tag}
    </span>
  );
}
