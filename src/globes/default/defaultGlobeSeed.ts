import { Country, Continent, Globe } from "../../common/types/types";
function defaultGlobeSeed():Globe {
    let globe:Globe = {
    id: 'defaultGlobeID',
    name: 'Earth',
    playerMax: 6,
    countries: defaultCountrySeed(),
    continents: defaultContinentSeed(),
    }
    return globe
}
function defaultContinentSeed():Continent[] {
    return[
        {
            "id": "1",
            "name": "North America",
            "countries": ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
        },
        {
            "id": "2",
            "name": "South America",
            "countries": ["10", "11", "12", "13"]
        },
        {
            "id": "3",
            "name": "Europe",
            "countries": ["14", "15", "16", "17", "18", "19", "20"]
        },
        {
            "id": "4",
            "name": "Africa",
            "countries": ["21", "22", "23", "24", "25", "26"]
        },
        {
            "id": "5",
            "name": "Asia",
            "countries": ["27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38"]
        },
        {
            "id": "6",
            "name": "Australia",
            "countries": ["39", "40", "41", "42"]
        }

    ]
}
function defaultCountrySeed():Country[] {
    return[
    {
        "id": "1",
        "name": "Alaska",
        "continent": "North America",
        "connectedTo": ["2", "6"]
    },
    {
        "id": "2",
        "name": "Alberta",
        "continent": "North America",
        "connectedTo": ["1", "6", "7", "9"]
    },
    {
        "id": "3",
        "name": "Central America",
        "continent": "North America",
        "connectedTo": ["4", "6", "13"]
    },
    {
        "id": "4",
        "name": "Eastern United States",
        "continent": "North America",
        "connectedTo": ["3", "7", "8", "9"]
    },
    {
        "id": "5",
        "name": "Greenland",
        "continent": "North America",
        "connectedTo": ["6", "7", "8", "15"]
    },
    {
        "id": "6",
        "name": "Northwest Territory",
        "continent": "North America",
        "connectedTo": ["1", "2", "5", "7", "8"]
    },
    {
        "id": "7",
        "name": "Ontario",
        "continent": "North America",
        "connectedTo": ["2", "4", "5", "6", "8"]
    },
    {
        "id": "8",
        "name": "Quebec",
        "continent": "North America",
        "connectedTo": ["4", "5", "7"]
    },
    {
        "id": "9",
        "name": "Western United States",
        "continent": "North America",
        "connectedTo": ["2", "3", "4", "7"]
    },
    {
        "id": "10",
        "name": "Argentina",
        "continent": "South America",
        "connectedTo": ["11", "12"]
    },
    {
        "id": "11",
        "name": "Brazil",
        "continent": "South America",
        "connectedTo": ["10", "12", "13", "25"]
    },  
    {
        "id": "12",
        "name": "Peru",
        "continent": "South America",
        "connectedTo": ["10", "11", "13"]
    },
    {
        "id": "13",
        "name": "Venezuela",
        "continent": "South America",
        "connectedTo": ["3", "11", "12"]
    },
    {
        "id": "14",
        "name": "Great Britain",
        "continent": "Europe",
        "connectedTo": ["15", "16", "17", "20"]
    },
    {
        "id": "15",
        "name": "Iceland",
        "continent": "Europe",
        "connectedTo": ["5", "14", "17"]
    },
    {
        "id": "16",
        "name": "Northern Europe",
        "continent": "Europe",
        "connectedTo": ["14", "17", "18", "19", "20"]
    },
    {
        "id": "17",
        "name": "Scandinavia",
        "continent": "Europe",
        "connectedTo": ["14", "15", "16", "19"]
    },
    {
        "id": "18",
        "name": "Southern Europe",
        "continent": "Europe",
        "connectedTo": ["16", "19", "20", "23", "25", "33"]
    },
    {
        "id": "19",
        "name": "Ukraine",
        "continent": "Europe",
        "connectedTo": ["16", "17", "18", "27", "33", "36"]
    },
    {
        "id": "20",
        "name": "Western Europe",
        "continent": "Europe",
        "connectedTo": ["14", "16", "18", "25"]
    },
    {
        "id": "21",
        "name": "Congo",
        "continent": "Africa",
        "connectedTo": ["22", "23", "24", "25", "26"]
    },
    {
        "id": "22",
        "name": "East Africa",
        "continent": "Africa",
        "connectedTo": ["21", "23", "24", "25", "26"]
    },
    {
        "id": "23",
        "name": "Egypt",
        "continent": "Africa",
        "connectedTo": ["21", "22", "24", "25", "26"]
    },
    {
        "id": "24",
        "name": "Madagascar",
        "continent": "Africa",
        "connectedTo": ["21", "22", "23", "25"]
    },
    {
        "id": "25",
        "name": "North Africa",
        "continent": "Africa",
        "connectedTo": ["21", "23", "24", "26"]
    },
    {
        "id": "26",
        "name": "South Africa",
        "continent": "Africa",
        "connectedTo": ["21", "22", "23", "24"]
    },
    {
        "id": "27",
        "name": "Afghanistan",
        "continent": "Asia",
        "connectedTo": ["28", "30", "34", "36"]
    },
    {
        "id": "28",
        "name": "China",
        "continent": "Asia",
        "connectedTo": ["27", "29", "30", "32", "34", "35"]
    },
    {
        "id": "29",
        "name": "India",
        "continent": "Asia",
        "connectedTo": ["28", "30", "31", "33", "35"]
    },
    {
        "id": "30",
        "name": "Irkutsk",
        "continent": "Asia",
        "connectedTo": ["27", "28", "29", "31"]
    },
    {
        "id": "31",
        "name": "Japan",
        "continent": "Asia",
        "connectedTo": ["29", "30"]
    },
    {
        "id": "32",
        "name": "Kamchatka",
        "continent": "Asia",
        "connectedTo": ["28", "30", "33", "35", "36"]
    },
    {
        "id": "33",
        "name": "Middle East",
        "continent": "Asia",
        "connectedTo": ["29", "32", "34", "36"]
    },
    {
        "id": "34",
        "name": "Mongolia",
        "continent": "Asia",
        "connectedTo": ["27", "28", "33", "35"]
    },
    {
        "id": "35",
        "name": "Siberia",
        "continent": "Asia",
        "connectedTo": ["28", "29", "32", "34", "36"]
    },
    {
        "id": "36",
        "name": "Ural",
        "continent": "Asia",
        "connectedTo": ["27", "32", "35"]
    },
    {
        "id": "37",
        "name": "Yakutsk",
        "continent": "Asia",
        "connectedTo": ["29", "31", "32"]
    },
    {
        "id": "38",
        "name": "Siam",
        "continent": "Asia",
        "connectedTo": ["28", "29", "42"]
    },
    {
        "id": "39",
        "name": "Eastern Australia",
        "continent": "Australia",
        "connectedTo": ["41", "42"]
    },
    {
        "id": "40",
        "name": "Indonesia",
        "continent": "Australia",
        "connectedTo": ["38", "41", "42"]
    },
    {
        "id": "41",
        "name": "New Guinea",
        "continent": "Australia",
        "connectedTo": ["39", "40", "42"]
    },
    {
        "id": "42",
        "name": "Western Australia",
        "continent": "Australia",
        "connectedTo": ["38", "39"]
    }
]
}

export {
    defaultGlobeSeed,
    defaultCountrySeed,
    defaultContinentSeed,
}