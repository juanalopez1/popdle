import {
    FastifyPluginAsyncTypebox,
    FormatRegistry,
    TSchema,
} from "@fastify/type-provider-typebox";
import { typedEnv } from "../../types/env.js";
import { SafeType } from "../../utils/typebox.js";
import { MelodleTagName } from "../../plugins/swagger.js";
import {
    executeTransaction,
    runPreparedQuery,
} from "../../services/database.js";
import { decorators } from "../../services/decorators.js";
import {
    getFriendsSnapshot,
    getUsersSnapshot,
} from "../../queries/snapshots.queries.js";
import { friendSchema, User, userSchema } from "../../types/user.js";
import { sendOk } from "../../utils/reply.js";
import { getRandomPopularSong } from "../../services/game.js";
import MusixmatchAPI from "../../musixmatch-api/musixmatch.js";
import { Value } from "@sinclair/typebox/value";

export default (async (fastify) => {
    if (typedEnv.NODE_ENV === "development") {
        fastify.get("/snapshot", {
            onRequest: [decorators.noSecurity],
            schema: {
                response: {
                    200: SafeType.Object({
                        users: SafeType.Array(
                            SafeType.Object({
                                ...SafeType.Pick(userSchema, [
                                    "name",
                                    "email",
                                    "username",
                                    "profilePictureId",
                                ]).properties,
                                spotifyId: SafeType.Optional(
                                    userSchema.properties.spotifyId
                                ),
                            } satisfies { [K in keyof User]?: TSchema })
                        ),
                        friends: SafeType.Array(
                            SafeType.Object({
                                friendUsername: userSchema.properties.username,
                                userUsername: userSchema.properties.username,
                                createdAt: SafeType.String({
                                    format: "date-time",
                                }),
                                status: friendSchema.properties.status,
                            })
                        ),
                    }),
                    ...SafeType.CreateErrors([]),
                },
                summary: "Get current state of application.",
                description: undefined,
                tags: ["TODO Schema", "Debug"] satisfies MelodleTagName[],
                security: [],
            },
            async handler(_request, reply) {
                return await executeTransaction(async () => {
                    // TODO: Return every table (do once we review the db).
                    const users = await runPreparedQuery(getUsersSnapshot, {});
                    const friends = await runPreparedQuery(
                        getFriendsSnapshot,
                        {}
                    );
                    return sendOk(reply, 200, {
                        users: users.map((u) => ({
                            ...u,
                            spotifyId: u.spotifyId ?? undefined,
                        })),
                        friends: friends.map((f) => ({
                            ...f,
                            createdAt: f.createdAt.toUTCString(),
                        })),
                    });
                });
            },
        });
        fastify.put("/snapshot", {
            onRequest: [decorators.noSecurity],
            schema: {
                response: {
                    200: SafeType.Literal("TODO!"),
                    ...SafeType.CreateErrors([]),
                },
                summary: "Reset the application state to a certain snapshot.",
                description: undefined,
                tags: ["TODO Schema", "Debug"] satisfies MelodleTagName[],
                security: [],
            },
            async handler(_request, reply) {
                return reply.notImplemented();
            },
        });
    }

    fastify.post("/playground", {
        onRequest: [decorators.noSecurity],
        schema: {
            security: [],
            tags: ["Debug"] satisfies MelodleTagName[],
        },
        async handler(_request, reply) {
            const api = new MusixmatchAPI();
            const ladrones = await api.searchTrack({
                f_artist_id: 33091389,
                page: 0,
                page_size: 100,
            });

            if (!ladrones.parse()) {
                return reply.code(400).send(ladrones.headers);
            }

            const result = await api.getMusicGenres();

            return result.parse() ? result.body : result.headers;
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
