import arg from 'arg';
import {createProject} from './main';

function parseArgumentsIntoOptions(rawArgs) {
 const args = arg(
    {
        '--git': Boolean,
        '--yes': Boolean,
        '-g': '--git',
        '-y': '--yes',
      },
      {
        argv: rawArgs.slice(2),
      }
 );

 return {
   project_name: args._[0],
 };
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    if (!options.project_name) return console.error("not found project name, plz try \"create-statenext-app <project_name>\"")
    await createProject(options);
}