# AI Usage Reflection

## How did you break down the problem before prompting?

Before writing a single prompt, I defined the scope clearly: a functional to-do app with add, edit, delete, complete toggle, and persistence — nothing more. I chose the tech stack independently (React, FastAPI, SQLite) and came in with that decision already made, using Claude to validate gaps rather than to choose for me.

I insisted on a planning phase before any code. Claude produced written plans for both layers, I reviewed them, and only approved implementation once satisfied. I enforced a test-first approach throughout and staged the build deliberately — backend first, validated via FastAPI's `/docs`, then frontend.

## What did the AI get wrong, and how did you fix it?

The most consequential pattern was failing to make complete changes when the architecture shifted. When I dropped CORS in favour of the Vite proxy, Claude updated the backend and Vite config but left a stale reference in `CLAUDE.md`. The README had the same problem — it described the old two-port setup rather than the single-port approach we'd agreed on. The AI made the functional change but didn't audit everywhere the old decision was documented.

A related gap: when I added the nullable deadline field, Claude didn't update the Pydantic validation at the same time. The field existed in the database and response but lacked a date-format check until I explicitly asked. Partial implementations like this could easily ship as silent bugs.

At runtime, two backend errors surfaced that tests hadn't caught — a SQLite cross-thread error and a "closed database" error from misusing a Python generator. On the frontend, validation failures showed a generic "something went wrong" instead of the actual FastAPI message, which I caught during manual testing.

## What did you deliberately not delegate to AI, and why?

I made all product decisions myself: the tech stack, feature scope, the deadline field, and the rule rejecting titles made of only special characters. Delegating these would mean letting the AI set requirements, which is backwards.

I also never handed a plan back to the AI and asked it to execute it. I read and digested each plan myself, then issued specific, targeted prompts for individual changes. This kept me in control of what was being built rather than rubber-stamping a bulk implementation I hadn't fully understood.

All commands and tests were run by me. Bugs like the SQLite cross-thread error and the generic error message only surfaced because I was actually running the app — not just reading the code.

## What would you do differently with more time?

I would add a loading state to the UI — slow API responses currently flash an empty list before tasks appear. I would also write at least one integration test hitting the real backend, since the mocked frontend tests can't catch API contract mismatches between layers. Finally, I would pin backend dependencies to specific versions for more reproducible installs.
