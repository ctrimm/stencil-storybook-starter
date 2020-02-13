#!/usr/bin/env node

const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");

const init = () => {
  console.log(
    chalk.green(
      figlet.textSync("Stenciljs + Storybook", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default"
      })
    )
  );
};

const askQuestions = () => {
  const questions = [
    {
      name: "FILENAME",
      type: "input",
      message: "DO NOT use `stencil-XXXX` for a component name!\n\nWhat is the name of the component without extension? "
    }
  ];
  return inquirer.prompt(questions);
};

const createDirectory = (filename) => {
  shell.mkdir('-p', `src/components/${filename}`)
  return null;
};

const createFiles = (filename) => {
  const tsxFilePath = `${process.cwd()}/src/components/${filename}/${filename}.tsx`
  const e2eFilePath = `${process.cwd()}/src/components/${filename}/${filename}.e2e.ts`
  const sassFilePath = `${process.cwd()}/src/components/${filename}/${filename}.sass`
  shell.touch(tsxFilePath);
  shell.touch(e2eFilePath);
  shell.touch(sassFilePath);
  return null;
};

const writeToFiles = (filename) => {
  const tsxFilePath = `${process.cwd()}/src/components/${filename}/${filename}.tsx`
  const e2eFilePath = `${process.cwd()}/src/components/${filename}/${filename}.e2e.ts`
  shell.echo(`import { Component, Prop, h } from \'@stencil\/core\';\r\n\r\n@Component({\r\n  tag: \'${filename}\',\r\n  styleUrl: \'${filename}.css\',\r\n  shadow: true\r\n})\r\nexport class MyComponent {\r\n  \/**\r\n   * The first name\r\n   *\/\r\n  \/\/ @Prop() first: string;\r\n\r\n  render() {\r\n    return <div><\/div>;\r\n  }\r\n}\r\n`).to(tsxFilePath);
  shell.echo(`import { newE2EPage } from \'@stencil\/core\/testing\';\r\n\r\ndescribe(\'${filename}\', () => {\r\n  it(\'renders\', async () => {\r\n    const page = await newE2EPage();\r\n\r\n    await page.setContent(\'<${filename}><\/${filename}>\');\r\n    const element = await page.find(\'${filename}\');\r\n    expect(element).toHaveClass(\'hydrated\');\r\n  });\r\n});\r\n`).to(e2eFilePath);
  return null;
};

const success = filename => {
  console.log(
    chalk.white.bgGreen.bold(`Done! ${filename} component created at ${process.cwd()}/${filename}`)
  );
};

const run = async () => {
  // show script introduction
  init();

  // ask questions
  const answers = await askQuestions();
  const { FILENAME } = answers;

  // create the directory
  createDirectory(FILENAME);

  // create the files
  createFiles(FILENAME);
  
  // writes to the files
  writeToFiles(FILENAME);

  // show success message
  success(FILENAME);
};

run();
