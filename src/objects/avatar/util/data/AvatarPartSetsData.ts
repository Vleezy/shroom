import { AvatarData } from "./AvatarData";
import { IAvatarPartSetsData } from "./interfaces/IAvatarPartSetsData";

export class AvatarPartSetsData
  extends AvatarData
  implements IAvatarPartSetsData {
  constructor(xml: string) {
    super(xml);
  }

  getPartInfo(
    id: string
  ):
    | {
        removeSetType?: string | undefined;
        flippedSetType?: string | undefined;
      }
    | undefined {
    const element = this.querySelector(`partSet part[set-type="${id}"]`);

    if (element == null) return;

    return {
      flippedSetType: element.getAttribute("flipped-set-type") ?? undefined,
      removeSetType: element.getAttribute("remove-set-type") ?? undefined,
    };
  }

  getActivePartSet(id: string) {
    const partSet = this.querySelectorAll(
      `activePartSet[id="${id}"] activePart`
    );

    return new Set(
      partSet.map((value) => {
        const setType = value.getAttribute("set-type");
        if (setType == null) throw new Error("Invalid set type");

        return setType;
      })
    );
  }

  static async fromUrl(url: string) {
    const response = await fetch(url);
    const text = await response.text();

    return new AvatarPartSetsData(text);
  }
}
