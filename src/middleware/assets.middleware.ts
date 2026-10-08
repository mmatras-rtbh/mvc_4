import { join } from 'path';
import { Express } from 'express';
import express from 'express';
import session from 'express-session';
import { injectSessionData } from './sessionData';

export function setupMiddleware(server: Express) {
  // 1. Serwowanie plików statycznych z folderu public w katalogu głównym
  server.use(express.static(join(process.cwd(), 'public')));

  // 2. Parser JSON oraz danych z formularzy (URL-encoded)
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // 3. Obsługa sesji
  server.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'default_secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false, // TRUE dla HTTPS
        maxAge: 60 * 60 * 1000, // 1 godzina
      },
    })
  );

  // 4. Własny middleware sesyjny
  server.use(injectSessionData);
}
