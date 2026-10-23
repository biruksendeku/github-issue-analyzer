import Anthropic from "@anthropic-ai/sdk";

// Prompt                                                                      */
export const SYSTEM_PROMPT = `You are a senior software engineer and open-source maintainer who triages and resolves GitHub issues.

You will receive one issue from a repository. In a SINGLE response you must both (1) analyze the issue and (2) give the user a concrete solution. You cannot ask follow-up questions or run tools, so work only from what is provided.

Rules:
- Ground every claim in the provided issue text, code, logs, or repo metadata. Do not invent file names, APIs, versions, or behavior that were not given. If something is a guess, label it as an assumption and give it a lower confidence.
- If the issue lacks information needed to solve it, still give the most likely solution, and list exactly what is missing in "missing_info".
- Prefer the smallest correct fix. Show code as a unified diff or a complete snippet the user can paste.
- Write "user_reply" as a friendly, direct message to the issue author (plain language, no internal jargon, under 200 words).
- If the issue is not a bug (question, feature request, duplicate, invalid), say so in "classification" and adapt the solution accordingly.
- Output ONLY one valid JSON object that matches the schema below. No markdown fences, no text before or after.

Schema:
{
  "summary": string,                       // 1-2 sentence restatement of the problem
  "classification": "bug" | "feature_request" | "question" | "docs" | "performance" | "security" | "duplicate" | "invalid",
  "severity": "low" | "medium" | "high" | "critical",
  "root_cause": {
    "explanation": string,
    "evidence": string[],                  // quotes or references taken from the issue
    "confidence": number                   // 0 to 1
  },
  "solution": {
    "steps": string[],                     // ordered, actionable
    "code": [
      { "file": string, "language": string, "change": string }  // diff or snippet
    ],
    "verification": string[]               // how to confirm the fix works
  },
  "workaround": string | null,
  "missing_info": string[],
  "suggested_labels": string[],
  "user_reply": string
}`;

// Builds the user message for one issue.
// Every field except repoName/title/body is optional.
export function buildUserPrompt({
  repoName,
  issueNumber,
  title,
  body,
  labels = [],
  comments = [],
  codeContext = "",
  environment = "",
}) {
  const commentBlock = comments.length
    ? comments
        .map((c, i) => `#${i + 1} @${c.author ?? "unknown"}: ${c.body}`)
        .join("\n\n")
    : "(none)";

  return `<repository>${repoName}</repository>
<issue_number>${issueNumber ?? "unknown"}</issue_number>
<title>${title}</title>
<labels>${labels.join(", ") || "(none)"}</labels>

<issue_body>
${body}
</issue_body>

<comments>
${commentBlock}
</comments>

<environment>
${environment || "(not provided)"}
</environment>

<code_context>
${codeContext || "(not provided)"}
</code_context>

Analyze this issue from "${repoName}" and return the JSON object described in your instructions.`;
}

// API call: one request, one response                                         */
const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

export async function analyzeIssue(
  issue,
  { model = "claude-sonnet-5-5", maxTokens = 4096 } = {},
) {
  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    temperature: 0.2,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(issue) }],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  return parseJson(text);
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    // Fallback: grab the outermost JSON object if the model added stray text
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end > start)
      return JSON.parse(text.slice(start, end + 1));
    throw new Error("Model did not return valid JSON:\n" + text);
  }
}

// Example usage (run: node issue-solver.js)
import { fileURLToPath } from "node:url";

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await analyzeIssue({
    repoName: "acme/web-app",
    issueNumber: 482,
    title:
      "App crashes on login with 'Cannot read properties of undefined (reading token)'",
    body: "After upgrading to v2.3.0, clicking Login throws the error above. Worked on v2.2.4.",
    labels: ["bug"],
    environment: "Node 20, Chrome 130, macOS 14",
    codeContext:
      "// auth.js\nexport function login(res) { return res.data.token; }",
  });

  console.log(JSON.stringify(result, null, 2));
}
