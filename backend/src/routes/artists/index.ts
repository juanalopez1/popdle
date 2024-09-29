import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
    artistSchema,
} from "../../../types/artists.js";
import { SafeType } from "../../utils/typebox.js";

const artist: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.post("", {
        schema: {
            body: SafeType.WithExamples(
                SafeType.Pick(artistSchema, [
                    "username",
                    "profilePictureId",
                    "email",
                    "password",
                    "name",
                ]),
                [
                    {
                        username: "juanalopez1",
                        email: "juanaxlopez1@gmail.com",
                        name: "juana",
                        password: "Juana123!",
                        profilePictureId: 1,
                    },
                ]
            ),
            response: {
                200: SafeType.WithExamples(
                    SafeType.Object({
                        ...jwtTokenSchema.properties,
                        ...SafeType.Pick(userSchema, ["id"]).properties,
                    }),
                    [
                        {
                            jwtToken:
                                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzI3NDExODc4fQ.lCYmZF_REl8rYYj1UjJzacXrPCTyjVdA-KsR71xHwQw",
                            id: 2,
                        },
                    ]
                ),
                ...SafeType.CreateErrors(["badRequest"]),
            },
            security: [],
            tags: ["Auth", "User CRUD"] satisfies MelodleTagNames[],
            summary: "Create a user.",
            description:
                "Creates a new user with the given credentials if possible.",
        },

        handler: async function (request, reply) {
            const result = await runPreparedQuery(insertUser, request.body);

            if (result.length !== 1) {
                return sendError(
                    reply,
                    "badRequest",
                    "No se pudo crear el usuario."
                );
            }

            const token = fastify.jwt.sign({
                id: result[0].id,
            } satisfies JwtTokenContent);

            return reply.code(200).send({ jwtToken: token, id: result[0].id });
        },
    });
};

export default artist;