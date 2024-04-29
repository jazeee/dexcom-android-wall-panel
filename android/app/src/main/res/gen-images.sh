#!/bin/bash

convert mipmap-xxxhdpi/ic_launcher.png -resize 144x144 mipmap-xxhdpi/ic_launcher.png
convert mipmap-xxxhdpi/ic_launcher.png -resize 96x96 mipmap-xhdpi/ic_launcher.png
convert mipmap-xxxhdpi/ic_launcher.png -resize 72x72 mipmap-hdpi/ic_launcher.png
convert mipmap-xxxhdpi/ic_launcher.png -resize 48x48 mipmap-mdpi/ic_launcher.png

convert mipmap-xxxhdpi/ic_launcher_round.png -resize 144x144 mipmap-xxhdpi/ic_launcher_round.png
convert mipmap-xxxhdpi/ic_launcher_round.png -resize 96x96 mipmap-xhdpi/ic_launcher_round.png
convert mipmap-xxxhdpi/ic_launcher_round.png -resize 72x72 mipmap-hdpi/ic_launcher_round.png
convert mipmap-xxxhdpi/ic_launcher_round.png -resize 48x48 mipmap-mdpi/ic_launcher_round.png
