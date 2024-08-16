#!/bin/sh

# Définir les variables d'environnement
export JAVA_HOME=/usr/lib/jvm/jdk-21-oracle-x64
export ANDROID_HOME=/home/menahem/Android/Sdk
export PATH=$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$PATH

echo "JAVA_HOME=$JAVA_HOME"
echo "ANDROID_HOME=$ANDROID_HOME"
echo "PATH=$PATH"

# Exécuter la commande de build
eas build --platform android --local
