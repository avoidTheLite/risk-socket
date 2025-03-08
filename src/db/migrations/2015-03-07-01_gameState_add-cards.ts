import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('gameState', (table) => {
        table.jsonb('cardsAvailable')
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('gameState', (table) =>{
        table.dropColumn('cardsAvailable')
    });
}