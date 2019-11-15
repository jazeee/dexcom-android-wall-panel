#!/bin/bash

./build.sh

adb install -f app/build/outputs/apk/release/app-release.apk
