import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";
import { userSchema } from "./user.js";
import { createRangeSchema } from "./rangeSchema.js";

export const leaderboardSchema = SafeType.Object(
    {
        leaderboard: SafeType.Array(
            SafeType.Intersect([
                SafeType.Pick(userSchema, [
                    "id",
                    "username",
                    "name",
                    "profilePictureId",
                ]),
                SafeType.Object({
                    score: SafeType.Number({
                        description:
                            "Score calculated by user performance within their games.",
                    }),
                    rank: SafeType.Nullable(
                        SafeType.Integer({
                            description:
                                "Players' position ordered from higest to lowest score.",
                        })
                    ),
                    mode: SafeType.StringEnum(["guessLine", "guessSong"]),
                }),
            ])
        ),
    },
    {
        $id: "LeaderboardSchema",
        title: "leaderboardSchema",
        description: "A leaderboard of melodle users.",
    }
);

export const leaderBoardRangeSchema = createRangeSchema(50);

export type Leaderboard = Static<typeof leaderboardSchema>;
