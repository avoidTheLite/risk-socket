import type { Knex } from "knex";

import { default as cfg } from './config'

const defaultconnection = {
    database: cfg.get('dbName'),
    user: cfg.get('dbUsername'),
    password: cfg.get('dbPassword'),
    host: cfg.get('dbHost'),
    port: cfg.get('dbPort'),
}

const knexConfig: { [key: string]: Knex.Config } = {
    local: {
        debug: true,
        client: 'pg',
        connection: defaultconnection,
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './db/migrations',
        },
        seeds: {
            directory: './db/seeds',
        }
    },
    development: {
        debug: true,
        client: 'pg',
        connection: defaultconnection,
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './db/migrations',
        },
        seeds: {
            directory: './db/seeds',
        }
    },
    test: {
        debug: true,
        client: 'sqlite3',
        connection: defaultconnection,
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './db/migrations',
        },
        seeds: {
            directory: './db/seeds',
        }
    },
    production: {
        debug: false,
        client: 'pg',
        connection: defaultconnection,
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './db/migrations',
        },
        seeds: {
            directory: './db/seeds',
        }
    },
}

export default knexConfig;