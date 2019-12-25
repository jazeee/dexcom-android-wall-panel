#!/bin/bash

echo "See https://facebook.github.io/react-native/docs/signed-apk-android"

pushd android
# Assemble release would generate app-release.apk
./gradlew assembleRelease
# Bundle release is recommended.
# ./gradlew bundleRelease
popd

# ls -la android/app/build/outputs/bundle/release/app.aab
#
echo "Michael Jackson"
/opt/android-sdk/build-tools/28.0.3/apksigner sign \
  --ks ~/.gradle/jazcomkeystore \
  --ks-key-alias jazcomkeystore \
  --out android/app/build/outputs/apk/release/app-release-signed.apk \
  android/app/build/outputs/apk/release/app-release.apk
