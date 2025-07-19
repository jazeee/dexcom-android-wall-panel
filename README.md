# JazCom on Droid

Uses React Native to show data.

## App Stores

[Google Play Store](https://play.google.com/store/apps/details?id=com.jazeee)

[Amazon App Store](https://www.amazon.com/Jaz-Singh-JazCom-Data-Viewer/dp/B07ZXPBPD4/ref=sr_1_fkmr0_1)

[APK](https://github.com/jazeee/dexcom-android-wall-panel/releases/download/v2.1.6/app-release.apk)

Example:

![Alt text](app-screen.png?raw=true "Screenshot")

# Metro + React Native Notes - Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## To Initialize

Install `react-native`, Android Development tools, and recommended tooling for non-Expo development.

* Run `npm install`

## Step 1: Start Metro (dev live reload service)

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
npm start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
npm run android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
npm run ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio

## Development Issues

### `:app:installDebug FAILED`

* This [link](https://stackoverflow.com/questions/37500205/react-native-appinstalldebug-failed/54955869#54955869) suggests doing some cleaning
  * `pushd android`
  * `./gradlew clean`
  * `popd`
  * Possibly also clean/reinstall packages.
* In my case, it looks like the virtual Android device was simply hung. Force reboot or reset.

### Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## To trigger debug menu

1. Either shake device or
2. `adb shell input keyevent 82`

## Generate images from largest using `res/gen-images.sh`

## Curl notes

```
curl   -H "Accept: application/json" -H "Content-Type: application/json"   -H "User-Agent: Dexcom Share/3.0.2.11 CFNetwork/711.2.23 Darwin/14.0.0"   -X POST https://share1.dexcom.com/ShareWebServices/Services/General/LoginPublisherAccountByName   -d '{"applicationId":"d8665ade-9673-4e27-9ff6-92db4ce13d13","accountName": "jazeee", "password": ""}'

curl   -H "Content-Length: 0" -H "Accept: application/json"   -H "User-Agent: Dexcom Share/3.0.2.11 CFNetwork/672.0.2 Darwin/14.0.0"   -X POST 'https://share1.dexcom.com/ShareWebServices/Services/Publisher/ReadPublisherLatestGlucoseValues?sessionId=abc123-342&minutes=1440&maxCount=1'
```

Output like:

```
[{
  "DT":"\/Date(1558231462000-0700)\/",
  "ST":"\/Date(1558231462000)\/",
  "Trend":"Flat",
  "Value":177,
  "WT":"\/Date(1558231462000)\/"
},{
  "DT":"\/Date(1558231162000-0700)\/",
  "ST":"\/Date(1558231162000)\/",
  "Trend":"Flat",
  "Value":169,
  "WT":"\/Date(1558231162000)\/"
}...
DT is device, ST is server. Trends used to be numbers, like 4 is flat, 3 is up, 2 is very up, 5 is down, 6 is very down. Now are strings.
```

## Build Notes

Now: `npx react-native build-android --mode=release`

* Takes 5 minutes to build due to Expo
* `./android/app/build/outputs/bundle/release/app-release.aab`

Truly speaking you only need to run `./build.sh`
Once built, you can upload the output file to Google Play Store:
`android/app/build/outputs/bundle/release/`

You'll then need to do their release process.

### Other Install notes (Obsolete)

Will need a keystore to sign the app. (Must use new file if you forgot the pwd LoL)

`keytool -genkey -v -keystore ~/.gradle/jazcomkeystore -alias jazcomkeystore -keyalg RSA -keysize 2048 -validity 90000`

See `~/.gradle/gradle.properties` for default

```
cd android
./gradlew assembleRelease
ls -la app/build/outputs/apk/release/app-release-unsigned.apk
# Note - you will need to choose your own keystore, and key-alias.
/opt/android-sdk/build-tools/28.0.3/apksigner sign --ks ~/.gradle/jazcomkeystore --ks-key-alias jazcomkeystore --out app/build/outputs/apk/release/app-release.apk app/build/outputs/apk/release/app-release-unsigned.apk

adb install -f app/build/outputs/apk/release/app-release.apk
```

```
 2099  cp ../cgm/apktool/new/release-key-dexcom.jks android/app/
 2100  vi android/gradle.properties
 2101  mv android/app/release-key-dexcom.jks ~/.gradle/
 2102  vi ~/.gradle/gradle.properties
 2103  rm ~/.gradle/release-key-dexcom.jks
 2104  vi ~/.gradle/gradle.properties
 2105  keytool -genkey -v -keystore ~/.gradle/jazcomkeystore -alias jazcomkeystore -keyalg RSA -keysize 2048 -validity 90000
 2107  cd android/
 2108  ./gradlew assembleRelease
 2113  ls -la build
 2114  ls -la build/intermediates/
 2115  find ./ -name *.apk
 2116  ls -la app/build/outputs/apk/release/app-release-unsigned.apk
 2117  cat ../cgm/apktool/build-and-deploy.sh
 2118  cat ../../cgm/apktool/build-and-deploy.sh
 2119  /opt/android-sdk/build-tools/28.0.3/apksigner sign --ks ~/.gradle/jazcomkeystore --out app/build/outputs/apk/release/app-release.apk app/build/outputs/apk/release/app-release-unsigned.apk
 2120  adb install -r app/build/outputs/apk/release/app-release.apk
 2121  /opt/android-sdk/build-tools/23.0.2/
 2122  /opt/android-sdk/build-tools/23.0.2/apksigner sign --ks ~/.gradle/jazcomkeystore --out app/build/outputs/apk/release/app-release.apk app/build/outputs/apk/release/app-release-unsigned.apk
 2123  /opt/android-sdk/build-tools/28.0.3/zipalign -v -p 4 app/build/outputs/apk/release/app-release-unsigned.apk app/build/outputs/apk/release/app-release-unsigned-aligned.apk
 2124  /opt/android-sdk/build-tools/28.0.3/apksigner sign --ks ../../cgm/apktool/new/release-key-dexcom.jks --out app/build/outputs/apk/release/app-release.apk app/build/outputs/apk/release/app-release-unsigned-aligned.apk


 2126  adb install -rf app/build/outputs/apk/release/app-release.apk
```
