# Social Sanitation

The client app for Social Sanitation, built with React Native 0.88 and TypeScript. Clients
see their visits, sign and pay documents, request services, and manage their account.

## Requirements

- Node.js 22.13 or later (see `engines` in `package.json`)
- Android: Android Studio with JDK 17 or later
- iOS: Xcode, Ruby, and Bundler (the `Gemfile` pins CocoaPods)

## Setup

```sh
npm install
cp .env.example .env          # then fill in the values
cd ios && bundle install && bundle exec pod install && cd ..
```

`.env` is read at build time by `react-native-config`, so rebuild the app after changing it.
Never put passwords or keys in it: its values ship inside the app.

Release builds for Android also need `android/signing/signing.properties`. Copy
`signing.properties.example` and fill in the upload key details. The file is git-ignored.

## Scripts

| Command             | What it does                       |
| ------------------- | ---------------------------------- |
| `npm start`         | Starts Metro                       |
| `npm run android`   | Builds and runs the Android app    |
| `npm run ios`       | Builds and runs the iOS app        |
| `npm run lint`      | ESLint                             |
| `npm run typecheck` | TypeScript, without emitting files |
| `npm test`          | Jest                               |
| `npm run format`    | Formats the project with Prettier  |

## Project structure

```
assets/fonts/      Manrope and Sora, the website's fonts (SIL Open Font License), linked
                   into both apps
src/
  App.tsx          Root component: providers, navigation container, toasts
  api/             The API client (version 2), the session store, and one module per area
  assets/images/   The logo
  components/      Shared UI built on the theme, and the icon set
  config/          Values from .env
  hooks/           Loading data for screens, and paged lists
  navigation/      Root stack, bottom tabs, and route types
  screens/         One folder per area: auth, home, visits, documents, enquiries, account
  session/         Signed-in state, which decides the set of screens
  theme/           The global styles: the website's colours, type, spacing and shadow
  types/           Type declarations for imported assets
  utils/           Dates, formatting, validation, status labels, and HTML to text
```

Screens and components take every colour, font, size and shadow from `src/theme`. The
session token is kept in the iOS Keychain and in Keystore-encrypted storage on Android.

Tests sit next to the code they test, as `*.test.ts`.
