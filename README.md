[![npm](https://img.shields.io/npm/v/react-native-versioning.svg?style=flat-square)](https://www.npmjs.com/package/react-native-versioning)
[![npm](https://img.shields.io/npm/dm/react-native-versioning.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/react-native-versioning)

# React Native Versioning

It helps to set the react-native versions easily.

## Usage
```shell
Usage:
    npx react-native-versioning \
    -t --target <versionCode> \
    -b --build <buildNumber> \
    --android-only \
    --ios-only
```

## Example
```shell
npx react-native-versioning --target=2.1.1
npx react-native-versioning --build=17
npx react-native-versioning --build=18 --ios-only
npx react-native-versioning --target=2.3 --build=16 --android-only
```