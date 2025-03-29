import { defaultGlobeSeed } from "./defaultGlobeSeed";
import { Globe } from "../../types/types" 
let globe: Globe = defaultGlobeSeed();

for (let i=0; i<globe.countries.length; i++) {
    for (let j=0; j<globe.countries[i].connectedTo.length; i++) {
        const countryID = globe.countries[i].connectedTo[j]
        if (!globe.countries[countryID].connectedTo.includes[i]){
            console.log(`mismatch between ${globe.countries[countryID].name} and ${globe.countries[i].name}`)
        }
    }
}