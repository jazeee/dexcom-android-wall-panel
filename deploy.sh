#!/bin/bash

cd android
./gradlew assembleRelease
/opt/android-sdk/build-tools/28.0.3/apksigner sign --ks ~/.gradle/jazcomkeystore --out app/build/outputs/apk/release/app-release.apk app/build/outputs/apk/release/app-release-unsigned.apk

adb install -rf app/build/outputs/apk/release/app-release.apk
