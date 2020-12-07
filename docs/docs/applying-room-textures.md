---
id: applying-room-textures
title: Applying room textures
---

To make a plain room look more exciting, we can add room textures for floors and walls.
We do this by specifying the `wallTexture` and `floorTexture` of the room.

```ts
import * as PIXI from "pixi.js";

import { Room, FloorFurniture, Avatar, Shroom } from "@jankuss/shroom";

const view = document.querySelector("#root") as HTMLCanvasElement;
const application = new PIXI.Application({ view });

const shroom = Shroom.create({ application, resourcePath: "./resources" });
const room = Room.create(shroom, {
  tilemap: `
    0000
    0000
    0000
   `,
});

room.x = 100;
room.y = 200;

// Note: If you are using PIXI Loader and the texture has been preloaded,
// you can also specify the textures like the following.

// room.wallTexture = PIXI.Texture.from("./wall.png")

// The important thing here is that the texture is loaded before use.

room.wallTexture = loadRoomTexture("./wall.png");
room.floorTexture = loadRoomTexture("./floor.png");

application.stage.addChild(room);
```

### Important note

Both `wallTexture` and `roomTexture` expect a **loaded** texture to work properly.
Another way is to supply a Promise (i.e. by using `loadRoomTexture`),
which resolves after the texture is loaded. If the texture is not loaded before, the room will fail to render properly.