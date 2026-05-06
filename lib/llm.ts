// Core LLM Utilities
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const baseSystemPrompt = `You are an experienced Cambridge IGCSE and A Level examiner with expertise in Sciences, Mathematics, Economics, Business, History, English, and General Paper. Evaluate student answers fairly based on the essence and meaning of the answer, not exact wording. Award marks if the student conveys the correct concept in different words. Award partial marks where a response is partially correct. Never award marks for contradictory statements within the same answer. Always provide your response in this exact structure:

MARKS AWARDED: X / Y

MARK BREAKDOWN:
- Point by point explanation of what was credited and what was not

FEEDBACK:
- What the student did well
- What was missing or incorrect
- How to improve

MODEL ANSWER:
- A perfect 300 word candidate response for this question

EXAMINER TIP:
- One specific actionable tip for this student

Do not penalise for spelling or grammar unless it is an English language paper. Do not use outside knowledge beyond what is in the marking scheme provided.`;

const subjectModifiers: Record<string, string> = {
    maths: "The student has submitted their final answer only, not their roughwork. Evaluate whether the final answer is correct to the degree of accuracy specified in the question. Then provide a complete step by step worked solution so the student can compare with their own roughwork. List all acceptable answer forms including exact form, decimal, surd, or fraction where applicable.",
    english: "Evaluate the response holistically across three areas: content and structure 40%, language and vocabulary 30%, grammar and punctuation 30%. Reward originality and different valid approaches to the task. Adjust MODEL ANSWER section to show an example of strong writing rather than a rigid mark scheme response.",
    general_paper: "Evaluate the quality of argument, use of real world examples, balance of perspectives presented, and sophistication of language. Reward well sustained arguments and penalise assertions made without supporting evidence or examples.",
    sciences: "Reward precise scientific terminology. Accept conceptually correct answers even if phrased differently to the marking scheme. Apply error carried forward where a student uses an incorrect value from a previous part consistently.",
    economics: "Reward correct chain of reasoning even if the student uses different examples to the marking scheme. For evaluation questions, reward balanced arguments that consider both sides. Accept relevant real world examples not listed in the marking scheme. CRITICAL FOR CALCULATIONS (e.g., PED, YED, Opportunity Cost, GDP, revenue/profit, percentages): IF the question involves mathematics or data calculation, before providing your final feedback or model answer, you MUST explicitly write out the correct formula, substitute the values perfectly, and calculate the result step-by-step. Compare your calculated result with the student's answer. Only award marks if their calculation matches yours.",
    business: "Reward correct application of business concepts to the case study context provided. A definition alone without application does not earn application marks. For evaluation questions reward judgements that are supported by reasoning.",
    history: "Check for specific factual knowledge, quality of argument, and use of historical evidence. Reward answers that demonstrate understanding of historical significance and causation even if worded differently to the marking scheme."
};

/**
 * Calls either OpenAI or Anthropic LLM based on environment variables.
 * @param {string} prompt - The main user prompt.
 * @param {string} subject - An optional subject string (e.g., 'maths', 'business') to append modifiers.
 * @param {number} maxTokens - The maximum number of tokens to return.
 * @param {string} customSystemPrompt - An optional fully overriding system prompt (for non-marking tasks like quotes).
 * @param {string} customModel - An optional model string to override the default model (e.g., 'gpt-4o' for complex math).
 * @returns {Promise<string>} The LLM's response as a plain string.
 */
export async function callLLM(prompt: string, subject?: string | null, maxTokens: number = 2000, customSystemPrompt: string | null = null, customModel: string | null = null): Promise<string> {
    // 1. Determine provider
    const provider = process.env.LLM_PROVIDER || 'openai';

    // 2. Build system prompt
    let finalSystemPrompt = customSystemPrompt || baseSystemPrompt;
    if (!customSystemPrompt && subject && subjectModifiers[subject]) {
        finalSystemPrompt += '\n\n' + subjectModifiers[subject];
    }

    // 3. Execute
    try {
        if (provider === 'claude') {
            if (!process.env.ANTHROPIC_API_KEY) {
                throw new Error("ANTHROPIC_API_KEY is not configured.");
            }
            const anthropic = new Anthropic({
                apiKey: process.env.ANTHROPIC_API_KEY,
            });

            // Default claude model
            const claudeModel = customModel || "claude-haiku-4-5-20251001";

            const msg = await anthropic.messages.create({
                model: claudeModel,
                max_tokens: maxTokens,
                system: finalSystemPrompt,
                messages: [
                    { role: "user", content: prompt }
                ]
            });

            return (msg.content[0] as any).text;
        } else {
            // Default to OpenAI
            if (!process.env.OPENAI_API_KEY) {
                throw new Error("OPENAI_API_KEY is not configured.");
            }
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });

            // Default openai model
            const openaiModel = customModel || "gpt-4o-mini";

            const completion = await openai.chat.completions.create({
                model: openaiModel,
                messages: [
                    { role: "system", content: finalSystemPrompt },
                    { role: "user", content: prompt }
                ],
                max_tokens: maxTokens,
                temperature: 1.0,
            });

            return completion.choices[0].message.content;
        }
    } catch (error) {
        console.error(`Error calling ${provider} LLM:`, error);
        throw new Error(`Failed to generate response from ${provider}: ${error.message}`);
    }
}
