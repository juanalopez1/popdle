import { Type } from "@sinclair/typebox";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { ErrorMessageSchema, UserSchema } from "../../../types/user.js";
import { query } from "../../../services/database.js";
import { SafeType } from "../../../utils/typebox.js";

const tokenSchema = Type.Object({
    jwtToken: Type.String(),
});

const auth: FastifyPluginAsyncTypebox = async (fastify, opts) => {
    fastify.post("/", {
        schema: {
            body: SafeType.WithExamples(
                SafeType.Pick(UserSchema, ["email", "password"]),
                [
                    {
                        email: "ezponjares@gmail.com",
                        password: "Cris123!",
                    },
                ],
            ),
            response: {
                200: tokenSchema,
                404: Type.Ref(ErrorMessageSchema),
            },
            security: [],
        },

        handler: async function(request, reply) {
            const result = await query(
                `
                SELECT id
                FROM users
                WHERE email = $1
                AND password = crypt($2, password);
            `,
                //[request.body.email, request.body.password],
            );
            if (result.rowCount !== 1) {
                return reply
                    .code(404)
                    .send({ errorMessage: "Wrong email or password" });
            }
            const token = fastify.jwt.sign({ id: result.rows[0].id });
            return reply.code(200).send({ jwtToken: token });
        },
    });
};

export default auth;
