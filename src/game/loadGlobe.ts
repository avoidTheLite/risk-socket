import db from '../db/db';
import { GlobeRecord, Globe } from '../common/types/types';
import { globeNotFoundError } from '../common/types/errors';

export default async function loadGlobe(globeID: string): Promise<Globe> {
    try {
        return db.select(
            "globe.id",
            "globe.name",
            "globe.playerMax",
            "globe.countries",
            "globe.continents")
        .from("globe")
        .where("globe.id", globeID)
        .then((globeRecord: GlobeRecord[]) => {
            if (!globeRecord) {
                throw new globeNotFoundError({
                    message: `Globe with ID ${globeID} not found`
                })
            }
            else {
                const globe: Globe = {
                    id: globeRecord[0].id,
                    name: globeRecord[0].name,
                    playerMax: globeRecord[0].playerMax,
                    countries: globeRecord[0].countries = typeof globeRecord[0].countries === 'string' ? JSON.parse(globeRecord[0].countries) : globeRecord[0].countries,
                    continents: globeRecord[0].continents = typeof globeRecord[0].continents === 'string' ? JSON.parse(globeRecord[0].continents) : globeRecord[0].continents,
                }
                return globe;
            }
        })
    }
    catch (error) {

        throw error
    }

}