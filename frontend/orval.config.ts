import { defineConfig } from "orval";

export default defineConfig({
    spotify: {
        input: {
            target: "https://developer.spotify.com/reference/web-api/open-api-schema.yaml",
        },
        output: {
            target: "src/apiCodegen/spotify.ts",
            prettier: true,
            baseUrl: "https://api.spotify.com/v1",
        },
    },
    backend: {
        input: {
            target: "./schemas/backendSchema.json",
        },
        output: {
            target: "src/apiCodegen/backend.ts",
            prettier: true,
            override: {
                mutator: {
                    path: "./src/apiCodegen/backend-mutator.ts",
                    name: "customInstance",
                },
            },
        },
    },
    backend_zod: {
        input: {
            target: "./schemas/backendSchema.json",
        },
        output: {
            client: "zod",
            target: "src/apiCodegen/backend-zod.ts",
            prettier: true,
        },
    },
});
