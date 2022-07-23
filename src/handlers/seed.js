import knex from 'knex'
import ora from 'ora'
import dotenv from 'dotenv'
import { join } from 'path'

export async function seed() {
    dotenv.config({ path: join(process.cwd(), '.env') })

    const database = knex({
        client: 'sqlite3',
        connection: {
            filename: join(process.cwd(), '.tmp', 'data.db')
        },
        useNullAsDefault: true
    })

    await database('messages').insert({
        label: 'Welcome',
        text: `Hey! It's so nice to meet you  and I'm glad you're here!
        Present yourself so I can know more about you :D `,
        created_at: Date.now(),
        updated_at: Date.now(),
        published_at: Date.now(),
    })

    await database.destroy()
}
