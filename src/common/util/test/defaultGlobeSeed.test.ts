import { defaultGlobeSeed } from "./defaultGlobeSeed";
import { Globe } from "../../types/types" 
import { describe, test, expect } from '@jest/globals';


// Duplicate this test block when adding a new map to seed.
// The test will ensure that countries are reciprocally connected. However, you must ensure the right connections exist.
// Re-enable comments to provide an output to verify while looking at a map.
// Once verified, disable comments to minimize test output.
describe('defaultGlobeSeed Seed Validation', () => {
    let globe: Globe = defaultGlobeSeed();
    test('Reciprocity check between connected Countries has 0 mismatches', () => {
        let mismatch: number = 0;
        for (let i=0; i<globe.countries.length; i++) {
            // console.log(`for i= ${i} checking ${globe.countries[i].name} with connected to ${globe.countries[i].connectedTo}`);
            for (let j=0; j<globe.countries[i].connectedTo.length; j++) {
                const connectedCountryID = globe.countries[i].connectedTo[j];
                // console.log(`connected to: ${globe.countries[connectedCountryID].name} with ID ${connectedCountryID}`);
                if (!globe.countries[connectedCountryID].connectedTo.includes(i)){
                    console.log(`mismatch between ${globe.countries[connectedCountryID].name} and ${globe.countries[i].name}`);
                    mismatch += 1;
                }
            }
        }
        expect(mismatch).toBe(0);
    })
})