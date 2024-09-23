import { Static, Type } from "@sinclair/typebox";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { ErrorMessageSchema, UserSchema } from "../../../types/user.js";
import { query } from "../../../services/database.js";
import { Value } from "@sinclair/typebox/value";

const tokenSchema = Type.Object({
    jwtToken: Type.String(),
});

const auth: FastifyPluginAsyncTypebox = async (fastify, opts) => {
    const baseLoginSchema = Type.Object({
        email: UserSchema.properties.email,
        password: UserSchema.properties.password,
    });

    type LoginBodyType = Static<typeof baseLoginSchema>;

    const loginSchemaExamples = [
        {
            email: "ezponjares@gmail.com",
            password: "Cris123!",
        },
    ] satisfies LoginBodyType[];

    for (const example of loginSchemaExamples) {
        Value.Assert(baseLoginSchema, example);
    }
    
    fastify.post("/", {
        schema: {
            body: Type.Composite([baseLoginSchema], {
                examples: loginSchemaExamples,
            }),
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
