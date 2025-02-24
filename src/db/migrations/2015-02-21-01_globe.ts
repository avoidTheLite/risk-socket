import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('globe', (table) => {
        table.string('id').primary();
        table.string('name');
        table.integer('playerMax');
        table.jsonb('countries');
        table.jsonb('continents');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('globe');
}