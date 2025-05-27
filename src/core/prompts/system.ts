import { McpHub } from "@services/mcp/McpHub"
import { BrowserSettings } from "@shared/BrowserSettings"

// Prompt content for Cline
import { getSystemPromptIntroContent } from "./intro"
import { getToolsPreambleContent } from "./tools-preamble"
import { getToolsContent } from "./tools"
import { getEditsContent } from "./edits"
import { getMcpContent } from "./mcp"
import { getModesContent } from "./modes"
import { getCapabilitiesAndRulesContent } from "./capabilities-and-rules"
import { getSysInfoContent } from "./sys-info"
import { getObjectiveContent } from "./objective"
import { getAltEditorToolContent } from "./alt-code-editor-tool"

// System prompt for Cline
export const SYSTEM_PROMPT = async (
	cwd: string,
	supportsBrowserUse: boolean,
	mcpHub: McpHub,
	browserSettings: BrowserSettings,
	modelId: string = "",
) => {
	const systemPromptIntro = getSystemPromptIntroContent()
	const toolsPreambleContent = getToolsPreambleContent()
	const toolsContent = getToolsContent(cwd, supportsBrowserUse, browserSettings, modelId) // tools content has its own modelId switching logic
	let editsContent = getEditsContent() // Legacy Cline editor tool prompt
	const mcpContent = getMcpContent(mcpHub)
	const modesContent = getModesContent()
	const capabilitiesAndRules = getCapabilitiesAndRulesContent(cwd, supportsBrowserUse, browserSettings)
	const sysInfo = getSysInfoContent(cwd)
	const objective = getObjectiveContent()

	// Model-specific editor tool content and switching logic
	const altEditorTool = getAltEditorToolContent()

	// Switch logic for alternate editor tool content
	//const isAlt: boolean = modelId.toLowerCase().includes("claude-opus-4") || modelId.toLowerCase().includes("claude-sonnet-4")
	const isAlt = null

	if (isAlt) {
		editsContent = altEditorTool
		console.log(`Using alternate system prompt for model: ${modelId}`)
	} else {
		console.log(`Using standard system prompt for model: ${modelId}`)
	}

	return `
${systemPromptIntro}

${toolsPreambleContent}

${toolsContent}

${mcpContent}

${editsContent}

${modesContent}

${capabilitiesAndRules}

${sysInfo}

${objective}
`
}

// addUserInstructions
export function addUserInstructions(
	settingsCustomInstructions?: string,
	globalClineRulesFileInstructions?: string,
	localClineRulesFileInstructions?: string,
	localCursorRulesFileInstructions?: string,
	localCursorRulesDirInstructions?: string,
	localWindsurfRulesFileInstructions?: string,
	clineIgnoreInstructions?: string,
	preferredLanguageInstructions?: string,
) {
	let customInstructions = ""
	if (preferredLanguageInstructions) {
		customInstructions += preferredLanguageInstructions + "\n\n"
	}
	if (settingsCustomInstructions) {
		customInstructions += settingsCustomInstructions + "\n\n"
	}
	if (globalClineRulesFileInstructions) {
		customInstructions += globalClineRulesFileInstructions + "\n\n"
	}
	if (localClineRulesFileInstructions) {
		customInstructions += localClineRulesFileInstructions + "\n\n"
	}
	if (localCursorRulesFileInstructions) {
		customInstructions += localCursorRulesFileInstructions + "\n\n"
	}
	if (localCursorRulesDirInstructions) {
		customInstructions += localCursorRulesDirInstructions + "\n\n"
	}
	if (localWindsurfRulesFileInstructions) {
		customInstructions += localWindsurfRulesFileInstructions + "\n\n"
	}
	if (clineIgnoreInstructions) {
		customInstructions += clineIgnoreInstructions
	}

	return `
====

USER'S CUSTOM INSTRUCTIONS

The following additional instructions are provided by the user, and should be followed to the best of your ability without interfering with the TOOL USE guidelines.

${customInstructions.trim()}`
}
