import { Component, inject, input, output } from "@angular/core";
import { GetSpotifySearch200 } from "../../../apiCodegen/backend";
import { ArtistListItemTranslator } from "./artist-list-item.translator";
import { HlmButtonModule } from "@spartan-ng/ui-button-helm";
import { provideIcons } from "@ng-icons/core";
import { lucidePlay, lucideTarget, lucideX, lucideXSquare } from "@ng-icons/lucide";
import { HlmIconModule } from "@spartan-ng/ui-icon-helm";
import { SpotifyImagePickerService } from "../../services/spotify-image-picker.service";

export type ArtistListItem = NonNullable<
  GetSpotifySearch200["artists"]
>["items"][number];

@Component({
    selector: "app-artist-list-item",
    standalone: true,
    imports: [HlmButtonModule, HlmIconModule],
    providers: [provideIcons({ lucideXSquare, lucideX, lucideTarget, lucidePlay })],
    templateUrl: "./artist-list-item.component.html",
})
export class ArtistListItemComponent {
    artist = input.required<ArtistListItem>();
    imagePicker = inject(SpotifyImagePickerService);
    dict = inject(ArtistListItemTranslator).dict;
    destroy = output<ArtistListItem>();
    play = output<ArtistListItem>();
}
