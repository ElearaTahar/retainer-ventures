# Retainer Ventures

A small web application for exploring Final Fantasy XIV retainer ventures.

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Data generation

The application uses generated static data derived from FFXIV game data and supplemental community data.

The generation scripts have dependencies on each other's outputs and should be run in the following order:

```bash
npm run generate:ventures
npm run generate:items
npm run generate:reward-supplement
npm run generate:rewards
npm run check:missing-rewards
```

### Generation steps

`generate:ventures`: Generates the normalized venture data used by the application.

`generate:items`: Generates the item search index used by the application and by the reward supplement generator.

`generate:reward-supplement`: Resolves manually verified Exploration Venture reward names to FFXIV Item IDs and generates `data/exploration-reward-supplement.json`.

`generate:rewards`: Combines LuminaSupplemental reward associations with the local Exploration Venture reward supplement, then classifies the rewards using FFXIV game data.

`check:missing-rewards`: Checks which Exploration Ventures still have no known reward data. This is a validation step and does not generate application data.

### Data sources

The project distinguishes between reward associations and game data used to classify those rewards.

- **[XIVAPI / FFXIV game data](https://v2.xivapi.com/)** - venture and item data, and structural data used to classify rewards.
- **[LuminaSupplemental](https://github.com/Critical-Impact/LuminaSupplemental)** - primary source for known Retainer Venture reward associations.
- **[FFXIV Community Wiki](https://ffxiv.consolegameswiki.com/wiki/FF14_Wiki)** - manually verified supplemental reward associations currently missing from LuminaSupplemental.

Generated files under `public/data/` are consumed by the frontend. The local supplement under `data/` is an input to the generation process.

## Third-party assets

### Icons

Some interface icons are derived from third-party projects:

- **FFXIV class/job icons** - Miner, Botanist, and Fisher icons are derived
  from the [xivapi/classjob-icons](https://github.com/xivapi/classjob-icons) project, licensed under the MIT License.
- **Lucide** - interface icons are provided by Lucide, licensed under the
  ISC License.
- **FFXIV item icons** - Item icon URLs are constructed from their FFXIV icon IDs and loaded directly from the [XIVAPI](https://v2.xivapi.com/) asset endpoint at runtime. Unlike the generated venture and item metadata, these images are not bundled with the application.

See the respective projects for their full license terms.

### Fonts

This project uses the following open-source fonts:

- **[Manrope](https://github.com/davelab6/manrope)** - used for headings.
- **[DM Sans](https://github.com/googlefonts/dm-fonts)** - used for body text and UI elements.

Both fonts are licensed under the [SIL Open Font License 1.1](https://openfontlicense.org/open-font-license-official-text/).

The fonts are self-hosted using [Fontsource](https://fontsource.org/) and are not loaded from an external CDN at runtime.

### Audio

The following sound effect is used in the application:

- **Header bell sound** - [Ding 3](https://pixabay.com/sound-effects/film-special-effects-ding-3-90200/) by freesound_community, sourced from Pixabay and licensed under the [Pixabay Content License](https://pixabay.com/service/license-summary/).

The original sound has been shortened and converted to WAV for use in the application.

## License

The original source code of Retainer Ventures is licensed under the MIT License. See [LICENSE](LICENSE).

Final Fantasy XIV game data, names, icons, and other game assets remain the property of Square Enix and their respective rights holders.

Third-party data and assets, including content derived from LuminaSupplemental, are subject to their respective licenses and terms. The MIT License does not apply to these materials.

Retainer Ventures is an unofficial fan-made project and is not affiliated with or endorsed by Square Enix.
