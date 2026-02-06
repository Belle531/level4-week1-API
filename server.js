import { ensureEnv } from '#utils/env';
import { createApp } from '#app';
import { createRepos } from '#repositories/index';

async function startServer() {
  try {
    // 1. Initialize configuration and repositories
    const env = ensureEnv();
    const repos = await createRepos();

    // 2. Create the Express application instance
    const app = createApp({ repos });

    // 3. Start listening
    app.listen(env.PORT, () => {
      console.log(`ContentHub API is live at http://localhost:${env.PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit with failure code if something breaks
  }
}

// Execute the startup
startServer();