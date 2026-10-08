import express from 'express';
import path from 'path';
import { setupMiddleware } from './middleware/assets.middleware';
import { Routes } from './routes/Routes';

(async (): Promise<void> => {
  const server = express();
  const port = Number(process.env.PORT) || 3000;

  // Rejestracja standardowych middleware (np. parser body, sesje)
  setupMiddleware(server);

  // Udostępnienie folderu 'public' jako zasobu plików statycznych
  server.use(express.static(path.join(process.cwd(), 'public')));

  // Rejestracja tras aplikacji
  new Routes(server, __dirname);

  server.listen(port, () => {
    console.log(`[Log] Server listening under port: ${port}`);
  });
})().catch((err) => {
  console.log(err instanceof Error ? err.message : err);
  // process.exit(1);
});
