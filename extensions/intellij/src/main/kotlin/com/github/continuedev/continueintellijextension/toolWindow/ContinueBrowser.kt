package com.github.continuedev.continueintellijextension.toolWindow

import com.github.continuedev.continueintellijextension.activities.ContinuePluginDisposable
import com.github.continuedev.continueintellijextension.constants.MessageTypes
import com.github.continuedev.continueintellijextension.constants.MessageTypes.Companion.PASS_THROUGH_TO_CORE
import com.github.continuedev.continueintellijextension.factories.CustomSchemeHandlerFactory
import com.github.continuedev.continueintellijextension.services.ContinueExtensionSettings
import com.github.continuedev.continueintellijextension.services.ContinuePluginService
import com.github.continuedev.continueintellijextension.utils.uuid
import com.google.gson.Gson
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import com.intellij.openapi.components.ServiceManager
import com.intellij.openapi.project.Project
import com.intellij.openapi.util.Disposer
import com.intellij.ui.jcef.*
import org.cef.CefApp
import org.cef.browser.CefBrowser
import org.cef.handler.CefLoadHandlerAdapter
<<<<<<< HEAD
import java.io.File
import java.io.IOException
import java.nio.charset.StandardCharsets
import java.nio.file.Paths

class ContinueBrowser(val project: Project, url: String, useOsr: Boolean = false) {
    private val heightChangeListeners = mutableListOf<(Int) -> Unit>()
    fun onHeightChange(listener: (Int) -> Unit) {
        heightChangeListeners.add(listener)
    }

    private val PASS_THROUGH_TO_CORE = listOf(
        "update/modelChange",
        "ping",
        "abort",
        "history/list",
        "history/delete",
        "history/load",
        "history/save",
        "devdata/log",
        "config/addOpenAiKey",
        "config/addModel",
        "config/ideSettingsUpdate",
        "config/getSerializedProfileInfo",
        "config/deleteModel",
        "config/newPromptFile",
        "config/reload",
        "context/getContextItems",
        "context/loadSubmenuItems",
        "context/addDocs",
        "autocomplete/complete",
        "autocomplete/cancel",
        "autocomplete/accept",
        "command/run",
        "llm/complete",
        "llm/streamComplete",
        "llm/streamChat",
        "llm/setPearAICredentials",
        "llm/listModels",
        "streamDiffLines",
        "stats/getTokensPerDay",
        "stats/getTokensPerModel",
        "index/setPaused",
        "index/forceReIndex",
        "index/indexingProgressBarInitialized",
        "completeOnboarding",
        "addAutocompleteModel",
        "config/listProfiles",
        "profiles/switch",
        "didChangeSelectedProfile",
    )
=======
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

class ContinueBrowser(val project: Project, url: String) {
    private fun registerAppSchemeHandler() {
        CefApp.getInstance().registerSchemeHandlerFactory(
<<<<<<< HEAD
                "http",
                "pearai",
                CustomSchemeHandlerFactory()
=======
            "http",
            "continue",
            CustomSchemeHandlerFactory()
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
        )
    }

    val browser: JBCefBrowser

    init {
        val isOSREnabled = ServiceManager.getService(ContinueExtensionSettings::class.java).continueState.enableOSR

        this.browser = JBCefBrowser.createBuilder().setOffScreenRendering(isOSREnabled).build()

        registerAppSchemeHandler()
        browser.loadURL(url);
        Disposer.register(ContinuePluginDisposable.getInstance(project), browser)

        // Listen for events sent from browser
        val myJSQueryOpenInBrowser = JBCefJSQuery.create((browser as JBCefBrowserBase?)!!)

        myJSQueryOpenInBrowser.addHandler { msg: String? ->
            val parser = JsonParser()
            val json: JsonObject = parser.parse(msg).asJsonObject
            val messageType = json.get("messageType").asString
            val data = json.get("data")
            val messageId = json.get("messageId")?.asString

            val continuePluginService = ServiceManager.getService(
                project,
                ContinuePluginService::class.java
            )

            val respond = fun(data: Any?) {
                sendToWebview(messageType, data, messageId ?: uuid())
            }

            if (PASS_THROUGH_TO_CORE.contains(messageType)) {
                continuePluginService.coreMessenger?.request(messageType, data, messageId, respond)
                return@addHandler null
            }

            // If not pass through, then put it in the status/content/done format for webview
            // Core already sends this format
            val respondToWebview = fun(data: Any?) {
                sendToWebview(messageType, mapOf(
                    "status" to "success",
                    "content" to data,
                    "done" to true
                ), messageId ?: uuid())
            }

            if (msg != null) {
                continuePluginService.ideProtocolClient?.handleMessage(msg, respondToWebview)
            }

            null
        }

        // Listen for the page load event
        browser.jbCefClient.addLoadHandler(object : CefLoadHandlerAdapter() {
            override fun onLoadingStateChange(
                browser: CefBrowser?,
                isLoading: Boolean,
                canGoBack: Boolean,
                canGoForward: Boolean
            ) {
                if (!isLoading) {
                    // The page has finished loading
                    executeJavaScript(browser, myJSQueryOpenInBrowser)
                }
            }
        }, browser.cefBrowser)

    }

    fun executeJavaScript(browser: CefBrowser?, myJSQueryOpenInBrowser: JBCefJSQuery) {
        // Execute JavaScript - you might want to handle potential exceptions here
        val script = """window.postIntellijMessage = function(messageType, data, messageId) {
                const msg = JSON.stringify({messageType, data, messageId});
                ${myJSQueryOpenInBrowser.inject("msg")}
            }""".trimIndent()

        browser?.executeJavaScript(script, browser.url, 0)
    }

    fun sendToWebview(
        messageType: String,
        data: Any?,
        messageId: String = uuid()
    ) {
        val jsonData = Gson().toJson(
            mapOf(
                "messageId" to messageId,
                "messageType" to messageType,
                "data" to data
            )
        )
        val jsCode = buildJavaScript(jsonData)

        try {
            this.browser.executeJavaScriptAsync(jsCode).onError {
                println("Failed to execute jsCode error: ${it.message}")
            }
        } catch (error: IllegalStateException) {
            println("Webview not initialized yet $error")
        }
    }

    private fun buildJavaScript(jsonData: String): String {
        return """window.postMessage($jsonData, "*");"""
    }

}
