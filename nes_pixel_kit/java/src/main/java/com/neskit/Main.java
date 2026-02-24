package com.neskit;

import java.io.File;

public final class Main {
    public static void main(String[] args) throws Exception {
        File out = new File("out_assets");
        out.mkdirs();

        // 1) Sprite sheet (2x2)
        SpriteGenerator sg = new SpriteGenerator();
        PixelCanvas sheet = SheetBuilder.makeSheet(2,2,16,16);
        sheet.blit(sg.knight(), 0,0);
        sheet.blit(sg.mage(), 16,0);
        sheet.blit(sg.rogue(), 0,16);
        sheet.blit(sg.slime(), 16,16);
        ImageIOUtil.savePng(sheet.image(), new File(out, "rpg_sprites_1x.png"));

        // 2) Tileset (16 cols x 8 rows) - we fill a small subset
        TileGenerator tg = new TileGenerator();
        PixelCanvas tiles = SheetBuilder.makeSheet(16,8,8,8);
        for(int v=0; v<4; v++) tiles.blit(tg.grass(v), v*8, 0);
        for(int v=0; v<4; v++) tiles.blit(tg.stoneFloor(v), v*8, 8);
        for(int v=0; v<4; v++) tiles.blit(tg.wall(v), (4+v)*8, 8);
        for(int f=0; f<3; f++) tiles.blit(tg.water(f), f*8, 16);
        tiles.blit(tg.uiFrameTile(), 4*8, 16);
        ImageIOUtil.savePng(tiles.image(), new File(out, "fantasy_tileset_1x.png"));

        // 3) UI kit (sample)
        UiKitGenerator ug = new UiKitGenerator();
        PixelCanvas ui = new PixelCanvas(128,64);
        ui.blit(ug.window(60,26), 2,2);
        ui.blit(ug.window(60,30), 2,32);
        ui.blit(ug.cursor(), 70, 5);
        ui.blit(ug.heart(), 70, 22);
        ImageIOUtil.savePng(ui.image(), new File(out, "ui_kit_1x.png"));

        // 4) Font sheet (8x8 ASCII)
        FontGenerator fg = new FontGenerator();
        ImageIOUtil.savePng(fg.asciiSheet().image(), new File(out, "font_8x8_ascii_1x.png"));

        // 5) Monster conversion demo
        MonsterConverter mc = new MonsterConverter();
        PixelCanvas monsters = new PixelCanvas(5*16,16);
        String[] names = {"Tree Sentinel", "Mimic", "Beholder", "Mind Flayer", "Gelatinous Cube"};
        for(int i=0;i<names.length;i++){
            monsters.blit(mc.convert(names[i]), i*16, 0);
        }
        ImageIOUtil.savePng(monsters.image(), new File(out, "monster_conversions_1x.png"));

        System.out.println("Done. Wrote assets to: " + out.getAbsolutePath());
    }
}
