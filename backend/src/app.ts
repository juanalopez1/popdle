import * as path from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import { fileURLToPath } from "url";
import plugins from "./plugins/plugins.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type AppOptions = {
    // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {
    for (const plugin of plugins) {
        fastify.register(plugin);
    }

    // Autoload routes.
    void fastify.register(AutoLoad, {
        dir: path.join(__dirname, "routes"),
        options: opts,
        forceESM: true,
    });
};

export default app;
export { app, options };
