# Agents Guide

## Commands

- **Lint**: `npm run lint` - Check code for style and syntax issues
- **Format**: `npm run format` - Auto-format code with Prettier
- **Validate**: `npm run validate` - Run both lint and format
- **Deploy**: `npm run deploy` - Deploy to Cloudflare Workers
- **Dev**: `npm run dev` - Start development server

## Email Management Commands

- **Add email**: `npm run add-email <email>` - Add officer email for verification
- **List emails**: `npm run list-email` - Show all verified emails
- **Delete email**: `npm run delete-email <email>` - Remove officer email
- **Check emails**: `npm run check` - Validate email routing

## Code Style

- TypeScript with strict mode enabled
- ESLint for code quality
- Prettier for formatting
- Prefix unused parameters with `_`

## Architecture

- Cloudflare Workers email routing system
- Route definitions in [`src/routes.ts`](src/routes.ts)
- Main handler in [`src/worker.ts`](src/worker.ts)
- Email validation scripts in [`scripts/`](scripts/)

## Security

- Domain validation prevents forwarding abuse
- Auto-reply headers prevent mail loops
- Address normalization for case sensitivity
- Blackhole functionality for unmonitored addresses
