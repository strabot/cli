import inquirer from 'inquirer'
import ora from 'ora'
import { join } from 'path'
import { spawn } from 'child_process'

import { exec } from '../helpers/index.js'

const repositories = {
  manager: 'https://github.com/gabrielrufino/strabot-manager.git',
  bots: {
    discord: 'https://github.com/gabrielrufino/strabot-discord.git',
    slack: 'https://github.com/gabrielrufino/strabot-slack.git',
    telegram: 'https://github.com/gabrielrufino/strabot-telegram.git'
  }
}

export async function create (argv) {
  try {
    const {
      component,
      name = (await inquirer.prompt({
        name: 'name',
        type: 'input'
      })).name,
      platform = component === 'bot'
        ? (await inquirer.prompt({
            name: 'platform',
            type: 'list',
            choices: [
              {
                name: 'Discord',
                value: 'discord'
              },
              {
                name: 'Slack',
                value: 'slack'
              },
              {
                name: 'Telegram',
                value: 'telegram'
              }
            ]
          })).platform
        : undefined
    } = argv

    const loading = ora('Creating project').start()
    const repository = repositories[component] || repositories.bots[platform]

    const folder = join(process.cwd(), name)
    await exec(`git clone ${repository} ${name}`)
    process.chdir(folder)
    await exec('npx rimraf .git')
    await exec('cp .env.example .env')
    await exec('npm ci')
    loading.succeed('Completed')

    spawn('npm', ['run', 'develop'])
      .stdout
      .pipe(process.stdout)

    await exec('npx wait-on http://localhost:1337')
    await exec('npx strabot populate')
  } catch (error) {
    console.error(error)
  }
}
