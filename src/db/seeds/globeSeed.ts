import { Knex } from "knex";
import { defaultGlobeSeed } from "../../common/util/test/defaultGlobeSeed";

export async function seed(knex: Knex): Promise<void> {
    await knex('globe').del();

    const globeSeed = defaultGlobeSeed();
    const globe = {
        id: globeSeed.id,
        name: globeSeed.name,
        playerMax: globeSeed.playerMax,
        countries: JSON.stringify(globeSeed.countries),
        continents: JSON.stringify(globeSeed.continents),
    }

    await knex('globe').insert(globe);


}