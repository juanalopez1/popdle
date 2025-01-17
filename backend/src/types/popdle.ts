import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";
import { userSchema } from "./user.js";
import { artistSchema, spotifyTrackSchema } from "./spotify.js";

export const gameModes = ["guessLine", "guessSong"] as const;

export type GameMode = (typeof gameModes)[number];

export const popdleGameConfig = SafeType.Object({
    id: SafeType.Integer({ description: "Unique identifier for a config." }),
    mode: SafeType.StringEnum([...gameModes]),
    onlyFavoriteArtists: SafeType.Boolean({
        description: "Whether to pick from any artist or only favorited ones.",
    }),
    fromArtists: SafeType.Array(artistSchema.properties.spotifyArtistId, {
        description: "The artists we can choose from, by their spotify ids.",
    }),
    fromTracks: SafeType.Array(spotifyTrackSchema.properties.id, {
        description: "The tracks we can choose from, by their spotify ids.",
    }),
});

export const musixmatchIdSchema = SafeType.Object({
    musixmatchId: SafeType.String({
        description:
            "Identifier which can be used to fetch artist data from MusixMatch.",
    }),
});

export const guessSongHintsSchema = SafeType.Object({
    correctArtist: SafeType.Boolean(),
    correctBand: SafeType.Boolean(),
    correctAlbum: SafeType.Boolean(),
});

export const guessLineHintSchema = SafeType.Object({
    guessLineHints: SafeType.Array(
        SafeType.StringEnum([
            "Correct spot",
            "Correct letter, wrong spot.",
            "Wrong",
        ]),
        {
            description: "For every letter given returns a hint, in order.",
        }
    ),
    input: SafeType.String(),
});

export const PopdleGuessSongAttemptSchema = SafeType.Object({
    guessedSongId: musixmatchIdSchema.properties.musixmatchId,
    guessedAt: SafeType.String({ format: "date-time" }),
});

export const PopdleGuessLineAttemptSchema = SafeType.Object({
    guessedLine: SafeType.String({
        maxLength: 1000,
        description: "A line to match against the actual line of the song.",
    }),
    guessedAt: SafeType.String({ format: "date-time" }),
});

export const PopdleGameSchema = SafeType.Object({
    userId: userSchema.properties.id,
    gameId: SafeType.Integer({
        description: "A unique identifier for a popdle game.",
    }),
    attempts: SafeType.Union([
        SafeType.Array(PopdleGuessSongAttemptSchema),
        SafeType.Array(PopdleGuessLineAttemptSchema),
    ]),
    ...SafeType.Partial(
        SafeType.Object({
            won: SafeType.Boolean(),
            endingTime: SafeType.String({ format: "date-time" }),
        })
    ).properties,
    gameMode: SafeType.StringEnum([...gameModes]),
    config: popdleGameConfig,
});

export const gameModeArraySchema = SafeType.Object({
    gameModes: SafeType.Array(PopdleGameSchema.properties.gameMode),
});

export type PopdleGame = Static<typeof PopdleGameSchema>;
