#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var yargs = require("yargs");
var options = yargs
    .usage("Usage:\n    npx react-native-versioning \\\n    -t --target <versionCode> \\\n    -b --build <buildNumber> \\\n    --android-only \\\n    --ios-only\n")
    .options({
    target: {
        alias: 't',
        string: true,
        desc: 'target version to Upgrade',
    },
    build: {
        alias: 'b',
        number: true,
        desc: 'target build number to Upgrade',
    },
    androidOnly: {
        alias: 'android-only',
        boolean: true,
        desc: 'versioning only android',
    },
    iosOnly: {
        alias: 'ios-only',
        boolean: true,
        desc: 'versioning only iOS',
    },
}).argv;
function validateArguments(targetVersion, targetBuildNumber) {
    return (typeof targetVersion === 'undefined' &&
        typeof targetBuildNumber === 'undefined');
}
function updateIOS(targetVersion, targetBuildNumber) {
    if (validateArguments(targetVersion, targetBuildNumber))
        return;
    var files = fs.readdirSync('ios');
    var xcodeprojName = files.find(function (file) {
        return file.endsWith('xcodeproj');
    });
    if (xcodeprojName) {
        var pbxprojPath = "ios/" + xcodeprojName + "/project.pbxproj";
        if (fs.existsSync(pbxprojPath)) {
            var replaced = fs.readFileSync(pbxprojPath, 'utf8');
            if (replaced) {
                if (typeof targetVersion !== 'undefined') {
                    if (replaced.indexOf('MARKETING_VERSION') === -1) {
                        replaced = replaced.replace(/(LD_RUNPATH_SEARCH_PATHS = [^;]+;([\n\s]+))/g, '$1MARKETING_VERSION = 1.0.0;$2');
                        var projectName = xcodeprojName.replace('.xcodeproj', '');
                        var plistPath = "ios/" + projectName + "/Info.plist";
                        if (fs.existsSync(plistPath)) {
                            var plist = fs.readFileSync(plistPath, 'utf8');
                            plist = plist.replace(/(<key>CFBundleShortVersionString<\/key>[\n\s]+<string>)[^<]+(<\/string>)/, '$1$(MARKETING_VERSION)$2');
                            fs.writeFileSync(plistPath, plist);
                        }
                    }
                    replaced = replaced.replace(/MARKETING_VERSION = [^;]+;/g, "MARKETING_VERSION = " + targetVersion + ";");
                }
                if (typeof targetBuildNumber !== 'undefined') {
                    replaced = replaced.replace(/CURRENT_PROJECT_VERSION = [^;]+;/g, "CURRENT_PROJECT_VERSION = " + targetBuildNumber + ";");
                }
            }
            fs.writeFileSync(pbxprojPath, replaced);
        }
    }
}
function updateAndroid(targetVersion, targetBuildNumber) {
    //         versionCode 1
    //         versionName "1.0"
    if (validateArguments(targetVersion, targetBuildNumber))
        return;
    var buildGradlePath = 'android/app/build.gradle';
    if (fs.existsSync(buildGradlePath)) {
        var replaced = fs.readFileSync(buildGradlePath, 'utf8');
        if (replaced) {
            if (typeof targetVersion !== 'undefined') {
                replaced = replaced.replace(/versionName\s+\S+/g, "versionName \"" + targetVersion + "\"");
            }
            if (typeof targetBuildNumber !== 'undefined') {
                replaced = replaced.replace(/versionCode\s+\d+/g, "versionCode " + targetBuildNumber);
            }
        }
        fs.writeFileSync(buildGradlePath, replaced);
    }
}
if (options.iosOnly !== false) {
    updateIOS(options.target, options.build);
}
if (options.androidOnly !== false) {
    updateAndroid(options.target, options.build);
}
console.log('Update Successful!');
