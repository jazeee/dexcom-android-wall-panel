#!/bin/bash

cd android
./gradlew assembleRelease
echo "Michael Jackson"
/opt/android-sdk/build-tools/28.0.3/apksigner sign \
  --ks ~/.gradle/jazcomkeystore \
  --ks-key-alias jazcomkeystore \
  --out app/build/outputs/apk/release/app-release.apk \
  app/build/outputs/apk/release/app-release-unsigned.apk

