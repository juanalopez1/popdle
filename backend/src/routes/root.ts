import { FastifyPluginAsync } from "fastify";
import { SafeType } from "../utils/typebox.js";
import { PopdleTagName } from "../plugins/swagger.js";
import { decorators } from "../services/decorators.js";

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
    fastify.get("/", {
        onRequest: [decorators.noSecurity],
        schema: {
            response: {
                200: SafeType.Object({
                    root: SafeType.Boolean(),
                    ping: SafeType.Literal("Pong!"),
                }),
            },
            description: "Route to check whether the service is working.",
            summary: "Ping!",
            tags: ["Other"] satisfies PopdleTagName[],
            security: [],
        },
        handler: async function (_request, _reply) {
            return { root: true, ping: "Pong!" };
        },
    });
};

export default root;
