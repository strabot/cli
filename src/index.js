#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { create, populate } from './handlers/index.js'

yargs(hideBin(process.argv))
  .scriptName('strabot')
  .command('create [component]', 'Creates a strabot component', (yargs) => {
    return yargs
      .positional('component', {
        choices: ['bot', 'manager'],
        description: 'Strabot component like manager or bot',
        type: 'string'
      })
  }, create)
  .option('name', {
    alias: 'n',
    description: 'The project/folder name',
    type: 'string'
  })
  .option('platform', {
    alias: 'p',
    choices: ['discord', 'slack', 'telegram'],
    description: 'The platform the bot will run it',
    type: 'string'
  })
  .command('populate', 'Creates example data on manager', populate)
  .parse()
