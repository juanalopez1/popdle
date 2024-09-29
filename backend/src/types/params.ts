import { SafeType } from "../utils/typebox.js";
import { MelodleGameSchema } from "./melodle.js";
import { profilePictureSchema } from "./public.js";
import { userSchema } from "./user.js";

export const ParamsSchema = SafeType.Object({
    userId: userSchema.properties.id,
    selfId: userSchema.properties.id,
    filename: profilePictureSchema.properties.id,
    friendId: userSchema.properties.id,
    gameMode: MelodleGameSchema.properties.gameMode,
    optionalGameMode: SafeType.Optional(MelodleGameSchema.properties.gameMode),
});
