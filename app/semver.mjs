import fs from "fs";
import inquirer from "inquirer";
import semver from "semver";

const packageJsonPath = "./package.json";
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

const appName = packageJson.name;
const xcodeProjectPath = `./ios/${appName}.xcodeproj/project.pbxproj`;
const androidGradlePath = "./android/app/build.gradle";

const getCurrentIOSVersionAndBuild = () => {
    const xcodeProjectContent = fs.readFileSync(xcodeProjectPath, "utf-8");
    const marketingVersionMatch = xcodeProjectContent.match(
        /MARKETING_VERSION = (\d+\.\d+\.\d+);/,
    );
    const currentProjectVersionMatch = xcodeProjectContent.match(
        /CURRENT_PROJECT_VERSION = (\d+);/,
    );

    return {
        version: marketingVersionMatch ? marketingVersionMatch[1] : "Not found",
        buildNumber: currentProjectVersionMatch
            ? currentProjectVersionMatch[1]
            : "Not found",
    };
};

const getCurrentAndroidVersionAndBuild = () => {
    const gradleFileContent = fs.readFileSync(androidGradlePath, "utf-8");
    const versionNameMatch = gradleFileContent.match(
        /versionName "(\d+\.\d+\.\d+)"/,
    );
    const versionCodeMatch = gradleFileContent.match(/versionCode (\d+)/);

    return {
        version: versionNameMatch ? versionNameMatch[1] : "Not found",
        buildNumber: versionCodeMatch ? versionCodeMatch[1] : "Not found",
    };
};

const updateXcodeProjectFile = (newVersion, newIOSBuildNumber) => {
    let xcodeProjectContent = fs.readFileSync(xcodeProjectPath, "utf-8");
    xcodeProjectContent = xcodeProjectContent.replace(
        /MARKETING_VERSION = \d+\.\d+\.\d+;/g,
        `MARKETING_VERSION = ${newVersion};`,
    );
    xcodeProjectContent = xcodeProjectContent.replace(
        /CURRENT_PROJECT_VERSION = \d+;/g,
        `CURRENT_PROJECT_VERSION = ${newIOSBuildNumber};`,
    );

    fs.writeFileSync(xcodeProjectPath, xcodeProjectContent, "utf-8");
    console.log("Updated version in Xcode project file.");
};

const updateAndroidGradleFile = (newVersion, newAndroidBuildNumber) => {
    let gradleFileContent = fs.readFileSync(androidGradlePath, "utf-8");
    gradleFileContent = gradleFileContent.replace(
        /versionCode \d+/,
        `versionCode ${newAndroidBuildNumber}`,
    );
    gradleFileContent = gradleFileContent.replace(
        /versionName ".*?"/,
        `versionName "${newVersion}"`,
    );

    fs.writeFileSync(androidGradlePath, gradleFileContent, "utf-8");
    console.log("Updated version in Android build.gradle file.");
};

const updatePackageJson = version => {
    packageJson.version = version;
    fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        "utf-8",
    );
    console.log("Updated version in package.json.");
};

const main = async () => {
    const iosInfo = getCurrentIOSVersionAndBuild();
    const androidInfo = getCurrentAndroidVersionAndBuild();

    console.log(
        `Current iOS version is: ${iosInfo.version}, build number: ${iosInfo.buildNumber}`,
    );
    console.log(
        `Current Android version is: ${androidInfo.version}, build number: ${androidInfo.buildNumber}`,
    );

    const { newVersion, newIOSBuildNumber, newAndroidBuildNumber } =
        await inquirer.prompt([
            {
                type: "input",
                name: "newVersion",
                message: "Enter the new version:",
                validate: input =>
                    semver.valid(input)
                        ? true
                        : "Please enter a valid semantic version (e.g., 1.2.3).",
                default: packageJson.version,
            },
            {
                type: "input",
                name: "newIOSBuildNumber",
                message: "Enter the new iOS build number:",
                validate: input =>
                    !isNaN(input) ? true : "Please enter a valid number.",
                default: iosInfo.buildNumber,
            },
            {
                type: "input",
                name: "newAndroidBuildNumber",
                message: "Enter the new Android build number:",
                validate: input =>
                    !isNaN(input) ? true : "Please enter a valid number.",
                default: androidInfo.buildNumber,
            },
        ]);

    const { confirmUpdate } = await inquirer.prompt([
        {
            type: "confirm",
            name: "confirmUpdate",
            message: `Are you sure you want to update to version ${newVersion}, iOS build ${newIOSBuildNumber}, and Android build ${newAndroidBuildNumber}?`,
        },
    ]);

    if (!confirmUpdate) {
        console.log("Update canceled.");
        return;
    }

    // Apply updates
    updatePackageJson(newVersion);
    updateXcodeProjectFile(newVersion, newIOSBuildNumber);
    updateAndroidGradleFile(newVersion, newAndroidBuildNumber);

    console.log("All updates applied successfully.");
};

main();
