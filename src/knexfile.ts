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
        debug: false,
        client: 'sqlite3',
        connection: {
        filename:  ':memory:'
        },
        pool: {
            min: 2,
            max: 10,
        },
        useNullAsDefault: true,
        migrations: {
            tableName: 'knex_migrations',
            directory: './src/db/migrations',
        },
        seeds: {
            directory: './src/db/seeds',
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