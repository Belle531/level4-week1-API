/**
 * server.js
 * The entry point for Cassandra's Digital Solutions API.
 * This file assembles the environment, repositories, and the application.
 */

import { ensureEnv } from '#utils/env';
import { createApp } from './createApp.js';
import { createRepos } from './src/repositories/index.js';

// 1. Initialize and Validate Environment Variables
// This will throw an error immediately if PORT or JWT_SECRET are missing/invalid
const { PORT, JWT_SECRET } = ensureEnv(); 

// 2. Initialize Repositories (The Data Layer)
// Since this is Day 3, this creates our In-Memory storage objects
const repos = await createRepos();

// --- DAY 2 START ---
// We place our data source here so it's ready before the app starts.
const items = [
  { id: 1, name: 'Item One' },
  { id: 2, name: 'Item Two' }
];


// We pass the repositories and the config (with our secret) into the factory function
const app = createApp({
  repos,
  items, // This makes our in-memory items available to the app
  config: {
    JWT_SECRET, 
  },
});

// 4. Start the Engine
app.listen(PORT, () => {
  console.log('---');
  console.log(`🚀 ContentHub API is live at http://localhost:${PORT}`);
  console.log('---');
});//Day 1 commit
// Day 1 Commit
