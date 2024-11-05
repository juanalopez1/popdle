import { inject, Injectable, signal } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import {
    getUsersSelfSelfIdArtists,
    GetUsersSelfSelfIdArtists200Item,
    GetUsersSelfSelfIdArtists200ItemData,
} from "../../apiCodegen/backend";

export type Artist = GetUsersSelfSelfIdArtists200Item;

@Injectable({
    providedIn: "root",
})
export class HomeArtistsService {
    private _artists = signal<Artist[]>([]);

    public artists = this._artists.asReadonly();
    private _localStorage = inject(LocalStorageService);
    public async loadData() {
        const userId = this._localStorage.getItem("userInfo")?.id;

        if (userId === undefined) {
          return;
        }

        const data = await getUsersSelfSelfIdArtists(userId);
        console.log(`LLEGA JUANCHO?? = ${data}`)
        this._artists.set(data.data as Artist[]);
    }
}
