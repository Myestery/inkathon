#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import { exec } from "child_process";
import figlet from "figlet";
import inquirer from "inquirer";
import { promisify } from "util";

// const execAsync = promisify(exec);

const checkForPnPm = async () => {
  const commandToCheck = "pnpm -v";

  return new Promise((resolve) => {
    exec(commandToCheck, (error, stdout, stderr) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

const askAndInstallPnPm = async () => {
  const answers = await inquirer.prompt([
    {
      type: "confirm",
      name: "install",
      message:
        "Pnpn is required to install inkathon. Do you want to install pnpm?",
    },
  ]);

  if (answers.install) {
    console.log(chalk.blue("Installing pnpm..."));
    const commandToInstall = "npm install -g pnpm";
    return new Promise((resolve) => {
      exec(commandToInstall, (error, stdout, stderr) => {
        if (error) {
          console.error(chalk.red("Error installing pnpm."), error);
          resolve(false);
        } else {
          console.log(chalk.green("pnpm installed."));
          resolve(true);
        }
      });
    });
  } else {
    // console.log(chalk.red("pnpm not installed."));
  }
};

const createInkathon = async (name) => {
  // clone repo
  console.log(chalk.blue("Creating inkathon " + name + "..."));
  const commandToCreate = `git clone https://github.com/scio-labs/inkathon.git ${inkathonName}`;
  return new Promise((resolve) => {
    exec(commandToCreate, (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red("Error creating inkathon."), error);
        resolve(false);
      } else {
        console.log(chalk.green("inkathon created."));
        resolve(true);
      }
    });
  });
};

const fixFrontendEnv = async () => {
  const commandToFix = `cd ${inkathonName}/frontend && cp .env.local.example .env`;
  // uncomment the following line to fix the frontend env

  return new Promise((resolve) => {
    exec(commandToFix, (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red("Error fixing frontend env."), error);
        resolve(false);
      } else {
        console.log(chalk.green("frontend env fixed."));
        resolve(true);
      }
    });
  });
}

const askForInstallDependencies = async () => {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "install",
      message: "Install dependencies?",
      choices: [
        {
          name: "PnPm",
          checked: true,
        },
        {
          name: "Yarn",
          checked: false,
        },
        {
          name: "Npm",
          checked: false,
        },
        {
          name: "No",
          checked: false,
        },
      ],
      default: "PnPm",
    },
  ]);

  if (answers.install) {
    // switch and install
    switch (answers.install) {
      case "PnPm":
        await installDependencies("pnpm");
        break;
      case "Yarn":
        await installDependencies("yarn");
        break;
      case "Npm":
        await installDependencies("npm");
        break;
      default:
        break;
    }
  }
};

const installDependencies = async (provider) => {
  console.log(chalk.blue("Installing dependencies..."));
  const commandToInstall = `cd ${inkathonName} && ${provider} install`;
  return new Promise((resolve) => {
    exec(commandToInstall, (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red("Error installing dependencies."), error);
        resolve(false);
      } else {
        console.log(chalk.green("Dependencies installed."));
        resolve(true);
      }
    });
  });
};

let inkathonName = "";
(async () => {
  // check if the name is already set
  if (process.argv.length > 2) {
    inkathonName = process.argv[2];
  } else {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "What's the inkathon name for the folder?",
        default: "inkathon" + Math.floor(Math.random() * 1000),
      },
    ]);

    inkathonName = answers.name;
  }

  const pnpnExists = await checkForPnPm();
  if (!pnpnExists) {
    await askAndInstallPnPm();
  }

  await createInkathon(inkathonName);
  await fixFrontendEnv();
  await askForInstallDependencies();

  // display figlet
  console.log(
    chalk.yellow(figlet.textSync("Ink!", { horizontalLayout: "full" })),
    chalk.yellow(figlet.textSync("ready", { horizontalLayout: "full" }))
  );

  // closing remarks
  console.log(
    chalk.blue(
      "Now that you have your inkathon, you can start it by running the following commands:"
    )
  );
  console.log(chalk.green("cd " + inkathonName));
  console.log(chalk.green("pnpm run dev"));

  // do you need help?
  console.log(
    chalk.blue(
      "If you need help installing rust, please visit the substrate documentation at"
    ),
    chalk.green("https://docs.substrate.io/install")
  );
})();
