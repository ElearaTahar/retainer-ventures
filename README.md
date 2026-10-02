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

- **XIVAPI / FFXIV game data** — venture and item data, and structural data used to classify rewards.
- **LuminaSupplemental** — primary source for known Retainer Venture reward associations.
- **FFXIV Community Wiki** — manually verified supplemental reward associations currently missing from LuminaSupplemental.

Generated files under `public/data/` are consumed by the frontend. The local supplement under `data/` is an input to the generation process.
