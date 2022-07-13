import inquirer from 'inquirer'
import { execSync } from 'child_process'
import { join } from 'path'

const repositories = {
  manager: 'https://github.com/gabrielrufino/strabot-manager.git',
  bots: {
    discord: 'https://github.com/gabrielrufino/strabot-discord.git',
    slack: 'https://github.com/gabrielrufino/strabot-slack.git',
    telegram: 'https://github.com/gabrielrufino/strabot-telegram.git'
  }
}

export async function create (argv) {
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

  const repository = repositories[component] || repositories.bots[platform]

  execSync(`git clone ${repository} ${name}`)
  execSync('npx rimraf .git', { cwd: join(process.cwd(), name) })
  execSync('npm ci', { cwd: join(process.cwd(), name) })
}
