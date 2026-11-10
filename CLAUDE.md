# Small Steps app

A prototype mobile app built with **Expo (React Native) + Expo Router + TypeScript**.
All code lives in [`mobile/`](mobile/). There is no backend, database, API key or `.env` file:
app state (requests, volunteers, trusted contacts) is held in memory in
[`mobile/src/contexts/assistance-context.tsx`](mobile/src/contexts/assistance-context.tsx)
and resets when the app reloads. SMS messages are demo previews only; nothing is sent.

Expo-specific coding rules for Claude are in `mobile/AGENTS.md`:
@mobile/AGENTS.md

## Software to install on a new machine

| Software | Needed for | Notes |
|---|---|---|
| **Git** | Cloning the repo | |
| **Node.js (LTS, v24 used here)** | Running everything | Install from nodejs.org or `nvm install --lts`. npm comes with it. |
| **VS Code** (optional) | Editing | Install the recommended **Expo Tools** extension when prompted. |
| **Expo Go** app on your phone | Running on a real device | From the App Store / Play Store. Its version must support the project's Expo SDK (**SDK 58**). |
| **Xcode** (macOS only, optional) | iOS Simulator | Install from the Mac App Store, open it once, then add an iOS simulator under Settings → Components. |
| **Android Studio** (optional) | Android Emulator | Create a virtual device in Device Manager. |

Only one of Expo Go, Xcode or Android Studio is needed. To try the app with none of them,
run the web version in a browser.

The project uses **npm** (there is a `package-lock.json`). Don't switch to yarn, pnpm or bun.

## First-time setup

```bash
git clone <repo-url> small-steps-app
cd small-steps-app/mobile
npm install
```

## Running the app

Run all commands from `mobile/`.

```bash
npx expo start      # start the dev server (same as: npm start)
```

Then in the terminal:
- scan the QR code with your phone camera (iOS) or the Expo Go app (Android), with the phone on the same Wi-Fi as the computer
- press `i` for the iOS Simulator, `a` for the Android Emulator, `w` for the web browser

Shortcuts:

```bash
npm run ios         # start and open the iOS Simulator
npm run android     # start and open the Android Emulator
npm run web         # start and open in a web browser
```

If the phone can't connect (because of a work network or firewall), use `npx expo start --tunnel`.

## Checks (run before committing)

```bash
npx expo lint       # lint (sets up ESLint the first time it runs)
npx tsc --noEmit    # TypeScript type check
npx expo-doctor     # check dependency and config problems
```

## Adding packages

Always add packages with `npx expo install <package>`, not `npm install <package>`.
It picks versions that are compatible with the Expo SDK.
If versions drift, run `npx expo install --fix`.

## Building and installing outside of Expo Go

You don't need a build step for local development. Expo compiles the code when you run `expo start`.
For standalone builds, use EAS (Expo's cloud build service, which needs a free expo.dev account):

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform ios|android
```

The `ios/` and `android/` folders are generated and git-ignored. Don't create them or edit them by hand.

## Project layout

- `mobile/src/app/`: screens (file-based routing). `index.tsx` is home, plus `volunteer.tsx`, `organiser.tsx`, `trusted-contacts.tsx` and `explore.tsx`. `_layout.tsx` wraps the app in the theme and `AssistanceProvider`.
- `mobile/src/components/`: shared UI (tabs, themed text and views)
- `mobile/src/contexts/`: in-memory app state and demo actions
- `mobile/src/constants/theme.ts`: colours and fonts
- `mobile/app.json`: Expo config (name, icons, splash screen, plugins)

## Troubleshooting

- **App behaves strangely or shows a stale bundle:** `npx expo start -c` clears the Metro cache.
- **"Project is incompatible with this version of Expo Go":** update Expo Go on the phone. It must support SDK 58.
- **Install errors after pulling changes:** delete `node_modules` and run `npm install` again.
