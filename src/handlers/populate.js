import { join } from 'path';

import dotenv from 'dotenv';
import knex from 'knex';
import ora from 'ora';

export async function populate() {
  const loading = ora('Populating database').start();

  try {
    dotenv.config({ path: join(process.cwd(), '.env') });

    const database = knex({
      client: 'sqlite3',
      connection: {
        filename: join(process.cwd(), '.tmp', 'data.db'),
      },
      useNullAsDefault: true,
    });

    const [messageId] = await database('messages').insert({
      label: 'Welcome',
      text: "Hey! It's so nice to meet you  and I'm glad you're here!\nPresent yourself so I can know more about you :D ",
      created_at: Date.now(),
      updated_at: Date.now(),
      published_at: Date.now(),
    });

    const [greetingId] = await database('greetings').insert({
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    await database('greetings_messages_links').insert({
      greeting_id: greetingId,
      message_id: messageId,
    });

    await database.destroy();

    loading.succeed();
  } catch (error) {
    loading.fail();
    console.error(error);

    process.exit(1);
  }
}
