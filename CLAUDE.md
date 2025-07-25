# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Shopify Dev MCP Server - a Model Context Protocol (MCP) server that provides AI assistants with tools to interact with Shopify APIs and development resources. It enables searching Shopify documentation, validating GraphQL operations, inspecting schemas, and validating theme code.

## Essential Commands

```bash
# Development
npm install          # Install dependencies
npm run build        # Build TypeScript
npm run build:watch  # Build with watch mode
npm run inspector    # Debug with MCP inspector

# Testing
npm run test         # Run all tests
npm run test:watch   # Test watch mode

# Code Quality
npm run typecheck    # Type checking
npm run lint         # Check formatting
npm run lint:fix     # Fix formatting

# Release
npm run changeset    # Create changeset for releases
```

## Architecture Overview

The codebase follows a modular MCP server structure:

1. **Entry Point**: `src/index.ts` sets up the MCP server with tools and prompts
2. **Tools**: Each tool in `src/tools/` implements a specific Shopify development capability
3. **Validations**: `src/validations/` contains logic for validating GraphQL and theme code
4. **Type Safety**: Uses Zod schemas extensively for runtime validation

### Key Architectural Patterns

- **MCP Protocol**: All tools follow the MCP tool interface with proper input/output schemas
- **Zod Validation**: Every tool input is validated using Zod schemas
- **Error Handling**: Tools return structured errors with helpful messages
- **Optional Features**: Theme validation tools can be enabled via environment variables

### Tool Flow

1. `learn_shopify_api` - Entry point that generates conversation IDs
2. `search_docs_chunks` - Searches documentation using the conversation ID
3. `fetch_full_docs` - Retrieves complete documentation pages
4. Other tools provide specific functionality (GraphQL validation, schema introspection)

## Testing Strategy

- Tests are co-located with source files (`*.test.ts`)
- Use Vitest with mock file system operations
- Mock implementations in `__mocks__/fs.js`
- Run individual tests: `npm run test -- path/to/file.test.ts`

## Environment Configuration

Optional features controlled by environment variables:

- `OPT_OUT_INSTRUMENTATION=1` - Disable usage tracking
- `POLARIS_UNIFIED=1` - Enable Polaris design system support
- `LIQUID_MCP=1` - Enable theme validation tools
