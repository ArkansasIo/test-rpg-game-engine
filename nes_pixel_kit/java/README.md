# NES Pixel Kit (Java)
This is a small **NES-style pixel art generator kit** in Java (pure standard library).
It generates:
- RPG spritesheet (16x16 sprites)
- Fantasy tileset (8x8 tiles incl. grass/dungeon/water frames)
- UI kit sprites
- 8x8 ASCII bitmap font sheet

## Run
```bash
# from ./java
javac -d out $(find src/main/java -name "*.java")
java -cp out com.neskit.Main
```

Outputs go to: `./out_assets/`

## NES-ish constraints enforced
- Pixel grid: 8x8 tiles, 16x16 sprites
- Limited palette subsets and 3-color-ish layering per asset family
- Tile reuse + animation frames (water)

You can extend `MonsterConverter` to map “Elden Ring / D&D”-style monster descriptors to sprite recipes.
