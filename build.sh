#!/bin/bash

pushd android 
./gradlew assembleRelease
popd

echo "Michael Jackson"
/opt/android-sdk/build-tools/28.0.3/apksigner sign \
  --ks ~/.gradle/jazcomkeystore \
  --ks-key-alias jazcomkeystore \
  --out android/app/build/outputs/apk/release/app-release-signed.apk \
  android/app/build/outputs/apk/release/app-release.apk
