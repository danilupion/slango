# ADR-001: AI Documentation Structure

## Status

Accepted

## Date

$(date +%Y-%m-%d)

## Context

This project uses AI-assisted development with Claude Code. We need a consistent structure for maintaining context, specifications, and task tracking across sessions.

## Decision

Adopt the following documentation structure:

```
/
├── CLAUDE.md                    # Root context file (read first by AI)
└── .ai/
    ├── specs/                   # Technical specifications
    │   └── technical-spec.md    # Main system specification
    ├── tasks/                   # Task management
    │   ├── backlog.md           # Master backlog (index)
    │   └── epics/               # Epic-level backlogs
    │       └── epic-*.md
    └── decisions/               # Architecture Decision Records
        └── NNN-*.md             # Numbered ADRs
```

## Consequences

### Positive

- AI can quickly load context from CLAUDE.md
- Specifications persist across sessions
- Task progress is tracked and resumable
- Decisions are documented for future reference
- Epics allow focused work on related tasks

### Negative

- Additional files to maintain
- Must remember to update task status

## Alternatives Considered

### Single README.md

Too large, mixes concerns, difficult for AI to parse quickly.

### GitHub Issues

External dependency, harder for AI to access inline.

### No documentation

Context lost between sessions.
