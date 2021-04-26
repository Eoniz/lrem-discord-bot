import dotenv from 'dotenv';

const loadConfig = () => {
    dotenv.config();

    return {
        "discord": {
            "token": process.env.DISCORD_TOKEN,
            "prefix": process.env.DISCORD_PREFIX
        }
    }
};

const config = loadConfig();
export default config;
