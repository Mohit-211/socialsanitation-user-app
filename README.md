# Social Sanitation

The client app for Social Sanitation, built with React Native 0.88 and TypeScript. Clients
see their bookings, sign and pay documents, request services, and manage their account.

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

Push notifications come through Firebase Cloud Messaging, and neither app builds without
its Firebase config file. Download them from the Firebase console (Project settings, Your
apps). Both are git-ignored.

| File                       | App                                | Goes in                 |
| -------------------------- | ---------------------------------- | ----------------------- |
| `google-services.json`     | Android, `com.socialsanitationapp` | `android/app/`          |
| `GoogleService-Info.plist` | iOS, `com.sanitationUser`          | `ios/SocialSanitation/` |

For iOS pushes, the Firebase project also needs an APNs authentication key (Project
settings, Cloud Messaging), and the App ID needs the Push Notifications capability. The
Firebase Apple SDK comes through Swift Package Manager, so `pod install` builds every pod as
a dynamic framework, and the first iOS build downloads the Firebase packages.

Release builds for Android also need `android/signing/signing.properties`. Copy
`signing.properties.example` and fill in the upload key details. The file is git-ignored.

## Releasing on Android

`cd android && ./gradlew bundleRelease` writes `app/build/outputs/bundle/release/app-release.aab`.
R8 shrinks and obfuscates release builds, and the bundle carries the deobfuscation file
(R8's mapping) and the native debug symbols, so Google Play shows readable crashes and ANRs
without a separate upload. If Play ever asks for the file by hand, it is
`android/app/build/outputs/mapping/release/mapping.txt`, from the same build.

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
  push/            Push notifications: the phone's token, the permission, taps on a push
  screens/         One folder per area: auth, home, visits, documents, enquiries, account
  session/         Signed-in state, which decides the set of screens
  theme/           The global styles: the website's colours, type, spacing and shadow
  types/           Type declarations for imported assets
  utils/           Dates, formatting, validation, status labels, HTML to text, and links
                   to the website
```

Screens and components take every colour, font, size and shadow from `src/theme`. The
session token is kept in the iOS Keychain and in Keystore-encrypted storage on Android.

Tests sit next to the code they test, as `*.test.ts`.
