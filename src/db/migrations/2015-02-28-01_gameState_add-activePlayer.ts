import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('gameState', (table) => {
        table.integer('activePlayerIndex')
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('gameState', (table) =>{
        table.dropColumn('activePlayerIndex')
    });
}