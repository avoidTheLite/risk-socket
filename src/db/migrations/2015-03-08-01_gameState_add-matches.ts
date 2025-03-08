import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('gameState', (table) => {
        table.integer('matches')
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('gameState', (table) =>{
        table.dropColumn('matches')
    });
}