#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import { exec } from "child_process";
import figlet from "figlet";
import inquirer from "inquirer";
import { promisify } from "util";

const execAsync = promisify(exec);
const checkForPnPm = () => {
  let exists = false;
  const commandToCheck = "pnpm -v";

  exec(commandToCheck, (error, stdout, stderr) => {
    if (error) {
      exists = false;
    } else {
      console.log("pnpm is installed. Version:", stdout);
      exists = true;
    }
  });
  return exists;
};
let inkathonName = "";
inquirer
  .prompt([
    {
      type: "input",
      name: "name",
      message:
        "What is the name of the inkathon? We will use this to create a folder for your inkathon.",
    },
  ])
  .then(async (answers) => {
    inkathonName = answers.name;
    console.log(checkForPnPm());
  });
