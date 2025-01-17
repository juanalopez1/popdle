import { Value } from "@sinclair/typebox/value";
import { SafeType } from "../utils/typebox.js";
import { Static } from "@sinclair/typebox";

// If any new environment variables are added, they should be put here.
const envSchema = SafeType.Object({
    NODE_ENV: SafeType.StringEnum(["development", "production"]),
    PGDATABASE: SafeType.String(),
    PGUSER: SafeType.String(),
    PGPASSWORD: SafeType.String(),
    PGHOST: SafeType.String(),
    FRONT_URL: SafeType.String(),
    MUSIXMATCH_KEY: SafeType.String(),
});

const filteredProperties = Object.entries(envSchema.properties).filter(
    ([key, property]) =>
        !Value.Check(property, process.env[key])
);

if (filteredProperties.length !== 0) {
    console.log("Environment variables do not match the schema:");
    console.log(
        '"env": ' +
            JSON.stringify(Object.fromEntries(filteredProperties), null, "    ")
    );
    console.log(
        "Make sure every required variable is set and their values are correct."
    );
    throw "Exiting.";
}

/**
 * Environment variable with its types checked and cached as soon as the
 * program starts. It is not necessary to make any more runtime checks
 * for this.
 */
export const typedEnv = Value.Parse(
    envSchema,
    process.env
) as Readonly<Static<typeof envSchema>>;
