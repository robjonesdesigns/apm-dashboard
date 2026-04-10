# DESK-RESEARCH-021: AI Assistant -- Competitive Landscape + Implementation Plan

**Date:** 2026-04-03
**Purpose:** Map how APM competitors are integrating AI/LLM features, and define the technical architecture for building a real AI assistant into the APM dashboard demo.

---

## Part 1: How APM Tools Are Integrating AI

### IBM Maximo (furthest along)
- **Maximo 9.1 (GA June 2025):** Native GenAI assistant built on watsonx.ai
- Natural language queries: "which work orders are missing job plans?" or "show me total cost of work orders per site"
- NLP processing of maintenance logs to auto-generate structured WO data
- Automated PM scheduling and spare parts management via watsonx
- watsonx Orchestrate integration for multi-step incident resolution
- Maximo Assist: AI-powered knowledge retrieval for field techs (manuals, repair history, similar past WOs)
- **User sentiment:** Predictive maintenance capabilities praised. Critics: "requires very accurate data to function effectively and feels less automated than expected." Gap between demo and messy real-world data.
- **Roadmap:** AI agents for automated asset management workflows. Deeper watsonx Orchestrate integration.

### SAP (Joule across the suite)
- SAP Joule embedded across entire SAP portfolio including APM
- Natural language commands: "Show open maintenance orders with high priority"
- Auto-generated Insight Cards (maintenance status, recent activities, critical assets) pinnable to homepage
- Anomaly Detection in SAP APM with auto-generated alerts
- Visual Inspection: image recognition for corrosion, cracks, defects
- Joule Studio skill builder (GA July 2025) and agent builder (GA December 2025)
- **Strength:** Breadth of data Joule can access across ERP, supply chain, and asset management
- **Weakness:** Still early. Agent builder only went GA late 2025.

### GE Vernova APM (behind on GenAI)
- SmartSignal: ML-based anomaly detection and failure prediction (not GenAI)
- AI Robotic Integration for asset inspection
- Prototype GenAI assistant (with AWS) for non-technical SMEs to generate analytics
- **Not a shipped chat interface yet.**
- **Strength:** Deep physics-based digital twin models
- **Roadmap:** "Amp" -- LLM as co-engineer linking natural language to physics-based tools. Proficy Historian (2026) with AI-powered query generation.

### Honeywell Forge (just shipped)
- **February 2025:** Forge Production Intelligence now includes Intelligent Assistant
- Natural language prompts for engineers, plant managers, and business leaders
- Access KPIs, trend data, troubleshooting guidance via natural language
- Google Cloud partnership: Gemini on Vertex AI integrated with Forge IoT data
- **Strength:** Massive IoT data set on Forge platform
- **Roadmap:** Deeper Google Cloud AI agent integration for autonomous operations

### Emerson / AspenTech
- Aspen Mtell: AI-based failure prediction (ML, not GenAI)
- Automatic alert prioritization based on risk, severity, historical data
- Plantweb Optics: AR overlays for field techs with real-time analytics
- **No shipped GenAI chat assistant found.**

### Samsara (AI-native, fleet/IoT focused)
- Samsara Assistant: GenAI chatbot powered by OpenAI GPT-4 and Anthropic Claude
- Natural language: "Which vehicles have severe fault codes?" with step-by-step resolution
- Weather Intelligence, Automated Coaching, AI Multicam
- **Closest to a conversational AI in the space**, though fleet management not plant APM

### Industry Summary

| Vendor | GenAI Shipped? | Chat Interface? | Maturity |
|---|---|---|---|
| IBM Maximo | Yes (9.1, June 2025) | Yes (watsonx) | Most mature |
| SAP | Yes (Joule) | Yes (Insight Cards + chat) | Broad but early |
| GE Vernova | Prototype only | No (ML alerts, not GenAI chat) | Behind |
| Honeywell Forge | Yes (Feb 2025) | Yes (Intelligent Assistant) | Just shipped |
| Emerson | No | No | ML only |
| Samsara | Yes | Yes (GPT-4 + Claude) | AI-native but fleet-focused |

**The gap:** Nobody has a truly conversational, context-aware AI assistant that reasons across asset history, sensor trends, and maintenance records like a senior reliability engineer. IBM is closest but users say it "feels less automated than expected." This is the opportunity.

---

## Part 2: Our AI Assistant -- What It Does

### Role-Aware Responses (tied to Reliability/Maintenance toggle)

| Question | Diane (Maintenance) | Carlos (Reliability) |
|---|---|---|
| "What should I worry about?" | WO urgency, schedule impact, overdue PMs | Degradation trends, threshold proximity, RUL |
| "Summarize overnight" | What broke, who responded, what's open | What triggered, which assets degraded, pattern connections |
| "Is this asset okay?" | PM status, open WOs, health score direction | Sensor trends, baseline comparison, P-F position |
| "Can I defer this PM?" | Schedule impact, resource reallocation options | Condition data, degradation rate, deferral risk assessment |

### Use Cases (Tier 1 -- ship these)

1. **Morning briefing:** "What happened overnight?" Summarizes events, KPI changes, open WOs, what needs attention. Different framing per role.

2. **Asset investigation:** "Why is K-101 health score dropping?" Connects the causal chain: oil filter bypassing -> contaminated lubricant -> bearing erosion -> vibration climb -> trip. Data is in baytown.js.

3. **Risk assessment:** "Should I be worried about P-203?" Combines current sensor readings, event history (3 seal replacements in 6 months), trending, RUL. Plain English with supporting data.

4. **Natural language search:** "Show me all critical assets with vibration trending up" or "Which assets have overdue work orders?" Translates to data queries against baytown.js.

### Use Cases (Tier 2 -- nice to have)

5. **WO draft from alert:** Click event, ask "Draft a work order for this." AI generates title, description, priority, recommended actions from event context and asset history.

6. **Anomaly explanation:** For any sensor in alarm state, plain English explanation with historical context.

7. **Pattern detection:** "Any recurring issues?" Surfaces repeated failures (P-203 seals) and underlying root causes.

---

## Part 3: Technical Architecture

### Stack

```
React (Vite) --> Cloudflare Worker (proxy) --> Claude API (Haiku 4.5)
```

**Why Cloudflare Workers:**
- Free tier: 100K requests/day
- API key security (key in Worker environment, never in client code)
- Rate limiting (protect against abuse)
- Deploy in under 5 minutes with wrangler
- Edge-deployed globally

### Data Flow

```
Frontend (React)
  |
  | POST /api/chat  { messages: [...], role: "maintenance" | "reliability" }
  v
Cloudflare Worker
  | 1. Validate request (rate limit, origin check)
  | 2. Prepend system prompt + plant data + role context
  | 3. Call Claude API with streaming
  v
Claude Haiku 4.5
  |
  | SSE stream back through Worker to frontend
  v
Frontend renders tokens as they arrive
```

### Model Selection

**Claude Haiku 4.5.** Reasoning:
- Smart enough for domain-specific Q&A with well-structured data
- Fast (streaming feels instant)
- Cheap ($1/MTok input, $5/MTok output)
- System prompt + baytown.js context: ~10K tokens
- Per conversation: ~$0.008
- 100 demo conversations/month: ~$0.80/month
- **Use prompt caching:** System prompt identical across requests. Cache at 0.1x input cost after first write. Cuts costs ~80%.

Sonnet/Opus overkill for this. The questions are domain-specific but not complex reasoning chains -- the data is small and well-structured.

### System Prompt Structure

```
ROLE: AI assistant for Baytown Refinery APM dashboard.

PERSONALITY: Concise, technical but accessible. Like a senior reliability
engineer briefing a colleague. No jargon without explanation. Flag urgency.
Always cite specific data (asset IDs, timestamps, values).

CURRENT ROLE: [maintenance | reliability] -- adjust response framing.

CONTEXT: [Full baytown.js data serialized as JSON -- PLANT, ASSETS with
sub-assets and sensors, TIMELINE events, WORK_ORDERS, INVESTIGATIONS]

CAPABILITIES:
- Answer questions about asset health, sensor readings, trends
- Explain anomalies and potential causes
- Summarize overnight events and KPI changes
- Connect related events across assets (pattern detection)
- Draft work order descriptions from event context
- Assess risk and urgency in plain English

CONSTRAINTS:
- Only reference data in the provided context
- Never fabricate sensor readings or events
- When uncertain, say so
- Always include asset IDs and timestamps
- Format for readability (short paragraphs, bullets)
```

The full baytown.js data (~8-10K tokens serialized) fits in the system prompt. **No RAG, no vector database, no embeddings needed.** Dataset is small enough for direct context injection.

### Why Not RAG/Embeddings?

baytown.js is ~2,800 lines. Serialized to JSON and minified, the core data is ~8-10K tokens. Claude's context window is 200K+. The data fits trivially. RAG adds complexity (chunking, embedding, retrieval, relevance scoring) for zero benefit at this scale. Keep it simple.

If the dataset grew to hundreds of assets with years of sensor history, RAG would become necessary. For 10 assets in a demo, direct injection is correct.

### Streaming Implementation

Non-negotiable for chat UX. Architecture:
1. Worker calls Claude API with `stream: true`
2. Claude sends `content_block_delta` events with text chunks
3. Worker pipes SSE events to frontend
4. Frontend appends tokens as they arrive

React side: custom hook (not Vercel AI SDK -- see below).

### Vercel AI SDK vs Custom Implementation

**Recommendation: Go custom.**

| | Vercel AI SDK | Custom |
|---|---|---|
| Effort | Saves ~100 lines | ~200 lines total |
| Dependencies | Adds @ai-sdk/anthropic, ai | Zero new deps (just fetch + SSE) |
| Philosophy | Framework-y | Matches project's zero-framework approach |
| Portfolio signal | "I used a library" | "I understand streaming and built it clean" |
| Control | Abstracted | Full control over behavior |

The `useChat` hook is designed for Next.js. Making it work with Vite + Cloudflare Worker requires workarounds. A clean custom hook is simpler, more impressive, and more educational for code reviewers.

### UI Pattern

**Slide-over panel (recommended).** Mirrors NotificationsPanel pattern:
- 400px panel slides in from right edge
- Doesn't obscure dashboard -- Diane sees KPIs while talking to AI
- Mutual exclusion with NotificationsPanel (ADR-009 pattern)
- Mobile: full-screen (existing mobile pattern)
- TopBar: sparkle/brain icon next to notification bell
- Close: X button + Escape key
- Focus trap: reuse useFocusTrap.js

**Empty state suggested prompts:**
- "What happened overnight?"
- "Why did K-101 trip?"
- "Which assets need attention?"
- "Should I worry about P-203?"

**Secondary patterns (Tier 2):**
- Contextual AI cards on Asset Inspection ("3 things to know about this asset")
- Cmd+K command palette for natural language search
- These coexist with the chat panel

### API Key Security

1. API key stored as Cloudflare Worker secret (`wrangler secret put ANTHROPIC_API_KEY`)
2. Worker validates request origin (CORS whitelist for Vercel domain + localhost)
3. Rate limiting: 20 requests per IP per hour
4. Optional: simple auth token in env variable on Vercel

Sufficient for a portfolio demo. Not building production auth -- just preventing API key exposure and bill runaway.

### Component Architecture

```
src/
  components/
    AiAssistant.jsx          -- Slide-over panel (mirrors NotificationsPanel)
    AiMessageThread.jsx      -- Scrollable message list
    AiInput.jsx              -- Textarea + send button
    AiSuggestedPrompts.jsx   -- Empty state prompt chips
  hooks/
    useApmChat.js            -- Custom hook: messages, sendMessage, isLoading, error
  data/
    systemPrompt.js          -- Builds system prompt from baytown.js data + role
```

---

## Part 4: Why This Is Not Gimmicky

**Every major APM vendor is racing to build this feature, and none have shipped anything great yet.**

IBM's Maximo Assistant is the closest, and reviewers say it "requires very accurate data" and "feels less automated than expected." Our demo has perfectly structured data (baytown.js) -- which means our AI assistant will actually work well, demonstrating what's possible when the data layer is right.

**What impresses hiring managers:**
- Domain understanding (not "I added AI" but "I designed an AI assistant for how reliability engineers actually investigate failures")
- System prompt design shows product thinking
- Streaming UX with proper loading states shows frontend craft
- API key security via Worker shows production awareness
- Cost analysis shows business sense
- Role-aware responses demonstrate the dual-persona design thinking

**What would be gimmicky:**
- Generic ChatGPT wrapper with no domain context
- AI that fabricates data or gives vague answers
- Chat widget with no connection to the rest of the dashboard
- No consideration for cost, security, or rate limiting

---

## Sources
- IBM Maximo 9.1 AI-Powered Asset Management (erp.today)
- IBM Maximo Gen AI Assistant Announcement (IBM Newsroom)
- IBM watsonx Orchestrate + Maximo Integration (GitHub)
- SAP Joule in Asset Performance Management (SAP Discovery Center)
- SAP Business AI Q4 2025 Release Highlights (SAP News)
- SAP EAM AI-Driven Features (Emixa)
- SAP AI Agents 2026: Joule Studio (AIMultiple Research)
- GE Vernova 2025 Innovations & 2026 Roadmap (GE Vernova)
- GE Vernova Leading Industrial AI (GE Vernova Blog)
- Honeywell Unveils AI Assistant Feb 2025 (Honeywell Press)
- Honeywell + Google Cloud AI Agents (Google Cloud Press)
- Honeywell Forge Production Intelligence (Industrial Automation India)
- Emerson Aspen Mtell APM AI Reliability Tools (Control)
- Samsara Intelligence Suite (Samsara)
- Samsara Assistant Help Center (Samsara KB)
- Claude API Pricing (Anthropic)
- Vercel AI SDK 6 (Vercel Blog)
- AI SDK Documentation (ai-sdk.dev)
- Design Patterns for AI Interfaces (Smashing Magazine)
- AI Chat UI Design Trends 2025 (MultitaskAI)
- Claude API Streaming Documentation (Anthropic)
- Anthropic TypeScript SDK (GitHub)
