package com.github.continuedev.continueintellijextension.actions

import com.github.continuedev.continueintellijextension.editor.DiffStreamService
import com.github.continuedev.continueintellijextension.services.ContinuePluginService
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.PlatformDataKeys
import com.intellij.openapi.components.ServiceManager
import com.intellij.openapi.components.service
import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.project.Project
import com.intellij.openapi.wm.ToolWindowManager

fun getPluginService(project: Project?): ContinuePluginService? {
    if (project == null) {
        return null
    }
    return ServiceManager.getService(
        project,
        ContinuePluginService::class.java
    )
}

class AcceptDiffAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        acceptHorizontalDiff(e)
        acceptVerticalDiff(e)
    }

    private fun acceptHorizontalDiff(e: AnActionEvent) {
        val continuePluginService = getPluginService(e.project) ?: return
        continuePluginService?.diffManager?.acceptDiff(null)
    }

    private fun acceptVerticalDiff(e: AnActionEvent) {
        val project = e.project ?: return
        val editor =
            e.getData(PlatformDataKeys.EDITOR) ?: FileEditorManager.getInstance(project).selectedTextEditor ?: return
        val diffStreamService = project.service<DiffStreamService>()
        diffStreamService.accept(editor)
    }
}

class RejectDiffAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        rejectHorizontalDiff(e)
        rejectVerticalDiff(e)
    }

    private fun rejectHorizontalDiff(e: AnActionEvent) {
        val continuePluginService = getPluginService(e.project) ?: return
        continuePluginService.diffManager?.rejectDiff(null)
    }

    private fun rejectVerticalDiff(e: AnActionEvent) {
        val project = e.project ?: return
        val editor =
            e.getData(PlatformDataKeys.EDITOR) ?: FileEditorManager.getInstance(project).selectedTextEditor ?: return
        val diffStreamService = project.service<DiffStreamService>()
        diffStreamService.reject(editor)
    }
}

fun getContinuePluginService(project: Project?): ContinuePluginService? {
    if (project != null) {
        val toolWindowManager = ToolWindowManager.getInstance(project)
        val toolWindow = toolWindowManager.getToolWindow("Continue")

<<<<<<< HEAD
 class QuickInputDialogWrapper : DialogWrapper(true) {
     private var panel: JPanel? = null
    private var textArea: JTextArea? = null
     init {
         init()
         title = "PearAI Quick Input"
     }

     override fun getPreferredFocusedComponent(): JComponent? {
         return textArea
     }

     override fun createCenterPanel(): JComponent? {
         panel = JPanel(BorderLayout())
         textArea = JTextArea(3, 60)
         textArea?.lineWrap = true
         textArea?.wrapStyleWord = true

        // Add a DocumentListener to the JTextArea
         textArea?.document?.addDocumentListener(object : DocumentListener {
             override fun insertUpdate(e: DocumentEvent?) {
                 updateSize()
             }

             override fun removeUpdate(e: DocumentEvent?) {
                 updateSize()
             }

             override fun changedUpdate(e: DocumentEvent?) {
                 updateSize()
             }

             private fun updateSize() {
                 val text = textArea?.text ?: ""
                 val lines = text.count { it == '\n' } + 1
                 val metrics = textArea?.getFontMetrics(textArea?.font)
                 val lineHeight = metrics?.height ?: 0
                 textArea?.preferredSize = Dimension(textArea?.width ?: 0, lines * lineHeight)

                 // Revalidate the JPanel to reflect the changes
                 panel?.revalidate()
             }
         })

          val scrollPane = JBScrollPane(textArea)
          scrollPane.verticalScrollBarPolicy = JScrollPane.VERTICAL_SCROLLBAR_ALWAYS
          panel?.add(scrollPane, BorderLayout.CENTER)
         
          return panel
     }


     fun showDialogAndGetText(): String? {
         show()
         return if (this.exitCode == OK_EXIT_CODE) {
             textArea!!.text
         } else {
             null
         }
     }
 }


class QuickTextEntryAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val continuePluginService = pluginServiceFromActionEvent(e) ?: return
        continuePluginService.ideProtocolClient?.sendHighlightedCode()

         // Create and show the dialog
         val dialog = QuickInputDialogWrapper()
         val text: String? = dialog.showDialogAndGetText()

         // Show the text entered by the user
         if (text != null) {
             val service = pluginServiceFromActionEvent(e)
             service?.ideProtocolClient?.sendMainUserInput(text)

             val project = e.project
             if (project != null) {
                 val toolWindowManager = ToolWindowManager.getInstance(project)
                 val toolWindow = toolWindowManager.getToolWindow("PearAI")

                 if (toolWindow != null) {
                     if (!toolWindow.isVisible) {
                         toolWindow.activate(null)
                     }
                 }
             }

             continuePluginService.continuePluginWindow?.content?.components?.get(0)?.requestFocus()
             continuePluginService.sendToWebview("focusContinueInput", null)

         }
=======
        if (toolWindow != null) {
            if (!toolWindow.isVisible) {
                toolWindow.activate(null)
            }
        }
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    }

    return getPluginService(project)
}

fun focusContinueInput(project: Project?) {
    val continuePluginService = getContinuePluginService(project) ?: return
    continuePluginService.continuePluginWindow?.content?.components?.get(0)?.requestFocus()
    continuePluginService.sendToWebview("focusContinueInputWithoutClear", null)

    continuePluginService.ideProtocolClient?.sendHighlightedCode()
}

class FocusContinueInputWithoutClearAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project
        focusContinueInput(project)
    }
}

class FocusContinueInputAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val continuePluginService = getContinuePluginService(e.project) ?: return

        continuePluginService.continuePluginWindow?.content?.components?.get(0)?.requestFocus()
        continuePluginService.sendToWebview("focusContinueInputWithNewSession", null)

        continuePluginService.ideProtocolClient?.sendHighlightedCode()
    }
}

class NewContinueSessionAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val continuePluginService = getContinuePluginService(e.project) ?: return
        continuePluginService.continuePluginWindow?.content?.components?.get(0)?.requestFocus()
        continuePluginService.sendToWebview("focusContinueInputWithNewSession", null)
    }
}

class ViewHistoryAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val continuePluginService = getContinuePluginService(e.project) ?: return
        val params = mapOf("path" to "/history", "toggle" to true)
        continuePluginService.sendToWebview("navigateTo", params)
    }
}

class OpenConfigAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val continuePluginService = getContinuePluginService(e.project) ?: return
        continuePluginService.continuePluginWindow?.content?.components?.get(0)?.requestFocus()
        val params = mapOf("path" to "/config", "toggle" to true)
        continuePluginService.sendToWebview("navigateTo", params)
    }
}

class OpenMorePageAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val continuePluginService = getContinuePluginService(e.project) ?: return
        continuePluginService.continuePluginWindow?.content?.components?.get(0)?.requestFocus()
        val params = mapOf("path" to "/more", "toggle" to true)
        continuePluginService.sendToWebview("navigateTo", params)
    }
}