import { ArrowLeftIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import _ from "lodash";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  defaultBorderRadius,
  lightGray,
  vscBackground,
} from "../../components";
import ModelCard from "../../components/modelSelection/ModelCard";
import Toggle from "../../components/modelSelection/Toggle";
import { IdeMessengerContext } from "../../context/IdeMessenger";
import { useNavigationListener } from "../../hooks/useNavigationListener";
import { setDefaultModel } from "../../redux/slices/configSlice";
import { ModelPackage, models } from "./configs/models";
import { providers } from "./configs/providers";
import { CustomModelButton } from "./ConfigureProvider";

const IntroDiv = styled.div`
  padding: 8px 12px;
  border-radius: ${defaultBorderRadius};
  border: 1px solid ${lightGray};
  margin: 1rem;
`;

const GridDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2rem;
  padding: 1rem;
  justify-items: center;
  align-items: center;
`;

<<<<<<< HEAD
function Models() {
=======
/**
 * Used to display groupings in the Models tab
 */
const modelsByProvider: Record<string, ModelPackage[]> = {
  "Open AI": [models.gpt4turbo, models.gpt4o, models.gpt35turbo],
  Anthropic: [models.claude3Opus, models.claude3Sonnet, models.claude35Haiku],
  Mistral: [
    models.codestral,
    models.mistral7b,
    models.mistral8x7b,
    models.mistral8x22b,
    models.mistralSmall,
    models.mistralLarge,
  ],
  Cohere: [models.commandR, models.commandRPlus],
  DeepSeek: [
    models.deepseekCoderApi,
    models.deepseekChatApi,
    models.deepseekReasonerApi,
  ],
  Gemini: [models.geminiPro, models.gemini15Pro, models.gemini15Flash],
  "Open Source": [models.llama3Chat, models.mistralOs, models.deepseek],
};

function AddNewModel() {
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const ideMessenger = useContext(IdeMessengerContext);

  useNavigationListener();

  const [showOtherProviders, setShowOtherProviders] = useState(
    location.state?.showOtherProviders ?? false
  );

  const handleOtherClick = () => setShowOtherProviders(true);

  const handleBackArrowClick = () => {
    if (location.state?.referrer) {
      navigate(location.state.referrer);
    } else if (showOtherProviders) {
      setShowOtherProviders(false);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="mb-6 overflow-y-scroll">
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
<<<<<<< HEAD
          onClick={handleBackArrowClick}
          className="inline-block ml-4 cursor-pointer"
        />
        <h3 className="text-lg font-bold m-2 inline-block">Add Model</h3>
=======
          onClick={() => navigate("/")}
          className="ml-4 inline-block cursor-pointer"
        />
        <h3 className="m-2 inline-block text-lg font-bold">Add a new model</h3>
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      </div>
      <br />
      <IntroDiv style={{ textAlign: "center" }}>
        To add a model, select one of the options below:
      </IntroDiv>
      <GridDiv>
        {!showOtherProviders ? (
          <>
<<<<<<< HEAD
            <ModelCard
              key="pearai_server"
              title={providers["pearai_server"].title}
              description={providers["pearai_server"].description}
              tags={providers["pearai_server"].tags}
              icon={providers["pearai_server"].icon}
              onClick={(e) => {
                console.log(`/addModel/provider/pearai_server`);
                navigate(`/addModel/provider/pearai_server`);
              }}
            />
            <ModelCard
              key="other"
              title={providers["other"].title}
              description={providers["other"].description}
              tags={providers["other"].tags}
              icon={providers["other"].icon}
              onClick={handleOtherClick}
            />
          </>
        ) : (
          <>
            {Object.entries(providers).map(([providerName, providerInfo], i) => (
              providerInfo.showInMenu !== false && (
                <ModelCard
                  key={`${providerName}-${i}`}
                  title={providerInfo.title}
                  description={providerInfo.description}
                  tags={providerInfo.tags}
                  icon={providerInfo.icon}
                  onClick={(e) => {
                    console.log(`/addModel/provider/${providerName}`);
                    navigate(`/addModel/provider/${providerName}`);
                  }}
                />
              )
            ))}
=======
            <div className="col-span-full mb-8 text-center leading-relaxed">
              <h2 className="mb-0">Providers</h2>
              <p className="mt-2">
                Select a provider below, or configure your own in{" "}
                <code>config.json</code>
              </p>
            </div>

            <GridDiv>
              {Object.entries(providers).map(([providerName, modelInfo], i) =>
                modelInfo ? (
                  <ModelCard
                    key={`${providerName}-${i}`}
                    title={modelInfo.title}
                    description={modelInfo.description}
                    tags={modelInfo.tags}
                    icon={modelInfo.icon}
                    refUrl={`https://docs.continue.dev/reference/Model%20Providers/${
                      modelInfo.refPage || modelInfo.provider.toLowerCase()
                    }`}
                    onClick={(e) => {
                      console.log(`/addModel/provider/${providerName}`);
                      navigate(`/addModel/provider/${providerName}`);
                    }}
                  />
                ) : null,
              )}
            </GridDiv>
          </>
        ) : (
          <>
            <div className="col-span-full text-center leading-relaxed">
              <h2 className="mb-0">Models</h2>
              <p className="mt-2">
                Select a model from the most popular options below, or configure
                your own in <code>config.json</code>
              </p>
            </div>

            {Object.entries(modelsByProvider).map(
              ([providerTitle, modelConfigsByProviderTitle]) => (
                <div className="mb-6 flex flex-col">
                  <div className="mb-4 w-full items-center">
                    <h3 className="">{providerTitle}</h3>
                    <hr
                      style={{
                        height: "0px",
                        width: "100%",
                        color: lightGray,
                        border: `1px solid ${lightGray}`,
                        borderRadius: "2px",
                      }}
                    />
                  </div>

                  <GridDiv>
                    {modelConfigsByProviderTitle.map((config) => (
                      <ModelCard
                        title={config.title}
                        description={config.description}
                        tags={config.tags}
                        icon={config.icon}
                        dimensions={config.dimensions}
                        providerOptions={config.providerOptions}
                        onClick={(e, dimensionChoices, selectedProvider) => {
                          if (!selectedProvider) {
                            return;
                          }
                          const model = {
                            ...config.params,
                            ..._.merge(
                              {},
                              ...(config.dimensions?.map((dimension, i) => {
                                if (!dimensionChoices?.[i]) return {};
                                return {
                                  ...dimension.options[dimensionChoices[i]],
                                };
                              }) || []),
                            ),
                            provider: providers[selectedProvider]?.provider,
                          };
                          ideMessenger.post("config/addModel", { model });
                          dispatch(
                            setDefaultModel({
                              title: model.title,
                              force: true,
                            }),
                          );
                          navigate("/");
                        }}
                      />
                    ))}
                  </GridDiv>
                </div>
              ),
            )}
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
          </>
        )}
      </GridDiv>
      <div style={{ padding: "8px" }}>
        <hr style={{ color: lightGray, border: `1px solid ${lightGray}` }} />
        <p style={{ color: lightGray }}>Or edit manually in config.json:</p>
        <CustomModelButton
          disabled={false}
<<<<<<< HEAD
          onClick={() => ideMessenger.post("openConfigJson", undefined)}
        >
          <h3 className="text-center my-2">Open config.json</h3>
=======
          onClick={(e) => {
            ideMessenger.post("config/openProfile", {
              profileId: "local",
            });
          }}
        >
          <h3 className="my-2 text-center">
            <Cog6ToothIcon className="inline-block h-5 w-5 px-4 align-middle" />
            Open config.json
          </h3>
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
        </CustomModelButton>
      </div>
    </div>
  );
}

export default Models;
