import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import _ from "lodash";
import { useCallback, useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  Input,
  Select,
  defaultBorderRadius,
  lightGray,
  vscBackground,
} from "../../components";
import StyledMarkdownPreview from "../../components/markdown/StyledMarkdownPreview";
import ModelCard from "../../components/modelSelection/ModelCard";
import { ModelProviderTag } from "../../components/modelSelection/ModelProviderTag";
import { IdeMessengerContext } from "../../context/IdeMessenger";
import { useNavigationListener } from "../../hooks/useNavigationListener";
import { updatedObj } from "../../util";
import type { ProviderInfo } from "./configs/providers";
import { providers } from "./configs/providers";
import { setDefaultModel } from "../../redux/slices/configSlice";

const GridDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2rem;
  padding: 1rem;
  justify-items: center;
  align-items: center;
`;

export const CustomModelButton = styled.div<{ disabled: boolean }>`
  border: 1px solid ${lightGray};
  border-radius: ${defaultBorderRadius};
  padding: 4px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s;

  ${(props) =>
    props.disabled
      ? `
    opacity: 0.5;
    `
      : `
  &:hover {
    border: 1px solid #be1b55;
    background-color: #be1b5522;
    cursor: pointer;
  }
  `}
`;

const ErrorText = styled.div`
    color: #dc2626;
    font-size: 14px;
    margin-top: 8px;
`;

function ConfigureProvider() {
  useNavigationListener();
  const formMethods = useForm();
  const { providerName } = useParams();
  const ideMessenger = useContext(IdeMessengerContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modelInfo, setModelInfo] = useState<ProviderInfo | undefined>(
    undefined,
  );

<<<<<<< HEAD
  //  different authentication flow is required for watsonx. This state helps to determine which flow to use for authentication
  const [watsonxAuthenticate, setWatsonxAuthenticate] = React.useState(true);

  const { watch, handleSubmit } = formMethods;

=======
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  useEffect(() => {
    if (providerName) {
      setModelInfo(providers[providerName]);
    }
  }, [providerName]);

<<<<<<< HEAD
  // TODO: This is not being used - do we still need this?
  const handleContinue = () => {
    if (!modelInfo) return;

    let formParams: any = {};
    for (const d of modelInfo.collectInputFor || []) {
      const val = formMethods.watch(d.key);
      if (val === "" || val === undefined || val === null) continue;
      formParams = updatedObj(formParams, {
        [d.key]: d.inputType === "text" ? val : parseFloat(val),
      });
    }
    const model = {
      ...formParams,
      provider: modelInfo.provider,
    };
    ideMessenger.post("config/addModel", { model });
    dispatch(setDefaultModel({ title: model.title, force: true }));
    navigate("/");
  };

=======
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  const disableModelCards = useCallback(() => {
    return (
      modelInfo?.collectInputFor?.some((d) => {
        if (!d.required) return false;
        const val = formMethods.watch(d.key);
        return (
          typeof val === "undefined" || (typeof val === "string" && val === "")
        );
      }) || false
    );
  }, [modelInfo, formMethods]);

<<<<<<< HEAD
  const enablecardsForApikey = useCallback(() => {
    return modelInfo?.collectInputFor
      ?.filter((d) => d.isWatsonxAuthenticatedByApiKey)
      .some((d) => !formMethods.watch(d.key));
  }, [modelInfo, formMethods]);
  const enablecardsForCredentials = useCallback(() => {
    return modelInfo?.collectInputFor
      ?.filter((d) => d.isWatsonxAuthenticatedByCredentials)
      .some((d) => !formMethods.watch(d.key));
  }, [modelInfo, formMethods]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpenRouterSubmit = () => {
    const formValues = formMethods.getValues();
    const model = formValues.model;
    const apiKey = formValues.apiKey;

    if (!formValues.apiKey) {
      setErrorMessage("Please enter your OpenRouter API key");
      return;
    }

    if (!formValues.model) {
      setErrorMessage("Please select a model");
      return;
    }

    handleSubmit((data) => {
      const selectedPackage = providers.openrouter?.packages.find(
        (pkg) => pkg.params.model === model,
      );

      let formParams: any = {};

      for (const d of providers.openrouter?.collectInputFor || []) {
        const val = data[d.key];

        if (val === "" || val === undefined || val === null) {
          continue;
        }

        formParams = updatedObj(formParams, {
          [d.key]: d.inputType === "text" ? val : parseFloat(val),
        });
      }

      const modelConfig = {
        ...selectedPackage.params,
        ...providers.openrouter?.params,
        ...formParams,
        apiKey,
        model,
        provider: "openrouter",
        title:
          `${selectedPackage.title} (OpenRouter)` || `${model} (OpenRouter)`,
      };

      ideMessenger.post("config/addModel", { model: modelConfig });

      dispatch(
        setDefaultModel({
          title: modelConfig.title,
          force: true,
        }),
      );
      navigate("/");
    })();
  };

=======
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  return (
    <FormProvider {...formMethods}>
      <div className="overflow-y-scroll">
        <div
          className="sticky top-0 m-0 flex items-center p-0"
          style={{
            borderBottom: `0.5px solid ${lightGray}`,
            backgroundColor: vscBackground,
            zIndex: 2,
          }}
        >
          <ArrowLeftIcon
            width="1.2em"
            height="1.2em"
            onClick={() => navigate("/addModel")}
            className="ml-4 inline-block cursor-pointer"
          />
<<<<<<< HEAD
          <h3 className="text-lg font-bold m-2 inline-block">
            Configure Provider
=======
          <h3 className="m-2 inline-block text-lg font-bold">
            Configure provider
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
          </h3>
        </div>

        <div className="px-2">
          <div style={{ display: "flex", alignItems: "center" }}>
            {window.vscMediaUrl && modelInfo?.icon && (
              <img
                src={`${window.vscMediaUrl}/logos/${modelInfo?.icon}`}
                height="24px"
                style={{ marginRight: "10px" }}
              />
            )}
            <h2>{modelInfo?.title}</h2>
          </div>

          {modelInfo?.tags?.map((tag, i) => (
            <ModelProviderTag key={i} tag={tag} />
          ))}

          <StyledMarkdownPreview
            className="mt-2"
            source={modelInfo?.longDescription || modelInfo?.description}
          />

          {(modelInfo?.collectInputFor?.filter((d) => d.required).length || 0) >
            0 && (
            <>
              <h3 className="mb-2">Enter required parameters</h3>

              {modelInfo?.collectInputFor
                ?.filter((d) => d.required)
                .map((d, idx) => (
                  <div key={idx} className="mb-2">
                    <label htmlFor={d.key}>{d.label}</label>
                    <Input
                      type={d.inputType}
                      id={d.key}
                      className="m-2 rounded-md border-2 border-gray-200 p-2"
                      placeholder={d.placeholder ?? d.label}
                      defaultValue={d.defaultValue}
                      min={d.min}
                      max={d.max}
                      step={d.step}
                      {...formMethods.register(d.key, {
                        required: true,
                      })}
                    />
                  </div>
                ))}
            </>
          )}

          {(modelInfo?.collectInputFor?.filter((d) => !d.required).length ||
            0) > 0 && (
            <details>
              <summary className="mb-2 cursor-pointer">
                <b>Advanced (optional)</b>
              </summary>

              {modelInfo?.collectInputFor?.map((d, idx) => {
                if (d.required) return null;

                let defaultValue = d.defaultValue;

                if (
                  providerName === "openrouter" &&
                  d.key === "contextLength"
                ) {
                  const selectedPackage = providers[
                    "openrouter"
                  ]?.packages.find(
                    (pkg) => pkg.params.model === watch("model"),
                  );
                  defaultValue = selectedPackage?.params.contextLength;
                }

                return (
                  <div key={idx}>
                    <label htmlFor={d.key}>{d.label}</label>
                    <Input
                      type={d.inputType}
                      id={d.key}
<<<<<<< HEAD
                      className="border-2 border-gray-200 rounded-md p-2 m-2"
                      placeholder={d.placeholder}
                      defaultValue={defaultValue}
=======
                      className="m-2 rounded-md border-2 border-gray-200 p-2"
                      placeholder={d.placeholder ?? d.label}
                      defaultValue={d.defaultValue}
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
                      min={d.min}
                      max={d.max}
                      step={d.step}
                      {...formMethods.register(d.key, {
                        required: false,
                      })}
                    />
                  </div>
                );
              })}
            </details>
          )}
          {providerName === "openrouter" && (
            <div className="mb-2">
              <label htmlFor="model">Select a Model</label>
              <Select
                id="model"
                className="border-2 border-gray-200 rounded-md p-2 m-2 w-full"
                {...formMethods.register("model", { required: true })}
              >
                <option value="">Select a model</option>
                {providers.openrouter?.packages.map((pkg) => (
                  <option key={pkg.params.model} value={pkg.params.model}>
                    {pkg.title}
                  </option>
                ))}
              </Select>
            </div>
          )}
          {providerName === "openrouter" && (
            <>
              {errorMessage && (
                <ErrorText>
                  {errorMessage}
                </ErrorText>
              )}
              <CustomModelButton
                className={`mt-4 font-bold py-2 px-4 h-8`}
                onClick={handleOpenRouterSubmit}
                disabled={false}
              >
                Add OpenRouter Model
              </CustomModelButton>
            </>
          )}
        {providerName === "pearai_server" ? (
            <>

<<<<<<< HEAD
                <CustomModelButton
                  className="m-5"
                  disabled={false}
                  onClick={() =>
                    ideMessenger.post(
                      "openUrl",
                      "https://trypear.ai/signin?callback=pearai://pearai.pearai/auth", // Change to http://localhost:3000 and run pear-landing-page repo to test locally
                    )
=======
          <h3 className="mb-2">Select a model preset</h3>
        </div>
        <GridDiv>
          {modelInfo?.packages.map((pkg, idx) => {
            return (
              <ModelCard
                key={idx}
                disabled={disableModelCards()}
                title={pkg.title}
                description={pkg.description}
                tags={pkg.tags}
                refUrl={pkg.refUrl}
                icon={pkg.icon || modelInfo.icon}
                dimensions={pkg.dimensions}
                onClick={(e, dimensionChoices) => {
                  if (disableModelCards()) return;
                  let formParams: any = {};
                  for (const d of modelInfo.collectInputFor || []) {
                    const val = formMethods.watch(d.key);
                    if (val === "" || val === undefined || val === null) {
                      continue;
                    }
                    formParams = updatedObj(formParams, {
                      [d.key]: d.inputType === "text" ? val : parseFloat(val),
                    });
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
                  }
                >
                  <h3 className="text-center my-2">Sign Up / Log In</h3>
                  <img
                    src={`${window.vscMediaUrl}/logos/${modelInfo?.icon}`}
                    height="24px"
                    style={{ marginRight: "5px" }}
                  />
                </CustomModelButton>
                <p style={{ color: lightGray }} className="mx-3">
                  After login, the website should redirect you back here.
                </p>
                <small
                  style={{
                    color: lightGray,
                    fontSize: '0.85em',
                    display: 'block'
                  }}
                  className="mx-3"
                >
                  Note: Having trouble logging in? Open PearAI from the dashboard on the {' '}
                  <a href="https://trypear.ai/dashboard" target="_blank" rel="noopener noreferrer">
                    website
                  </a>.
                  </small>
            </>
            ) : (
              providerName !== "openrouter" && (
                <>
                <h3 className="mb-2">Select a model preset</h3>
                <GridDiv>
                  {modelInfo?.packages.map((pkg, idx) => {
                    return (
                      <ModelCard
                        key={idx}
                        disabled={
                          disableModelCards() &&
                          enablecardsForApikey() &&
                          enablecardsForCredentials()
                        }
                        title={pkg.title}
                        description={pkg.description}
                        tags={pkg.tags}
                        refUrl={pkg.refUrl}
                        icon={pkg.icon || modelInfo.icon}
                        dimensions={pkg.dimensions}
                        onClick={(e, dimensionChoices) => {
                          if (
                            disableModelCards() &&
                            enablecardsForApikey() &&
                            enablecardsForCredentials()
                          )
                            return;
                          let formParams: any = {};
                          for (const d of modelInfo.collectInputFor || []) {
                            const val = formMethods.watch(d.key);
                            if (val === "" || val === undefined || val === null) {
                              continue;
                            }
                            formParams = updatedObj(formParams, {
                              [d.key]: d.inputType === "text" ? val : parseFloat(val),
                            });
                          }

                          const model = {
                            ...pkg.params,
                            ...modelInfo.params,
                            ..._.merge(
                              {},
                              ...(pkg.dimensions?.map((dimension, i) => {
                                if (!dimensionChoices?.[i]) return {};
                                return {
                                  ...dimension.options[dimensionChoices[i]],
                                };
                              }) || []),
                            ),
                            ...formParams,
                            provider: modelInfo.provider,
                          };
                          ideMessenger.post("config/addModel", { model });
                          dispatch(
                            setDefaultModel({ title: model.title, force: true }),
                          );
                          navigate("/");
                        }}
                      />
                    );
                  })}
                </GridDiv>
              </>
            )
          )}
        </div>
      </div>
    </FormProvider>
  );
}

export default ConfigureProvider;
