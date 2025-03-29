import { Country, Continent, Globe } from "../../types/types";


function defaultGlobeSeed():Globe {
    return new Globe(
    'defaultGlobeID',
    'Earth',
    6,
    defaultCountrySeed(),
    defaultContinentSeed(),
    )
}
function defaultContinentSeed():Continent[] {
    return[
        {
            id: 0,
            name: 'North America',
            countries: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ],
            armies: 5
          },
          {
            id: 1,
            name: 'South America',
            countries: [ 9, 10, 11, 12 ],
            armies: 2
          },
          {
            id: 2,
            name: 'Europe',
            countries: [ 13, 14, 15, 16, 17, 18, 19 ],
            armies: 5
          },
          {
            id: 3,
            name: 'Africa',
            countries: [ 20, 21, 22, 23, 24, 25 ],
            armies: 3
          },
          {
            id: 4,
            name: 'Asia',
            countries: [ 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37 ],
            armies: 7
          },
          {
            id: 5,
            name: 'Australia',
            countries: [ 38, 39, 40, 41 ],
            armies: 2
          }

    ]
}
function defaultCountrySeed():Country[] {
    return[
        {
            id: 0,
            name: 'Alaska',
            continent: 'North America',
            connectedTo: [ 1, 5, 31 ],
          },
          {
            id: 1,
            name: 'Alberta',
            continent: 'North America',
            connectedTo: [ 0, 5, 6, 8 ]
          },
          {
            id: 2,
            name: 'Central America',
            continent: 'North America',
            connectedTo: [ 3, 5, 12 ]
          },
          {
            id: 3,
            name: 'Eastern United States',
            continent: 'North America',
            connectedTo: [ 2, 6, 7, 8 ]
          },
          {
            id: 4,
            name: 'Greenland',
            continent: 'North America',
            connectedTo: [ 5, 6, 7, 14 ]
          },
          {
            id: 5,
            name: 'Northwest Territory',
            continent: 'North America',
            connectedTo: [ 0, 1, 4, 6, 7 ]
          },
          {
            id: 6,
            name: 'Ontario',
            continent: 'North America',
            connectedTo: [ 1, 3, 4, 5, 7 ]
          },
          {
            id: 7,
            name: 'Quebec',
            continent: 'North America',
            connectedTo: [ 3, 4, 6 ]
          },
          {
            id: 8,
            name: 'Western United States',
            continent: 'North America',
            connectedTo: [ 1, 2, 3, 6 ]
          },
          {
            id: 9,
            name: 'Argentina',
            continent: 'South America',
            connectedTo: [ 10, 11 ]
          },
          {
            id: 10,
            name: 'Brazil',
            continent: 'South America',
            connectedTo: [ 9, 11, 12, 24 ]
          },
          {
            id: 11,
            name: 'Peru',
            continent: 'South America',
            connectedTo: [ 9, 10, 12 ]
          },
          {
            id: 12,
            name: 'Venezuela',
            continent: 'South America',
            connectedTo: [ 2, 10, 11 ]
          },
          {
            id: 13,
            name: 'Great Britain',
            continent: 'Europe',
            connectedTo: [ 14, 15, 16, 19 ]
          },
          {
            id: 14,
            name: 'Iceland',
            continent: 'Europe',
            connectedTo: [ 4, 13, 16 ]
          },
          {
            id: 15,
            name: 'Northern Europe',
            continent: 'Europe',
            connectedTo: [ 13, 16, 17, 18, 19 ]
          },
          {
            id: 16,
            name: 'Scandinavia',
            continent: 'Europe',
            connectedTo: [ 13, 14, 15, 18 ]
          },
          {
            id: 17,
            name: 'Southern Europe',
            continent: 'Europe',
            connectedTo: [ 15, 18, 19, 22, 24, 32 ]
          },
          {
            id: 18,
            name: 'Ukraine',
            continent: 'Europe',
            connectedTo: [ 15, 16, 17, 26, 32, 35 ]
          },
          {
            id: 19,
            name: 'Western Europe',
            continent: 'Europe',
            connectedTo: [ 13, 15, 17, 24 ]
          },
          {
            id: 20,
            name: 'Congo',
            continent: 'Africa',
            connectedTo: [ 21, 22, 24, 25 ]
          },
          {
            id: 21,
            name: 'East Africa',
            continent: 'Africa',
            connectedTo: [ 20, 22, 23, 24, 25 ]
          },
          {
            id: 22,
            name: 'Egypt',
            continent: 'Africa',
            connectedTo: [ 20, 21, 24 ]
          },
          {
            id: 23,
            name: 'Madagascar',
            continent: 'Africa',
            connectedTo: [ 21, 25 ]
          },
          {
            id: 24,
            name: 'North Africa',
            continent: 'Africa',
            connectedTo: [ 10, 17, 19, 20, 21, 22]
          },
          {
            id: 25,
            name: 'South Africa',
            continent: 'Africa',
            connectedTo: [ 20, 21, 23 ]
          },
          {
            id: 26,
            name: 'Afghanistan',
            continent: 'Asia',
            connectedTo: [ 18, 27, 28, 33, 35 ]
          },
          {
            id: 27,
            name: 'China',
            continent: 'Asia',
            connectedTo: [ 26, 28, 29, 31, 33, 34 ]
          },
          {
            id: 28,
            name: 'India',
            continent: 'Asia',
            connectedTo: [ 26, 27, 29, 30, 32, 34 ]
          },
          {
            id: 29,
            name: 'Irkutsk',
            continent: 'Asia',
            connectedTo: [ 27, 28, 30 ]
          },
          { 
            id: 30,
            name: 'Japan',
            continent: 'Asia',
            connectedTo: [ 28, 29 ]
          },
          {
            id: 31,
            name: 'Kamchatka',
            continent: 'Asia',
            connectedTo: [ 0, 27, 29, 32, 34, 35 ]
          },
          {
            id: 32,
            name: 'Middle East',
            continent: 'Asia',
            connectedTo: [ 26, 28, 31, 33, 35 ]
          },
          {
            id: 33,
            name: 'Mongolia',
            continent: 'Asia',
            connectedTo: [ 26, 27, 32, 34 ]
          },
          {
            id: 34,
            name: 'Siberia',
            continent: 'Asia',
            connectedTo: [ 27, 28, 31, 33, 35 ]
          },
          {
            id: 35,
            name: 'Ural',
            continent: 'Asia',
            connectedTo: [ 26, 31, 34 ]
          },
          {
            id: 36,
            name: 'Yakutsk',
            continent: 'Asia',
            connectedTo: [ 28, 30, 31 ]
          },
          {
            id: 37,
            name: 'Siam',
            continent: 'Asia',
            connectedTo: [ 27, 28, 41 ]
          },
          {
            id: 38,
            name: 'Eastern Australia',
            continent: 'Australia',
            connectedTo: [ 40, 41 ]
          },
          {
            id: 39,
            name: 'Indonesia',
            continent: 'Australia',
            connectedTo: [ 37, 40, 41 ]
          },
          {
            id: 40,
            name: 'New Guinea',
            continent: 'Australia',
            connectedTo: [ 38, 39, 41 ]
          },
          {
            id: 41,
            name: 'Western Australia',
            continent: 'Australia',
            connectedTo: [ 37, 38 ]
          }
]
}

export {
    defaultGlobeSeed,
    defaultCountrySeed,
    defaultContinentSeed,
}