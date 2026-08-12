---
sidebar_position: 2
description: Installiere Hive-Pal auf deinem eigenen Server mit einem einzelnen Docker-Container und PostgreSQL. Behandelt die compose-Datei, erforderliche Umgebungsvariablen und die erste Anmeldung.
keywords: [hive-pal installation, docker setup, self-hosted imkerei, better auth, einzelner container]
---

import Head from '@docusaurus/Head';

<Head>
  <script type="application/ld+json">
    {JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'Installiere Hive-Pal mit Docker',
      description:
        'Stelle Hive-Pal als einen einzelnen Docker-Container mit einer PostgreSQL-Datenbank bereit.',
      step: [
        { '@type': 'HowToStep', name: 'Erstelle eine docker-compose.yaml', text: 'Definiere den Single-Container-App-Service (ghcr.io/martinhrvn/hive-pal:latest) und einen PostgreSQL-Service mit erforderlichen Umgebungsvariablen.' },
        { '@type': 'HowToStep', name: 'Starten Sie die Anwendung', text: 'Führen Sie docker compose up -d aus. Die App wartet auf die Datenbank, führt Migrationen durch und startet den Admin-Benutzer automatisch.' },
        { '@type': 'HowToStep', name: 'Zugriff auf die Anwendung', text: 'Öffnen Sie die App in Ihrem Browser und melden Sie sich mit den konfigurierten Admin-Anmeldedaten an.' },
      ],
    })}
  </script>
</Head>

# Installationsanleitung

Hive-Pal wird als **einzelnes Docker-Image** (`ghcr.io/martinhrvn/hive-pal:latest`) ausgeliefert, das die NestJS-API und das React-Frontend kombiniert - das Backend serviert die Web-App als statische Dateien auf Port `3000`. Du brauchst nur zwei Container auszuführen: die App und eine PostgreSQL-Datenbank.

## Voraussetzungen

- Docker und Docker Compose
- Eine PostgreSQL 14-Datenbank (die Compose-Datei unten führt eine für dich aus)

## Docker-Installation (empfohlen)

### 1. Erstelle eine docker-compose.yaml-Datei

```yaml
services:
  app:
    image: ghcr.io/martinhrvn/hive-pal:latest
    ports:
      - '80:3000'
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://postgres:postgres@postgres:5432/beekeeper
      BETTER_AUTH_SECRET: replace_me_with_a_random_string
      BETTER_AUTH_URL: http://localhost
      ADMIN_EMAIL: admin@example.com
      ADMIN_PASSWORD: changeme123
      FRONTEND_URL: http://localhost
      STORAGE_TYPE: local # 'local' for filesystem, 's3' for S3-compatible storage
    volumes:
      - uploads:/data/uploads
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: beekeeper
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres -d beekeeper']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  uploads:
```

:::tip Generiere ein Geheimnis
`BETTER_AUTH_SECRET` signiert deine Login-Sessions. Generiere einen starken Wert mit:

```bash
openssl rand -base64 32
```
:::

### 2. Starten Sie die Anwendung

```bash
docker compose up -d
```

Beim Start wartet der App-Container automatisch auf PostgreSQL, führt Datenbankmigrationen (`prisma migrate deploy`) durch und erstellt/befördert den Admin-Benutzer aus `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

### 3. Zugriff auf die Anwendung

Öffne `http://localhost` und melde dich mit den konfigurierten Admin-Anmeldedaten an. Von dort aus kannst du zusätzliche Benutzer registrieren oder dich mit einem Magic Link oder Passkey anmelden, sobald E-Mail konfiguriert ist (siehe [Authentifizierung](#authentifizierung)).

## Erforderliche Umgebungsvariablen

| Variable | Beschreibung |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL-Verbindungszeichenfolge |
| `BETTER_AUTH_SECRET` | Geheimnis zum Signieren von Better Auth Sessions/Cookies (32+ Zeichen; `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Öffentliche Basis-URL, unter der die App (und `/api/auth/*`) serviert wird, z. B. `https://hive.example.com` |
| `ADMIN_EMAIL` | E-Mail des anfänglichen Admin-Kontos |
| `ADMIN_PASSWORD` | Admin-Passwort (Klartext; gehashed beim ersten Durchlauf) |
| `FRONTEND_URL` | Öffentliche URL der App - verwendet in E-Mail-Links und als vertraute Herkunft |

Die vollständige Referenz, einschließlich Authentifizierung, E-Mail, Speicher und Integrationen, finden Sie unter [Konfiguration](./self-hosting/configuration).

## Authentifizierung

Hive-Pal verwendet [Better Auth](https://www.better-auth.com/) für die Authentifizierung, das unter `/api/auth/*` verfügbar ist. Drei Anmeldemethoden werden unterstützt:

- **E-Mail & Passwort** — immer verfügbar.
- **Magic Link** — passwortlose E-Mail-Anmeldung. Erfordert konfigurierte E-Mail (SMTP oder Resend).
- **Passkeys (WebAuthn)** — biometrische / Hardware-Schlüssel-Anmeldung. Setze `PASSKEY_RP_ID` auf deine Domain in der Produktion (Standard: `localhost`).

Magic Links und Passwort-Zurückstellungen benötigen einen funktionierenden Mail-Provider. Konfiguriere SMTP oder Resend wie in [Konfiguration → E-Mail](./self-hosting/configuration#e-mail) beschrieben.

## Optionale HiveScale-Integration

Um Live-HiveScale-Gerätedaten in Hive-Pal anzuzeigen, führe ein HiveScale-Backend aus und setze diese Variablen auf der App:

```bash
HIVESCALE_API_BASE_URL=https://hivescale.example.com
HIVESCALE_SERVICE_API_KEY=a-long-random-shared-secret
```

Das gleiche Geheimnis muss auf HiveScale als `HIVEPAL_SERVICE_API_KEY` konfiguriert werden. Nach dem Verbinden kann die HiveScale-Seite Geräte beanspruchen und Gewichts-, Temperatur-, Akku-, Solar- und Mobilfunk-Telemetrie anzeigen. Siehe die [HiveScale-Anleitung](./user-guide/hivescale).

## Manuelle Installation (Entwicklung)

Für die lokale Entwicklung ohne Docker:

```bash
# Clone the repository
git clone https://github.com/martinhrvn/hive-pal.git
cd hive-pal

# Install dependencies
pnpm install

# Start the development servers (frontend + backend)
pnpm dev
```

Das Frontend läuft auf `http://localhost:5173` und das Backend auf `http://localhost:3000`. Vollständige Details finden Sie unter [Manuelle Konfiguration](./self-hosting/manual-setup), einschließlich der Datenbank.

## Aktualisierung von Hive-Pal

```bash
# Pull the latest image
docker pull ghcr.io/martinhrvn/hive-pal:latest

# Recreate the containers (migrations run automatically on start)
docker compose up -d
```

Erstelle immer [eine Sicherung deiner Datenbank](./self-hosting/backup-restore) vor dem Update.

