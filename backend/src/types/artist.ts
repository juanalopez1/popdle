import { SafeType } from "../utils/typebox.js";

export const artistSchema = SafeType.Object(
    {
        id: SafeType.Integer({
            description:
                "A numeric identifier for an artist. Generated by the backend, " +
                "unique and unchangeable.",
        }),
        musixmatchArtistId: SafeType.Integer({
            description: "Identifier for an artist given by MusixMatch",
        }),
        spotifyArtistId: SafeType.String({
            description: "Identifier for an artist given by spotify",
        }),
        artistIsrc: SafeType.String({
            description:
                "Identifier for an artist accepted by multiple platforms",
        }),
        name: SafeType.String({
            description: "Name of the artist, does not have to be unique.",
        }),
        imageUrl: SafeType.Optional(
            SafeType.String({
                description:
                    "Url to download the artist's portrait image, if available.",
            })
        ),
        externalUrls: SafeType.String({
            description:
                "Url that will allow users to be redirected to the artist's profile on Spotify.",
        }),
        genres: SafeType.Array(
            SafeType.String({
                description: "Genres associated with the artist.",
            })
        ),
        followers: SafeType.Number({
            description: "The number of followers the artist has.",
        }),
    },
    {
        $id: "ArtistSchema",
        title: "artistSchema",
    }
);
