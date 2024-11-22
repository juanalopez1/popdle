import { inject, Injectable, ViewChild } from "@angular/core";
import { SelfService } from "../self.service";
import { toast } from "ngx-sonner";
import { postUsersSelfSelfIdGameGuessLine, postUsersSelfSelfIdGameGuessSong } from "../../../apiCodegen/backend";
import { GuessSongServiceTranslator } from "./guess-song.translations";
import { SafeRoutingService } from "../safe-routing.service";
import { isAxiosError } from "axios";
import { HlmDialogComponent } from "@spartan-ng/ui-dialog-helm";

@Injectable({
    providedIn: "root",
})
export class GuessSongService {
    private _self = inject(SelfService);
    private _dict = inject(GuessSongServiceTranslator).dict;
    private _router = inject(SafeRoutingService);

    @ViewChild('pickTrackDialog') pickTrackDialog!: HlmDialogComponent;

    async createGameFromTracks(trackIds: string[]) {
        const user = await this._self.waitForUserInfoSnapshot();

        try {
            toast(this._dict().creatingGame);

            const result = await postUsersSelfSelfIdGameGuessLine(user.id, {
                fromTracks: trackIds,
            });

            toast(this._dict().gameCreated);

            return this._router.navigate("/app/game/guess_line/:gameId", {
                ids: result.data,
            });
        } catch (e) {
            if (isAxiosError(e)) {
                console.log(e.response?.data);
            } else {
                console.log(e);
            }

            toast(this._dict().errorWhileCreatingGame, {
                action: {
                    label: this._dict().retry,
                    onClick: () => this.createGameFromTracks(trackIds),
                },
            });
        }
    }

    async createGameFromArtists(artistsIds: string[]) {
        const user = await this._self.waitForUserInfoSnapshot();

        try {
            toast(this._dict().creatingGame);
            const result = await postUsersSelfSelfIdGameGuessSong(user.id, {
                fromArtists: artistsIds,
            });
            toast(this._dict().gameCreated);
            return this._router.navigate("/app/game/guess_song/:gameId", {
                ids: result.data,
            });
        } catch (e) {
            if (isAxiosError(e)) {
                console.log(e.response?.data);
            } else {
                console.log(e);
            }

            toast(this._dict().errorWhileCreatingGame, {
                action: {
                    label: this._dict().retry,
                    onClick: () => this.createGameFromArtists(artistsIds),
                },
            });
        }
    }

    constructor() {}
}
