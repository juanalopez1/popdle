import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../../../../../plugins/swagger.js";
import { decorators } from "../../../../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../../../../types/params.js";
import { guessLineHintSchema, MelodleGuessLineAttemptSchema } from "../../../../../../../../types/melodle.js";

export default (async (fastify) => {
    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "gameId"]),
            body: SafeType.Pick(MelodleGuessLineAttemptSchema, ["guessedLine"]),
            response: {
                200: SafeType.Object({
                    ...guessLineHintSchema.properties,
                    won: SafeType.Boolean(),
                }),
                ...SafeType.CreateErrors(["unauthorized", "notFound"]),
            },
            summary: "Submit a guess for a melodle game.",
            description: undefined,
            tags: ["Melodle"] satisfies MelodleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
