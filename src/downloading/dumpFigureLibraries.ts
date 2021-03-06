import { promises as fs } from "fs";
import { parseStringPromise } from "xml2js";
import fetch from "node-fetch";
import { extractSwf } from "./extractSwf";
import { Promise as Bluebird } from "bluebird";
import * as path from "path";
import { Action } from "./state";

export async function dumpFigureLibraries(
  gordon: string,
  figureMapString: string,
  out: string,
  dispatch: (action: Action) => void
) {
  const map = figureMapString;
  const result = await parseStringPromise(map);
  const libs: any[] = result.map.lib;

  dispatch({ type: "FIGURE_ASSETS_COUNT", payload: libs.length });

  await Bluebird.map(
    libs,
    async (item) => {
      const id = item["$"].id;
      const fileName = `${id}.swf`;
      const file = `${gordon}/${fileName}`;

      const resolvedOutPath = path.resolve(path.join(out, id));
      await fs.mkdir(resolvedOutPath, { recursive: true });

      const swfLocation = path.join(resolvedOutPath, fileName);

      const success = () =>
        dispatch({ type: "FIGURE_ASSETS_PROGRESS_SUCCESS", payload: fileName });

      try {
        await fs.stat(swfLocation);
        success();
        return;
      } catch (e) {
        // Continue if file doesnt exist yet
      }

      const response = await fetch(file);
      const buffer = await response.buffer();

      if (response.status !== 200) return;

      await fs.writeFile(swfLocation, buffer);
      await extractSwf(resolvedOutPath, swfLocation, ["bin"]);

      success();
    },
    { concurrency: 30 }
  );
}
