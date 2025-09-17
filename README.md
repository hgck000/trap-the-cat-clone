# Trap the Cat (React + TypeScript + SVG)

A minimalist Trap-the-Cat clone built for web. Focus on clean architecture, deterministic seeding, and accessible UI.

## Features
- Hex-like grid (odd-r offset), SVG rendering, responsive.
- BFS pathfinding to nearest edge (cat moves 1 step per turn).
- Click to block cells, **Undo 1 step**, turn counter, **best score** (localStorage).
- Difficulty presets (Easy/Normal/Hard), **seed** via URL (`?seed=abcd`).
- Win/Lose feedback, optional sound toggle.

## Tech
- **React + TypeScript + Vite**
- **TailwindCSS** (utility-first styling)
- **Zustand** (lightweight state)
- **Vitest + Testing Library** (unit tests for BFS & grid)
- Deploy: **Vercel**

## Quick Start
```bash
npm install
npm run dev

## Build
```bash
npm run build
npm run preview
