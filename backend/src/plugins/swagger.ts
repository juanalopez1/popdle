import { FastifySwaggerOptions } from "@fastify/swagger";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fp from "fastify-plugin";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";

export const tags = [
    {
        name: "Debug",
        description:
            "Endpoints only enabled on debug mode. " +
            "If you see endpoints inside here while in production " +
            "(so, if you are our client), please notify us. " +
            "That would be a security vulnerability.",
    },
    {
        name: "Auth",
        description: "Authentication-related endpoints.",
    },
    {
        name: "Melodle",
        description:
            "Main application endpoints. These must all require authentication.",
    },
    {
        name: "Static",
        description: "Endpoints about information that never changes through user interaction."
    },
    {
        name: "Other",
        description: "Endpoints which serve odd purposes.",
    },
] as const satisfies {
    name: string;
    description: string;
    externalDocs?: string;
}[];

export type MelodleTagNames = (typeof tags)[number]["name"];

export default fp<FastifySwaggerOptions>(async (fastify, opts) => {
    await fastify.register(swagger, {
        openapi: {
            openapi: "3.0.0",
            info: {
                title: "Melodle API",
                description: "Documentation for Melodle's devs.",
                version: "0.1.0",
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
            
            tags,
            servers: [
                {
                    url: "https://localhost/backend",
                    description: "Development server",
                },
            ],
            security: [{ bearerAuth: [] }],
        },
    });

    await fastify.register(swaggerUi, {
        routePrefix: "docs",
        uiConfig: {
            docExpansion: "list",
            deepLinking: true,
            "filter": true,
            "defaultModelExpandDepth": 10,
            "defaultModelsExpandDepth": 10,
            "defaultModelRendering": "example",
            "syntaxHighlight": {
                "theme": "arta"
            },
            "showCommonExtensions": true,
            "persistAuthorization": true,
            displayRequestDuration: true,
            showExtensions: true,
        },
        uiHooks: {
            onRequest: function(request, reply, next) {
                next();
            },
            preHandler: function(request, reply, next) {
                next();
            },
        },
        theme: {
            "title": "Melodle API documentation",
            "css": [
                {
                    "filename": "theme.css",
                    content: new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.DARK)
                }
            ]
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => {
            return swaggerObject;
        },
        transformSpecificationClone: true,
    });
});
