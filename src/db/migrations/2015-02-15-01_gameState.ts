import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('gameState', (table) => {
        table.string('saveName').primary();
        table.string('id');
        table.string('name');
        table.string('globeID');
        table.integer('turn');
        table.string('phase');
        table.jsonb('players');
        table.jsonb('countries');
        table.jsonb('continents');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('gameState');
}