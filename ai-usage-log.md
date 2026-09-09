# AI Usage Log

Tracks how the developer directed Claude during this project — specifically decisions, constraints, and information provided by the developer vs. delegated to AI.

---

## Session 1 — Project Setup

### Prompt 1: Project Brief & Architecture Kickoff

**What the developer specified:**
- App type: To-Do list
- Tech stack (all chosen by developer): React (frontend), Python + FastAPI (backend), SQLite (database)
- Feature requirements: add/edit/delete tasks, mark complete, basic persistence
- Explicit goal framing: functional over impressive — reliability over polish
- Behavioural constraints placed on Claude:
  - No running commands without approval
  - Small, focused changes only
  - Show code snippets with explanations for every change
  - No unnecessary abstractions or dependencies
  - No commits without approval
- Claude's role defined as: software architect (design, component communication, engineering principles)

**What was delegated to Claude:**
- How to structure the CLAUDE.md
- Specific file/folder layout within the stack
- Which engineering principles to apply

---

### Prompt 2: API Style & Repo Layout

**What the developer decided (via multiple choice):**
- API style: REST (chose over GraphQL)
- Repo structure: Monorepo with `frontend/` and `backend/` folders (chose over separate repos)

**What was delegated to Claude:**
- Recommending the options to choose from
- Translating decisions into the CLAUDE.md

---

### Prompt 3: AI Usage Tracking Request

**What the developer specified:**
- Requested a dedicated doc to track AI prompting patterns
- Clarified the purpose: to support an AI usage report
- Specified the focus: capture developer-provided decisions and information, not just what Claude did

**What was delegated to Claude:**
- Format and structure of this log
- Deciding what counts as a notable prompt to record

---
