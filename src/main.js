import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    console.log(options.targetDirectory);
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false,
    });
}

async function createDirectory(options) {
    let dir_path = `./${options.project_name}`
    if (!fs.existsSync(`./${options.project_name}`)) {
        fs.mkdirSync(dir_path)
        return
    }
    else {
        return Promise.reject(new Error('Failed to create directory, Directory is already found.'));
    }
}

async function initGit(options) {
    const result = await execa('git', ['init'], {
      cwd: options.targetDirectory,
    });
    if (result.failed) {
      return Promise.reject(new Error('Failed to initialize git'));
    }
    return;
}

async function rewriteProjectName(options) {
    try {
        let jsonPath = path.resolve(options.targetDirectory, "package.json")
        let jsonPackage = fs.readFileSync(jsonPath, "utf-8")

        jsonPackage = jsonPackage.replace("{project_name}", options.project_name)
        fs.writeFileSync(jsonPath, jsonPackage)
    } catch (error) {
        return Promise.reject(error);
    }
    return;
}

export async function createProject(options) {
    options = {
        ...options,
        targetDirectory: path.resolve(process.cwd(), options.project_name),
    };

    const currentFileUrl = import.meta.url;
    const templateDir = path.resolve(
        new URL(currentFileUrl).pathname,
        '../../templates',
    );
    options.templateDirectory = templateDir;

    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (err) {
        console.error('%s Invalid template name', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    const tasks = new Listr([
        {
            title: 'Create project directory',
            task: () => createDirectory(options),
        },
        {
            title: 'Copy project files',
            task: () => copyTemplateFiles(options),
        },
        {
            title: 'Set project name',
            task: () => rewriteProjectName(options),
        },
        {
            title: 'Initialize git',
            task: () => initGit(options),
        },
        {
            title: 'Install dependencies',
            task: () =>
                projectInstall({
                    cwd: options.targetDirectory,
                })
        },
      ]);
     
      await tasks.run();

    console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
}