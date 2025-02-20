import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('gameState', (table) => {
        table.string('saveName').primary();
        table.string('id').notNullable();
        table.string('name');
        table.string('globeID').notNullable();
        table.integer('turn').notNullable().defaultTo(0);
        table.string('phase').notNullable().defaultTo('deploy');
        table.jsonb('players').notNullable().defaultTo('{}');
        table.jsonb('countries').notNullable().defaultTo('{}');
        table.jsonb('continents').notNullable().defaultTo('{}');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('gameState');
}