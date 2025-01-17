import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { decorators } from "../../../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../../../types/params.js";
import { SafeType } from "../../../../../../../utils/typebox.js";
import { PopdleTagName } from "../../../../../../../plugins/swagger.js";
import { sendError, sendOk } from "../../../../../../../utils/reply.js";
import { guessSongGameInformationSchema } from "../../../../../../../types/game.js";
import { getGuessSongInformation } from "../../../../../../../services/game.js";
import { UnreachableCaseError } from "ts-essentials";

export default (async (fastify) => {
    fastify.get("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "gameId"]),
            response: {
                200: guessSongGameInformationSchema,
                ...SafeType.CreateErrors(["unauthorized", "notFound"]),
            },
            summary: "Get information about a popdle game.",
            description: undefined,
            tags: ["User", "Popdle"] satisfies PopdleTagName[],
        },
        async handler(request, reply) {
            const result = await getGuessSongInformation(request.params);
            switch (result.status) {
                case "RepeatedTrack":
                case "NotYourGame":
                case "AttemptsExhausted":
                case "AlreadyWon":
                    // This should never happen.
                    throw result.status;
                case "NoGame":
                    return sendError(reply, "notFound", result.status);
                case "TrackNotFound":
                    return sendError(reply, "notFound", result.status);
                case "Success":
                    break;
                default:
                    throw new UnreachableCaseError(result);
            }

            return sendOk(reply, 200, result.hints);
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
