# mc-items

Item IDs, English display names and inventory-style icons for every Minecraft: Java Edition item, packaged as a tiny TypeScript library.

Built for the [Vanilla Tyme](https://github.com/VanillaTymeServers) shop site, where players list what their in-game shops sell, but it's useful anywhere you need to show a Minecraft item with its real name and icon: item pickers, trade lists, shop directories, wikis, dashboards.

- **1,657 items** for Minecraft **26.3**
- **Icons:** transparent PNGs, longest side about 128 px, rendered with the [WikiRenderer](https://github.com/Pigicial/WikiRenderer) mod. Blocks are 3D isometric renders and flat items are pixel-perfect sprites, matching how they look in an inventory slot.
- **Names:** taken directly from the game's own `en_us.json`
- **Typed:** `ItemId` is a union of every known ID, so typos are compile errors
- **No dependencies, no build step:** ships plain `.ts` files for your bundler (Vite, Nuxt, etc.)

## Install

The package is installed straight from GitHub, pinned to a Minecraft version tag:

```bash
pnpm add github:VanillaTymeServers/mc-items#v26.3.0
```

## Usage

```ts
import { getItemIconPath, getItemName, items, toItemId, type ItemId } from '@vanillatyme/mc-items'

getItemName('minecraft:diamond') // 'Diamond'
getItemName('oak_planks') // 'Oak Planks'
getItemName('not_an_item') // undefined

getItemIconPath('minecraft:diamond') // 'icons/diamond.png'
toItemId('minecraft:diamond') // 'diamond'

const favourite: ItemId = 'netherite_sword' // type-checked against every item ID

Object.keys(items).length // 1657
```

Every function accepts IDs with or without the `minecraft:` namespace.

### Serving the icons

`getItemIconPath` returns a path relative to the package. Serve the package's `icons/` folder as static files, then build URLs from the item ID. For example, in Nuxt:

```ts
// nuxt.config.ts
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
	nitro: {
		publicAssets: [
			{
				dir: fileURLToPath(new URL('./node_modules/@vanillatyme/mc-items/icons', import.meta.url)),
				baseURL: '/items',
			},
		],
	},
})
```

```vue
<img :src="`/items/${toItemId(id)}.png`" :alt="getItemName(id)" class="pixelated" />
```

Icons are pixel art, so scale them down without blurring:

```css
.pixelated {
	image-rendering: pixelated;
}
```

Not every icon is perfectly square, because tall items like doors are taller than they are wide. Display them inside a square box with `object-fit: contain`.

## Updating to a new Minecraft version

The data is generated from the game files, so updating means re-rendering and re-running the generator.

### 1. Render the icons

Use the [WikiRenderer](https://github.com/Pigicial/WikiRenderer) mod (v2.6 was used for 26.3) in the new Minecraft version and batch-render the `minecraft` namespace as **items** with:

| Setting | Value |
| --- | --- |
| Item Resolution | `128` |
| Block Item Resolution | `128` |
| Export | Crop and Rescale **Longer Side** |
| Show Background Color | off (transparent) |
| Tick Texture Animations | off |
| File name | `XidX` (the item ID) |

The renders end up in `<instance>/minecraft/renders/batches/namespace_minecraft/items`.

### 2. Extract the language file

Copy only `en_us.json` out of the client jar into `tmp/`, which is git-ignored and never committed:

```bash
mkdir tmp
tar -xf "<path to>/minecraft-<version>-client.jar" -C tmp assets/minecraft/lang/en_us.json
```

### 3. Generate

```bash
pnpm install
pnpm generate tmp/assets/minecraft/lang/en_us.json "<instance>/minecraft/renders/batches/namespace_minecraft/items"
pnpm typecheck
```

This copies the renders into `icons/` and writes `items.ts`. It stops with an error, without writing anything, if any rendered item has no English name.

### 4. Release

Bump `version` in `package.json` to the Minecraft version (e.g. `26.4.0`), commit, and tag it (`v26.4.0`). Projects using the package update by changing the tag they install.

## Credits

Icons rendered with [WikiRenderer](https://github.com/Pigicial/WikiRenderer) by glisco, Pigicial and Skittlq.

## License

The **source code** (`index.ts`, `scripts/`, config files) is released under the [MIT License](LICENSE).

The **icons** and **item names** are derived from Minecraft and are © Mojang Studios / Microsoft. They are **not** covered by the MIT License and are used under the [Minecraft Usage Guidelines](https://www.minecraft.net/en-us/usage-guidelines). See [NOTICE.md](NOTICE.md).

NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.