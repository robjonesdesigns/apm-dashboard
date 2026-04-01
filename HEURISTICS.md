# Nielsen's 10 Usability Heuristics -- Comprehensive Evaluation Reference

Last updated: 2026-03-31

---

## Table of Contents

1. [The 10 Heuristics (Full Detail)](#the-10-heuristics)
2. [Severity Rating Scale](#severity-rating-scale)
3. [Evaluation Methodology](#evaluation-methodology)
4. [Deliverable Format](#deliverable-format)

---

## The 10 Heuristics

### H1: Visibility of System Status

**Definition (Nielsen):** "The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time."

**Rationale:** When users understand the current system status, they learn outcomes of prior interactions and can determine next steps. Predictable interactions build trust in the product and brand.

**What to look for (positive indicators):**
- System provides immediate feedback after user actions (button state changes, loading indicators, confirmation messages)
- Progress bars or step indicators for multi-step processes
- Clear status indicators using color, icons, or text (e.g., "Saving...", "Saved", "Draft", "Published")
- Users receive confirmation when requests are processed successfully
- No ambiguity about whether an action succeeded or failed
- Real-time validation on form inputs
- Breadcrumbs or navigation indicators showing current location
- Active/selected states on navigation items
- Cursor changes to indicate interactive elements
- Meaningful page titles that reflect current context

**Common violations (red flags):**
- No loading indicator during async operations
- Generic "Please wait" messages with spinner animations for operations exceeding 10 seconds (complex apps need step-level progress)
- Form submission with no success/failure feedback
- Navigation changes with no visual indication of current page
- Background processes completing silently with no notification
- Stale data displayed without timestamp or refresh indicator
- No indication of connection status (online/offline)
- Upload progress missing file size, time remaining, or percentage
- Silent failures where errors occur but nothing is communicated

**Severity guidance:**
- Cosmetic (1): Active nav state missing but location is otherwise clear from page content
- Minor (2): Loading spinner present but no indication of what is loading or how long it will take
- Major (3): Form submits with no success/error feedback, leaving user uncertain
- Catastrophic (4): Destructive action (delete, payment) completes with zero confirmation

---

### H2: Match Between System and the Real World

**Definition (Nielsen):** "The design should speak the users' language. Use words, phrases, and concepts familiar to the user, rather than internal jargon. Follow real-world conventions, making information appear in a natural and logical order."

**Rationale:** Terms and concepts clear to designers or engineers may be foreign to users. When controls follow real-world conventions and correspond to desired outcomes (natural mapping), users learn and remember interface functions more easily, creating an intuitive experience.

**What to look for (positive indicators):**
- Labels, instructions, and copy use plain language the target audience understands
- Abbreviations are explained on first use
- Information follows a natural, logical order matching user mental models
- Icons and metaphors align with real-world conventions (e.g., trash can for delete, envelope for email)
- Layout of controls mirrors physical-world spatial relationships (natural mapping)
- Date formats, currency, units match user locale
- Categorization and grouping reflect how users think about the domain, not how the database is structured
- Error messages use human language, not error codes

**Common violations (red flags):**
- Internal jargon, technical terms, or database field names exposed in the UI ("varchar", "null", "BLOB")
- Icons that contradict cultural conventions (NNGroup example: coffee cup icon used for "available" status in call center software -- users expected it to mean "on break")
- Information organized by system architecture rather than user tasks
- Date/time formats inconsistent with locale (e.g., MM/DD/YYYY for European users)
- Developer-facing language in user-facing copy ("404", "exception", "payload")
- Alphabetical ordering where task-based or frequency-based ordering would serve users better
- Metaphors that do not translate across cultures

**Severity guidance:**
- Cosmetic (1): Slightly unfamiliar label that users can still figure out from context
- Minor (2): Jargon in a secondary screen that slows down but does not block the task
- Major (3): Confusing terminology on a primary workflow that causes users to choose wrong options
- Catastrophic (4): Misleading icon or label that causes users to take destructive or irreversible actions

---

### H3: User Control and Freedom

**Definition (Nielsen):** "Users often perform actions by mistake. They need a clearly marked 'emergency exit' to leave the unwanted action without having to go through an extended process."

**Rationale:** When it is easy to back out of a process or undo an action, it fosters confidence and freedom. Users maintain control of the system, avoid frustration, and feel safe exploring. This supports "learning by doing" without severe consequences.

**What to look for (positive indicators):**
- Undo/Redo functionality available for destructive or significant actions
- Cancel buttons present in all multi-step workflows and modal dialogs
- Users can exit any flow at any point without penalty
- "Back" navigation works predictably
- Ability to save progress and return later (draft states)
- Confirmation dialogs before irreversible actions (delete, submit payment)
- Version history or project history allowing restoration of previous states
- Users can dismiss modals, popups, and overlays easily (close button, click outside, Escape key)
- Editing inline rather than requiring navigation to a separate edit screen

**Common violations (red flags):**
- No undo for destructive actions (permanent delete with no recovery)
- Modal dialogs with no close button or Escape key dismissal
- Multi-step wizard with no back button
- Form progress lost when navigating away accidentally (no auto-save, no "unsaved changes" warning)
- Forced linear flows with no ability to skip or return to previous steps
- Confirmation dialogs that are ambiguous ("Are you sure?" with "OK" / "Cancel" -- OK to do what?)
- Trapping users in a flow (e.g., onboarding that cannot be skipped or exited)
- Settings changes applied immediately with no way to revert

**Severity guidance:**
- Cosmetic (1): Missing Escape-key dismissal on a non-critical modal
- Minor (2): No undo on a low-stakes action (e.g., reordering a list)
- Major (3): Multi-step form loses all progress on accidental back-navigation
- Catastrophic (4): Permanent data deletion with no confirmation dialog and no recovery option

---

### H4: Consistency and Standards

**Definition (Nielsen):** "Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions."

**Rationale:** Jakob's Law states that people spend most of their time using products *other than yours*, which sets their expectations. Inconsistency increases cognitive load by forcing users to learn new representations and patterns. There are two dimensions: internal consistency (within your product) and external consistency (with platform/industry conventions).

**What to look for (positive indicators):**
- Same action uses the same label, icon, and position throughout the product (internal consistency)
- Standard platform conventions followed (e.g., settings gear icon, hamburger menu, close X)
- Primary CTA in consistent position and visual treatment across screens
- Typography, color, spacing, and component styles follow a coherent system
- Terminology consistent throughout -- same concept never referred to by multiple names
- Keyboard shortcuts follow platform conventions (Cmd+S for save on Mac, Ctrl+S on Windows)
- Link styling consistent and distinguishable from body text
- Error, success, and warning states follow a consistent visual pattern

**Common violations (red flags):**
- Same icon meaning different things in different contexts (NNGroup example: plus sign used for both "add item" and "expand/collapse" in the same application)
- Different visual treatments for the same type of action across screens
- Inconsistent terminology (e.g., "Delete" in one place, "Remove" in another, "Trash" in a third)
- Non-standard icon usage (e.g., using a non-standard icon for search)
- CTAs that move position or change visual weight across screens
- Different interaction patterns for similar components (some dropdowns open on click, others on hover)
- Breaking platform conventions without good reason (e.g., putting navigation on the right on a web app)
- Inconsistent date/number formatting across the product

**Severity guidance:**
- Cosmetic (1): Minor visual inconsistency (e.g., slightly different padding on similar cards)
- Minor (2): Inconsistent terminology in secondary flows
- Major (3): Same icon or control behaving differently in different parts of the core workflow
- Catastrophic (4): Critical action (e.g., "Confirm" button) appears in different positions on different screens, causing users to accidentally trigger wrong actions

---

### H5: Error Prevention

**Definition (Nielsen):** "Good error messages are important, but the best designs carefully prevent problems from occurring in the first place. Either eliminate error-prone conditions, or check for them and present users with a confirmation option before they commit to the action."

**Rationale:** There are two types of errors: slips (unconscious errors from inattention) and mistakes (conscious errors from mismatched mental models). High-priority items should focus on preventing high-cost errors first, then reducing small frustrations. Prevention is always preferable to recovery.

**What to look for (positive indicators):**
- Input constraints that prevent invalid data (date pickers instead of free text, input masks for phone numbers)
- Real-time validation with inline feedback before form submission
- Confirmation dialogs before high-stakes actions (delete, bulk operations, financial transactions)
- Sensible defaults that reduce the chance of error
- Autocomplete and suggestions that guide correct input
- Disabled states on buttons/actions that are not currently available (with explanation of why)
- Guardrails on dangerous operations (e.g., requiring users to type a project name to confirm deletion)
- Preview/review step before final submission
- Live preview showing effect of settings changes (NNGroup example: Salesforce dashboard builder shows real-time widget preview as parameters change)
- Character counts and input length indicators
- Undo as a safety net when prevention is not feasible

**Common violations (red flags):**
- Free-text fields for structured data (dates, phone numbers, currency) with no format guidance
- No validation until after form submission (batch error display)
- Destructive actions available with a single click and no confirmation
- No constraints on numerical inputs (accepting negative numbers, impossibly large values)
- Delete button adjacent to Edit button with similar styling
- No draft/auto-save on long forms
- Allowing submission of incomplete required fields
- Search with no suggestions or spell correction
- Complex operations with no preview of outcome

**Severity guidance:**
- Cosmetic (1): Missing character count on a text field with a length limit
- Minor (2): No autocomplete on a search field where it would reduce typos
- Major (3): No confirmation before bulk delete of multiple records
- Catastrophic (4): Financial transaction or data migration can be triggered accidentally with no review step

---

### H6: Recognition Rather Than Recall

**Definition (Nielsen):** "Minimize the user's memory load by making elements, actions, and options visible. The user should not have to remember information from one part of the interface to another. Information required to use the design (e.g., field labels or menu items) should be visible or easily retrievable when needed."

**Rationale:** Humans have limited short-term memory. Interfaces that promote recognition over recall reduce required cognitive effort. Recognition (seeing and identifying) is cognitively easier than recall (retrieving from memory without cues).

**What to look for (positive indicators):**
- Labels visible on all form fields (not placeholder-only labels that disappear on focus)
- Navigation categories visible rather than hidden behind hamburger menus on desktop
- Recently used items, recent searches, or history readily accessible
- Contextual information displayed where needed (e.g., hovering over a part number shows an image and name -- NNGroup Revit example)
- Visible instructions or hints near complex inputs
- Inline help and tooltips on unfamiliar controls
- Icons paired with text labels rather than icons alone
- Comparison views that place options side-by-side rather than requiring users to remember across pages
- Selected filters/criteria visible on results screens
- Persistent display of key context (user name, project name, current role)

**Common violations (red flags):**
- Hamburger menus hiding primary navigation on desktop (forces recall of what categories exist)
- Placeholder text used as the only label (disappears when user begins typing)
- Requiring users to remember codes, IDs, or values from one screen to enter on another
- Icon-only toolbars with no labels and no tooltips
- Settings pages where users must recall what each option does without inline descriptions
- Search results that do not show which filters/criteria are active
- Multi-step forms that do not show a summary of previous steps
- Relying on users to memorize keyboard shortcuts without providing discoverability

**Severity guidance:**
- Cosmetic (1): Icon-only actions in a secondary toolbar, with tooltips available on hover
- Minor (2): Hamburger menu hiding useful navigation categories on desktop
- Major (3): Users must remember a product code from a catalog page to enter on an order page
- Catastrophic (4): Critical workflow requires memorizing values across screens with no cross-reference available

---

### H7: Flexibility and Efficiency of Use

**Definition (Nielsen):** "Shortcuts -- hidden from novice users -- may speed up the interaction for the expert user so that the design can cater to both inexperienced and experienced users. Allow users to tailor frequent actions."

**Rationale:** Flexible processes accommodate different user methods, allowing individuals to choose approaches that work for them. Expert users should be able to work faster through accelerators, while novice users should not be overwhelmed by them.

**What to look for (positive indicators):**
- Keyboard shortcuts available for frequent actions
- Customizable interface (rearrangeable dashboard, configurable views)
- Multiple input methods supported (click, keyboard, drag-and-drop, touch gestures)
- Power-user features like bulk actions, batch editing, advanced search/filters
- Gestural shortcuts for frequent commands (NNGroup Solidworks example: mouse gestures trigger custom commands)
- Adjustable information density (compact vs. comfortable views)
- Saved searches, templates, or presets for repeated workflows
- Personalization features (favorites, pinned items, recent items)
- Responsive shortcuts that adapt to user behavior patterns
- Touch targets appropriately sized for the input method

**Common violations (red flags):**
- No keyboard shortcuts for any actions
- Forced step-by-step wizards with no way to skip for experienced users
- No bulk/batch operations for repetitive tasks
- One-size-fits-all interface with no customization
- No way to save frequently used configurations
- Desktop application with no keyboard navigation support
- Repetitive data entry with no templates, defaults, or copy-from-previous
- Long forms with no option to import data
- Mobile app with no gesture support beyond basic tap

**Severity guidance:**
- Cosmetic (1): Missing keyboard shortcut for a rarely-used action
- Minor (2): No bulk selection/action in a list view
- Major (3): Expert users forced through the same multi-step onboarding wizard every time
- Catastrophic (4): High-frequency task (used dozens of times daily) has no shortcut and requires 5+ clicks each time

---

### H8: Aesthetic and Minimalist Design

**Definition (Nielsen):** "Interfaces should not contain information that is irrelevant or rarely needed. Every extra unit of information in an interface competes with the relevant units of information and diminishes their relative visibility."

**Rationale:** This is not about flat design or visual minimalism for its own sake. It is about ensuring content and visual design focus on essentials. Every element should serve the user's primary goals. Visual noise reduces signal.

**What to look for (positive indicators):**
- Only essential information visible on each screen
- Progressive disclosure: advanced options revealed only when relevant (NNGroup Mastercard example: permission fields appear only after "Mark as private" is checked)
- Clear visual hierarchy guiding the eye to the most important content first
- Adequate white space separating content groups
- No redundant elements (e.g., no icon + label when the label alone is sufficient in context)
- Data visualizations show only actionable information
- Content prioritized by user task frequency and importance
- Secondary actions visually de-emphasized relative to primary actions
- Clean typography with minimal style variations per screen

**Common violations (red flags):**
- Redundant icons on every item in a homogeneous list (NNGroup example: task icon on every item in a list that only contains tasks)
- Text overlaid on images where it reduces readability
- Too many competing CTAs on a single screen
- Dense walls of text with no hierarchy or scannable structure
- Decorative elements that add no informational value and distract from content
- Showing all available options/settings at once instead of using progressive disclosure
- Dashboard widgets displaying data no one acts on
- Marketing or promotional content injected into task-focused workflows
- Multiple font sizes, weights, and colors with no systematic purpose

**Severity guidance:**
- Cosmetic (1): Minor decorative element that does not meaningfully distract
- Minor (2): Redundant icons adding visual clutter in a secondary view
- Major (3): Critical workflow screen overloaded with irrelevant information, making primary actions hard to find
- Catastrophic (4): Essential actions or information buried under noise, causing users to miss critical steps

---

### H9: Help Users Recognize, Diagnose, and Recover from Errors

**Definition (Nielsen):** "Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution."

**Rationale:** Error messages should use visual treatments that help users notice them, use understandable language that avoids technical jargon, and provide immediate, actionable solutions. The goal is to get users back on track, not just inform them something went wrong.

**What to look for (positive indicators):**
- Error messages written in plain language, no codes
- Messages precisely identify the problem (which field, what input, why it failed)
- Messages suggest a concrete next step or solution
- Visual treatment makes errors noticeable (color, icon, position near the relevant element)
- Inline validation errors appear next to the relevant field, not just in a banner at the top
- Links to documentation or help when inline guidance is insufficient (NNGroup Jitterbit example: error messages contain links to detailed docs)
- Error state preserves user input so they do not have to re-enter data
- Differentiation between user errors and system errors
- Graceful degradation messaging when a service is unavailable

**Common violations (red flags):**
- Raw error codes or technical messages ("Error -1264", "500 Internal Server Error", "NullPointerException")
- Vague messages ("Something went wrong", "An error occurred")
- Dead-end errors with no recovery path (NNGroup ERP example: "Could not display data. Contact your system administrator.")
- Error messages that blame the user ("Invalid input", "You entered an incorrect value")
- Error banner at top of page with no indication of which field caused it
- Errors that clear the form, forcing users to re-enter all data
- No visual distinction between error messages and normal content
- Multiple errors reported one at a time (fix one, submit, discover next)

**Severity guidance:**
- Cosmetic (1): Error message is accurate but could be worded more helpfully
- Minor (2): Error identified but no specific resolution guidance provided
- Major (3): Vague error message on a critical workflow that leaves users unable to diagnose the problem
- Catastrophic (4): Error clears user input, displays only a code, and provides no recovery path on a primary workflow

---

### H10: Help and Documentation

**Definition (Nielsen):** "It's best if the system doesn't need any additional explanation. However, it may be necessary to provide documentation to help users understand how to complete their tasks."

**Rationale:** Help content should be searchable and task-focused, remaining concise with concrete steps listed clearly. In-context help (tooltips, inline guidance) is more likely to be used than external documentation.

**What to look for (positive indicators):**
- Onboarding flow for first-time users (not mandatory, skippable)
- Tooltips on complex or unfamiliar controls (NNGroup Revit example: hovering over toolbar icons shows description, keyboard shortcut, and video clip)
- Searchable help center or knowledge base
- Contextual help relevant to the current screen or task
- FAQ or troubleshooting section addressing common issues
- Empty states with guidance on how to get started
- Documentation organized by user task, not by feature
- Multiple help formats (text, video, interactive tutorials)
- In-app support channel (chat, contact form)
- Help content is concise and action-oriented, not verbose

**Common violations (red flags):**
- No help or documentation of any kind
- Help documentation organized by product feature rather than user task
- Documentation is outdated, inaccurate, or refers to deprecated UI
- Help requires leaving the application entirely
- No onboarding guidance for first-time users on a complex product
- Empty states with no guidance ("No items found" with no next step)
- Tooltips absent on icon-only controls
- Help content is verbose, jargon-heavy, or not searchable
- No way to contact support from within the product

**Severity guidance:**
- Cosmetic (1): Help exists but could be better organized
- Minor (2): Missing tooltips on secondary controls
- Major (3): Complex product with no onboarding and no in-context help on primary workflows
- Catastrophic (4): No documentation, no help, no support channel on a product that requires domain expertise to operate

---

## Severity Rating Scale

Nielsen's severity rating combines three independent factors:

1. **Frequency** -- Is the problem common or rare? How often do users encounter it?
2. **Impact** -- How difficult is it for users to overcome the problem when they encounter it?
3. **Persistence** -- Is it a one-time problem (users can work around it once they know about it) or does it repeatedly cause friction?

Additionally, **market impact** should be considered -- some problems can substantially damage product adoption or perception even if they are objectively easy to work around.

### The 0-4 Scale

| Rating | Label | Definition | Action Guidance |
|--------|-------|------------|-----------------|
| **0** | Not a problem | "I don't agree that this is a usability problem at all." | No action needed. Used when evaluators disagree on whether something is actually a problem. |
| **1** | Cosmetic | "Cosmetic problem only: need not be fixed unless extra time is available on project." | Fix if time permits. Lowest priority in backlog. |
| **2** | Minor | "Minor usability problem: fixing this should be given low priority." | Should be fixed but is not urgent. Schedule for a future iteration. |
| **3** | Major | "Major usability problem: important to fix, so should be given high priority." | Must be fixed. High priority. Address in current or next sprint. |
| **4** | Catastrophic | "Usability catastrophe: imperative to fix this before product can be released." | Blocks release. Fix immediately. |

### Collecting Severity Ratings

- Do NOT ask evaluators to assign severity during the evaluation session itself -- they should focus on finding problems.
- After all evaluations are complete, send evaluators the consolidated list of all discovered problems (with descriptions and screenshots).
- Each evaluator independently rates every problem on the 0-4 scale.
- Allow approximately 30 minutes for the rating exercise.
- Evaluators rate based on written descriptions and their memory of the evaluation -- they do not need system access.
- **Use the mean of ratings from at least three evaluators.** Individual ratings are unreliable; the mean of three is "satisfactory for many practical purposes" (Nielsen).

### Simplified Alternative

Modern NNGroup practice sometimes uses a simpler 3-point scale:
- **High** -- Must fix, blocks critical tasks
- **Medium** -- Should fix, causes friction
- **Low** -- Nice to fix, cosmetic or minor annoyance

---

## Evaluation Methodology

### Overview

Heuristic evaluation is a usability inspection method where evaluators examine an interface and judge its compliance with recognized usability principles (the 10 heuristics). It is a discount usability method -- faster and cheaper than full user testing -- and can be applied to designs at any fidelity, from paper prototypes to shipped products.

### Number of Evaluators

**Recommendation: 3 to 5 evaluators.**

Research basis:
- A single evaluator finds only about **35% of usability problems** on average (range: 19-51% across six research projects).
- Different evaluators find different problems -- there is low overlap between individual findings.
- The mathematical model: `ProblemsFound(i) = N(1 - (1-l)^i)` where N = total problems and l = proportion found by one evaluator.
- Diminishing returns set in after approximately 5 evaluators.
- Research showed a **benefit-to-cost ratio of 48:1 to 62:1** with 3-5 evaluators.

Cost structure (from Nielsen's research):
- Fixed costs (planning, materials, report writing): $3,700-$4,800
- Variable cost per evaluator: $410-$900
- Example: 4 evaluators at $6,400 total yielded ~$395,000 in expected benefit

For solo practitioners or small teams: even 1 evaluator is better than 0, but acknowledge you will find only a fraction of the problems. Document this limitation.

### Process Steps

**Step 1: Preparation**
- All evaluators read and internalize the 10 heuristics before starting
- Conduct a practice round on a simple, unrelated interface to calibrate the team
- Define scope: which task flows, user groups, device types, or sections to evaluate
- Choose documentation method (spreadsheet, workbook, or digital whiteboard)
- Establish that evaluators must NOT see each other's work until their own evaluation is complete

**Step 2: Independent Evaluation (1-2 hours per evaluator)**
- **First pass:** Walk through the entire interface as a user would. Understand the interaction flow and system scope. Do not document yet -- just build familiarity.
- **Second pass:** Go through again systematically, screen by screen. For each screen or interaction, check against each of the 10 heuristics. Document every violation found.
- For each violation, record:
  - Which heuristic is violated (by number and name)
  - Where in the interface (screen, component, interaction)
  - What the specific problem is (precise description)
  - Screenshot or annotation if possible
  - (Optional) Suggested fix

**Step 3: Consolidation**
- Evaluation manager collects all individual reports
- Deduplicate findings (same problem found by multiple evaluators)
- Use affinity diagramming to group related issues
- Discuss disagreements among evaluators
- Identify which issues are most detrimental to the overall experience
- Determine business-critical problems

**Step 4: Severity Rating (post-evaluation)**
- Distribute the complete consolidated problem list to all evaluators
- Each evaluator independently rates every problem on the 0-4 scale
- Calculate mean severity for each problem
- Rank problems by mean severity

**Step 5: Prioritization and Reporting**
- Sort findings by severity
- Identify quick wins (high severity + low effort to fix)
- Separate short-term fixes from long-term improvements
- Flag issues that need additional research or user testing to validate

### Key Distinction from User Testing

Heuristic evaluators do not need to simulate actual task completion or represent end users. They evaluate against established principles. This makes the method applicable to interfaces that are not yet functional (wireframes, mockups, paper prototypes), unlike user testing which requires a working or near-working system.

---

## Deliverable Format

### Recommended Report Structure

**1. Executive Summary**
- Scope of evaluation (which product/feature, which device, which user flows)
- Number of evaluators
- Total issues found
- Breakdown by severity (count of 0s, 1s, 2s, 3s, 4s)
- Top 3-5 critical findings

**2. Methodology**
- Brief description of process
- Evaluator profiles (experience level)
- Heuristics used (Nielsen's 10)
- Scope boundaries and limitations

**3. Findings Table**
Each finding as a row with:

| Column | Description |
|--------|-------------|
| ID | Unique identifier (e.g., H3-01 for the first User Control and Freedom issue) |
| Heuristic | Number and name of violated heuristic |
| Location | Screen, page, or component where the issue occurs |
| Description | Precise, specific description of the problem |
| Evidence | Screenshot or annotation |
| Severity | Mean rating (0-4) from evaluators |
| Recommendation | Suggested fix |

**4. Findings by Heuristic**
Group findings under each of the 10 heuristics with supporting screenshots. This view helps identify systemic patterns (e.g., "this product has widespread consistency problems").

**5. Prioritized Action Plan**
- Sorted by severity (4s first, then 3s, etc.)
- Quick wins highlighted
- Short-term vs. long-term fixes
- Issues requiring further user research noted

### Documentation Format Options

1. **Spreadsheet** -- One observation per row. Best for sorting, filtering, and quantitative analysis. Recommended for large evaluations.
2. **PDF Workbook** -- NNGroup provides a fillable workbook template with sections for each heuristic. Good for structured individual evaluations.
3. **Digital whiteboard** (Miro, Mural) -- Sticky notes on interface screenshots. Good for collaborative consolidation sessions. Separate workspace per evaluator during independent evaluation phase.
4. **Slide deck** -- Good for presenting findings to stakeholders. Each slide covers one finding with screenshot, heuristic, severity, and recommendation.

### Writing Effective Findings

- Be specific and precise. "The search function is confusing" is not actionable. "The search field on the Results page (H6) uses placeholder text 'Enter query' as its only label, which disappears on focus, requiring users to recall what the field is for" is actionable.
- Always tie the finding to a specific heuristic by number.
- Include a clear recommendation. Once the issue and its root cause are identified, the fix is often obvious.
- Include screenshots or annotations whenever possible.
- Separate the problem (objective observation) from the recommendation (proposed solution).

---

## Sources

- [10 Usability Heuristics for User Interface Design (nngroup.com)](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [Severity Ratings for Usability Problems (nngroup.com)](https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/)
- [How to Conduct a Heuristic Evaluation (nngroup.com)](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/)
- [The Theory Behind Heuristic Evaluations (nngroup.com)](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/theory-heuristic-evaluations/)
- [10 Usability Heuristics Applied to Complex Applications (nngroup.com)](https://www.nngroup.com/articles/usability-heuristics-complex-applications/)
- [UX Design Audit Checklist (eleken.co)](https://www.eleken.co/blog-posts/a-checklist-for-ux-design-audit-based-on-jakob-nielsens-10-usability-heuristics)
