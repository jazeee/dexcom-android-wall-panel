## JazCom on Droid

Uses React Native to show data.

### App Stores

[Google Play Store](https://play.google.com/store/apps/details?id=com.jazeee)

[Amazon App Store](https://www.amazon.com/Jaz-Singh-JazCom-Data-Viewer/dp/B07ZXPBPD4/ref=sr_1_fkmr0_1)

Example:

![Alt text](app-screen.png?raw=true "Screenshot")

### To Initialize

Install `react-native`, Android Development tools, and recommended tooling for non-Expo development.

* Run `npm install`

### To run with livereload

You first have to start react-native dev listener, then
deploy the dev app to the device.

#### First start React Native dev live reload service

1. Start the live reload service (this will start listening on port 8081):
2. `npm start`

#### Next spawn and deploy the app to the device

1. If necessary, uninstall any version of this app. (Step 2 will fail otherwise)
2. Deploy the app to the device and let it connect to 8081.
3. `npm run android`

(Shake the device to get a debug menu, which allows reload)

### To trigger debug menu

1. Either shake device or
2. `adb shell input keyevent 82`

### Generate images from largest using `res/gen-images.sh`

### Curl notes

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

### Install notes

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
