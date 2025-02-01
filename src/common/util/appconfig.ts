interface ConfigObject {
    default?: any;
    env: string;
}

function appConfig(obj: { [key: string]: ConfigObject }) {
    const configObj = obj;

    const get = (val: string) => {
        if (!configObj[val]) {
            return null;
        }

        const attr = configObj[val];
        if (attr.env && process.env[attr.env]) {
            return process.env[attr.env];
        } else if (attr.default) {
            return attr.default;
        } else {
            return null;
        }
    };

    return {
        get,
    };
}

export default appConfig;