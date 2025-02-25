import { Listbox } from "@headlessui/react";
import {
<<<<<<< HEAD
=======
  ChevronDownIcon,
  Cog6ToothIcon,
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  CubeIcon,
  PlusIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { useContext, useEffect, useRef, useState } from "react";
<<<<<<< HEAD
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
=======
import { useDispatch } from "react-redux";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import styled from "styled-components";
import { lightGray, vscEditorBackground } from "..";
import { IdeMessengerContext } from "../../context/IdeMessenger";
<<<<<<< HEAD
import { providers } from "../../pages/AddNewModel/configs/providers";
import { defaultModelSelector } from "../../redux/selectors/modelSelectors";
import { setDefaultModel } from "../../redux/slices/stateSlice";
=======
import AddModelForm from "../../forms/AddModelForm";
import { useAppSelector } from "../../redux/hooks";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import {
  selectDefaultModel,
  setDefaultModel,
} from "../../redux/slices/configSlice";
import { setDialogMessage, setShowDialog } from "../../redux/slices/uiSlice";
import {
  getFontSize,
  getMetaKeyLabel,
  isMetaEquivalentKeyPressed,
} from "../../util";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import { Divider } from "./platform/shared";

interface ModelOptionProps {
  option: Option;
  idx: number;
  showMissingApiKeyMsg: boolean;
  showDelete?: boolean;
}

interface Option {
  value: string;
  title: string;
  apiKey?: string;
}

const MAX_HEIGHT_PX = 300;

const StyledListboxButton = styled(Listbox.Button)`
  border: solid 1px ${lightGray}30;
  background-color: transparent;
  border-radius: 4px;
  padding: 2px 4px;
  margin: 0 2px;
  align-items: center;
  gap: 2px;
	user-select: none;
  cursor: pointer;
  font-size: ${getFontSize() - 3}px;
  color: ${lightGray};
  &:focus {
    outline: none;
  }
`;

<<<<<<< HEAD
const StyledListboxOptions = styled(Listbox.Options) <{ newSession: boolean }>`
  list-style: none;
  padding: 6px;
  white-space: nowrap;
  cursor: default;
  z-index: 50;
  border: 1px solid ${lightGray}30;
  border-radius: 10px;
  background-color: ${vscEditorBackground};
  max-height: 300px;
  overflow-y: auto;
	font-size: ${getFontSize() - 2}px;
	user-select: none;
	outline:none;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;

  & > * {
    margin: 4px 0;
  }
`;

interface ListboxOptionProps {
  isCurrentModel?: boolean;
}

const StyledListboxOption = styled(Listbox.Option) <ListboxOptionProps>`
  cursor: pointer;
  border-radius: 6px;
  padding: 5px 4px;

  &:hover {
    background: ${(props) =>
    props.isCurrentModel ? `${lightGray}66` : `${lightGray}33`};
  }

  background: ${(props) =>
    props.isCurrentModel ? `${lightGray}66` : "transparent"};
=======
const StyledListboxOptions = styled(Listbox.Options)<{ $showabove: boolean }>`
  margin-top: 4px;
  position: absolute;
  list-style: none;
  padding: 0px;
  white-space: nowrap;
  cursor: default;

  display: flex;
  flex-direction: column;

  border-radius: ${defaultBorderRadius};
  border: 0.5px solid ${lightGray};
  background-color: ${vscInputBackground};

  max-height: ${MAX_HEIGHT_PX}px;
  overflow-y: scroll;

  scrollbar-width: none;

  ${(props) => (props.$showabove ? "bottom: 100%;" : "top: 100%;")}
`;

const StyledListboxOption = styled(Listbox.Option)<{ isDisabled?: boolean }>`
  border-radius: ${defaultBorderRadius};
  padding: 6px 12px;

  ${({ isDisabled }) =>
    !isDisabled &&
    `
    cursor: pointer;

    &:hover {
      background: ${lightGray}33;
    }
  `}

  ${({ isDisabled }) =>
    isDisabled &&
    `
    opacity: 0.5;
  `}
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
`;

const IconBase = styled.div<{ $hovered: boolean }>`
  width: 1.2em;
  height: 1.2em;
  cursor: pointer;
  padding: 4px;
  border-radius: ${defaultBorderRadius};
  opacity: ${(props) => (props.$hovered ? 0.75 : 0)};
  visibility: ${(props) => (props.$hovered ? "visible" : "hidden")};

  &:hover {
    opacity: 1;
    background-color: ${lightGray}33;
  }
`;

<<<<<<< HEAD
const Divider = styled.div`
  height: 2px;
  background-color: ${lightGray}35;
  margin: 0px 4px;
`;
=======
const StyledTrashIcon = styled(IconBase).attrs({ as: TrashIcon })``;
const StyledCog6ToothIcon = styled(IconBase).attrs({ as: Cog6ToothIcon })``;

function modelSelectTitle(model: any): string {
  if (model?.title) return model?.title;
  if (model?.model !== undefined && model?.model.trim() !== "") {
    if (model?.class_name) {
      return `${model?.class_name} - ${model?.model}`;
    }
    return model?.model;
  }
  return model?.class_name;
}
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

function ModelOption({
  option,
  idx,
  showDelete,
<<<<<<< HEAD
}: {
  option: Option;
  idx: number;
  showDelete?: boolean;
}) {
  const defaultModel = useSelector(defaultModelSelector);
=======
  showMissingApiKeyMsg,
}: ModelOptionProps) {
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  const ideMessenger = useContext(IdeMessengerContext);
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState(false);

  function onClickDelete(e: any) {
    e.stopPropagation();
    e.preventDefault();

    dispatch(setShowDialog(true));
    dispatch(
      setDialogMessage(
        <ConfirmationDialog
          title={`Delete ${option.title}`}
          text={`Are you sure you want to remove ${option.title} from your configuration?`}
          onConfirm={() => {
            ideMessenger.post("config/deleteModel", {
              title: option.title,
            });
          }}
        />,
      ),
    );
  }

  function onClickGear(e: any) {
    e.stopPropagation();
    e.preventDefault();

    ideMessenger.post("config/openProfile", {
      profileId: "local",
    });
  }

  function handleOptionClick(e: any) {
    if (showMissingApiKeyMsg) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  return (
    <StyledListboxOption
      key={idx}
      value={option.value}
<<<<<<< HEAD
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      isCurrentModel={defaultModel?.title === option.title}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {option.provider === 'pearai_server' ? (
            <div className="flex items-center gap-1 mr-2">
              <img
                src={`${window.vscMediaUrl}/logos/pearai-color.png`}
                className="w-4 h-4 object-contain"
              />
              {!option.title.toLowerCase().includes('pearai model') && <img
                src={`${window.vscMediaUrl}/logos/${(() => {
                  const modelTitle = option.title.toLowerCase();
                  switch (true) {
                    case modelTitle.includes('claude'):
                      return 'anthropic.png';
                    case modelTitle.includes('deepseek'):
                      return 'deepseek-svg.svg';
                    case modelTitle.includes('gemini'):
                      return 'gemini-icon.png';
                    case modelTitle.includes('gpt') || modelTitle.startsWith('o'): // OpenAI naming :(
                      return 'openai.png';
                    default:
                      return 'default.png';
                  }
                })()}`}
                className="w-3.5 h-3.5 object-contain rounded-sm"
              />}
            </div>
          ) : (
            option.provider ? <img
              src={`${window.vscMediaUrl}/logos/${providers[option.provider]?.icon}`}
              className="w-3.5 h-3.5 mr-2 flex-none object-contain rounded-sm"
            /> : <CubeIcon className="w-3.5 h-3.5 stroke-2 mr-2 flex-shrink-0" />
          )}
          <span>{option.title}</span>
        </div>
        <StyledTrashIcon
          style={{ visibility: hovered && showDelete ? "visible" : "hidden" }}
          className="ml-auto"
          width="1.2em"
          height="1.2em"
          onClick={onClickDelete}
        />
=======
      isDisabled={showMissingApiKeyMsg}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleOptionClick}
    >
      <div className="flex w-full flex-col gap-0.5">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-grow items-center">
            <CubeIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="flex-grow">
              {option.title}
              {showMissingApiKeyMsg && (
                <span className="ml-2 text-[10px] italic">
                  (Missing API key)
                </span>
              )}
            </span>
          </div>
          <div className="ml-5 flex items-center">
            <StyledCog6ToothIcon $hovered={hovered} onClick={onClickGear} />
            {showDelete && (
              <StyledTrashIcon $hovered={hovered} onClick={onClickDelete} />
            )}
          </div>
        </div>
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      </div>
    </StyledListboxOption>
  );
}

<<<<<<< HEAD
function modelSelectTitle(model: any): string {
  if (model?.title) return model?.title;
  if (model?.model !== undefined && model?.model.trim() !== "") {
    if (model?.class_name) {
      return `${model?.class_name} - ${model?.model}`;
    }
    return model?.model;
  }
  return model?.class_name;
}

interface Option {
  value: string;
  title: string;
  provider: string;
  isDefault: boolean;
}

=======
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
function ModelSelect() {
  const state = useSelector((state: RootState) => state.state);
  const dispatch = useDispatch();
<<<<<<< HEAD
  const defaultModel = useSelector(defaultModelSelector);
  const allModels = useSelector((state: RootState) => state.state.config.models);
  const navigate = useNavigate();
  const ideMessenger = useContext(IdeMessengerContext);

  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const selectedProfileId = useSelector(
    (store: RootState) => store.state.selectedProfileId
=======
  const defaultModel = useAppSelector(selectDefaultModel);
  const allModels = useAppSelector((state) => state.config.config.models);
  const ideMessenger = useContext(IdeMessengerContext);
  const [showAbove, setShowAbove] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [sortedOptions, setSortedOptions] = useState<Option[]>([]);
  const selectedProfileId = useAppSelector(
    (store) => store.session.selectedProfileId,
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  );

  // Sort so that options without an API key are at the end
  useEffect(() => {
    const enabledOptions = options.filter((option) => option.apiKey !== "");
    const disabledOptions = options.filter((option) => option.apiKey === "");

    const sorted = [...enabledOptions, ...disabledOptions];

    setSortedOptions(sorted);
  }, [options]);

  useEffect(() => {
    setOptions(
      allModels
<<<<<<< HEAD
        .filter((model) => {
          return (
            !model?.title?.toLowerCase().includes("creator") &&
            !model?.title?.toLowerCase().includes("perplexity")
          );
        })
        .map((model) => ({
          value: model.title,
          title: modelSelectTitle(model),
          provider: model.provider,
          isDefault: model?.isDefault,
        }))
=======
        .filter((m) => !m.roles || m.roles.includes("chat"))
        .map((model) => {
          return {
            value: model.title,
            title: modelSelectTitle(model),
            apiKey: model.apiKey,
          };
        }),
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    );
  }, [allModels]);

  useEffect(() => {
<<<<<<< HEAD
    const calculatePosition = () => {
      if (!buttonRef.current || !isOpen) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const MENU_WIDTH = 312;
      const MENU_HEIGHT = 320;
      const PADDING = 10;

      let left = Math.max(PADDING, Math.min(
        buttonRect.left,
        window.innerWidth - MENU_WIDTH - PADDING
      ));

      let top = buttonRect.bottom + 5;
      if (top + MENU_HEIGHT > window.innerHeight - PADDING) {
        top = Math.max(PADDING, buttonRect.top - MENU_HEIGHT - 5);
      }

      setMenuPosition({ top, left });
    };

    calculatePosition();

    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [isOpen]);
=======
    const handleResize = () => calculatePosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "'" && isMetaEquivalentKeyPressed(event as any)) {
        const direction = event.shiftKey ? -1 : 1;
        const currentIndex = options.findIndex(
          (option) => option.value === defaultModel?.title
        );
        let nextIndex = (currentIndex + 1 * direction) % options.length;
        if (nextIndex < 0) nextIndex = options.length - 1;
        const newModelTitle = options[nextIndex].value;
        dispatch(setDefaultModel({ title: newModelTitle }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, defaultModel]);

  function calculatePosition() {
    if (!buttonRef.current) {
      return;
    }
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = MAX_HEIGHT_PX;

    setShowAbove(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
  }

  function onClickAddModel(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    // Close the dropdown
    if (buttonRef.current) {
      buttonRef.current.click();
    }
    dispatch(setShowDialog(true));
    dispatch(
      setDialogMessage(
        <AddModelForm
          onDone={() => {
            dispatch(setShowDialog(false));
          }}
        />,
      ),
    );
  }

  return (
    <Listbox
      onChange={async (val: string) => {
        if (val === defaultModel?.title) return;
        dispatch(setDefaultModel({ title: val }));
      }}
      as="div"
      className="flex max-w-[75%]"
    >
<<<<<<< HEAD
      {({ open }) => {
        useEffect(() => {
          setIsOpen(open);
        }, [open]);

        return (
          <>
            <StyledListboxButton
              ref={buttonRef}
              className="h-[18px] flex overflow-hidden"
            >
              {defaultModel?.provider === 'pearai_server' ? (
                <div className="flex flex-initial items-center">
                  <img
                    src={`${window.vscMediaUrl}/logos/pearai-color.png`}
                    className="w-[15px] h-[15px] object-contain"
                  />
                  {!defaultModel.title.toLowerCase().includes('pearai') && <img
                    src={`${window.vscMediaUrl}/logos/${(() => {
                      const modelTitle = defaultModel.title.toLowerCase();
                      switch (true) {
                        case modelTitle.includes('claude'):
                          return 'anthropic.png';
                        case modelTitle.includes('gpt'):
                          return 'openai.png';
                        case modelTitle.includes('deepseek'):
                          return 'deepseek-svg.svg';
                        case modelTitle.includes('gemini'):
                          return 'gemini-icon.png';
                        default:
                          return 'default.png';
                      }
                    })()}`}
                    className="w-[15px] h-[12px] object-contain rounded-sm"
                  />}
                </div>
              ) : (
                <img
                  src={`${window.vscMediaUrl}/logos/${providers[defaultModel?.provider]?.icon}`}
                  width="18px"
                  height="18px"
                  style={{
                    objectFit: "contain",
                  }}
                />
              )}
              <span className="truncate inline-block min-w-0">
                {modelSelectTitle(defaultModel) || "Select model"}{" "}
              </span>
            </StyledListboxButton>

            {open && (
              <StyledListboxOptions
                newSession={state.history.length === 0}
                style={{
                  position: 'fixed',
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                }}
              >
                <span
                  style={{
                    color: lightGray,
                    padding: "2px",
                    marginTop: "2px",
                    display: "block",
                    textAlign: "center",
                    fontSize: getFontSize() - 3,
                  }}
                >
                  Press <kbd className="font-mono">{getMetaKeyLabel()}</kbd>{" "}
                  <kbd className="font-mono">'</kbd> to cycle between models.
                </span>
                <Divider />
                <StyledListboxOption
                  key={options.length}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate("/addModel");
                  }}
                  value={"addModel" as any}
                >
                  <div className="flex items-center">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Model
                  </div>
                </StyledListboxOption>
                <Divider />
                {options
                  .filter((option) => option.isDefault)
                  .map((option, idx) => (
                    <ModelOption
                      option={option}
                      idx={idx}
                      key={idx}
                      showDelete={!option.isDefault}
                    />
                  ))}

                {selectedProfileId === "local" && (
                  <>
                    {options.length > 0 && <Divider />}
                    {options
                      .filter((option) => !option.isDefault)
                      .map((option, idx) => (
                        <ModelOption
                          key={idx}
                          option={option}
                          idx={idx}
                          showDelete={!option.isDefault}
                        />
                      ))}
                  </>
                )}
              </StyledListboxOptions>
            )}
          </>
        );
      }}
=======
      <div className="relative">
        <StyledListboxButton
          data-testid="model-select-button"
          ref={buttonRef}
          className="h-[18px] overflow-hidden"
          style={{ padding: 0 }}
          onClick={calculatePosition}
        >
          <div className="flex max-w-[33vw] items-center gap-0.5 text-gray-400 transition-colors duration-200">
            <span className="truncate">
              {modelSelectTitle(defaultModel) || "Select model"}{" "}
            </span>
            <ChevronDownIcon
              className="h-3 w-3 flex-shrink-0"
              aria-hidden="true"
            />
          </div>
        </StyledListboxButton>
        <StyledListboxOptions
          $showabove={showAbove}
          className="z-50 max-w-[90vw]"
        >
          <div
            className={`max-h-[${MAX_HEIGHT_PX}px] no-scrollbar overflow-y-scroll`}
          >
            {sortedOptions.map((option, idx) => (
              <ModelOption
                option={option}
                idx={idx}
                key={idx}
                showDelete={options.length > 1}
                showMissingApiKeyMsg={option.apiKey === ""}
              />
            ))}
          </div>

          <div className="mt-auto">
            <Divider className="!my-0" />

            {selectedProfileId === "local" && (
              <>
                <StyledListboxOption
                  key={options.length}
                  onClick={onClickAddModel}
                  value={"addModel" as any}
                >
                  <div className="flex items-center py-0.5">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Chat model
                  </div>
                </StyledListboxOption>
              </>
            )}

            <Divider className="!my-0" />

            <span className="block px-3 py-3" style={{ color: lightGray }}>
              <code>{getMetaKeyLabel()} + '</code> to toggle
            </span>
          </div>
        </StyledListboxOptions>
      </div>
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    </Listbox>
  );
}

export default ModelSelect;