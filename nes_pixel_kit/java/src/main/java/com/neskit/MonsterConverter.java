package com.neskit;

import java.util.Locale;

/**
 * Converts a high-level monster descriptor into a 16x16 sprite recipe.
 * This is where you map "Elden Ring / D&D" concepts to NES-ish silhouettes.
 *
 * NOTE: Do NOT ingest copyrighted images. Use descriptors (keywords) and generate originals.
 */
public final class MonsterConverter {

    public PixelCanvas convert(String descriptor){
        String d = descriptor.toLowerCase(Locale.ROOT);

        // Rule-based examples (extend this table):
        if(d.contains("beholder")) return Monsters.beholder();
        if(d.contains("mind flayer") || d.contains("illithid")) return Monsters.mindFlayer();
        if(d.contains("mimic")) return Monsters.mimic();
        if(d.contains("gelatinous cube")) return Monsters.gelCube();
        if(d.contains("sentinel") || d.contains("tree sentinel")) return Monsters.treeSentinel();

        // fallback: slime
        return new SpriteGenerator().slime();
    }

    // Nested recipes to keep things simple
    static final class Monsters {
        static PixelCanvas mimic(){
            PixelCanvas s = new PixelCanvas(16,16);
            var brown = NesPalette.c("BROWN");
            var tan = NesPalette.c("TAN");
            var dg = NesPalette.c("DARK_GRAY");
            var white = NesPalette.c("WHITE");
            var red = NesPalette.c("RED");

            for(int y=7;y<=13;y++) for(int x=3;x<=12;x++) s.px(x,y,brown);
            for(int x=3;x<=12;x++) s.px(x,9,dg);
            for(int y=4;y<=7;y++) for(int x=3;x<=12;x++) s.px(x,y,tan);
            for(int x=4;x<=11;x++) s.px(x,10,white);
            for(int x=5;x<=10;x+=2) s.px(x,11,white);
            for(int x=6;x<=9;x++) s.px(x,12,red);
            return s;
        }

        static PixelCanvas beholder(){
            PixelCanvas s = new PixelCanvas(16,16);
            var purple = NesPalette.c("PURPLE");
            var white = NesPalette.c("WHITE");
            var black = NesPalette.c("BLACK");
            for(int y=4;y<=13;y++){
                for(int x=4;x<=13;x++){
                    int dx=x-9, dy=y-9;
                    if(dx*dx+dy*dy<=20) s.px(x,y,purple);
                }
            }
            for(int y=8;y<=10;y++) for(int x=7;x<=11;x++) s.px(x,y,white);
            s.px(9,9,black);
            for(int dx: new int[]{-5,-3,3,5}){ s.px(9+dx,5,purple); s.px(9+dx,4,white); }
            return s;
        }

        static PixelCanvas mindFlayer(){
            PixelCanvas s = new PixelCanvas(16,16);
            var db = NesPalette.c("DARK_BLUE");
            var b = NesPalette.c("BLUE");
            var c = NesPalette.c("CYAN");
            for(int y=3;y<=8;y++) for(int x=5;x<=10;x++) s.px(x,y,db);
            s.px(6,6,c); s.px(10,6,c);
            int[] xs={6,8,10};
            for(int i=0;i<xs.length;i++){
                int x=xs[i];
                for(int y=9;y<=14;y++){
                    s.px(x,y,db);
                    if(((y+i)%3)==0 && x+1<16) s.px(x+1,y,b);
                }
            }
            for(int y=9;y<=13;y++) for(int x=6;x<=9;x++) s.px(x,y,b);
            return s;
        }

        static PixelCanvas treeSentinel(){
            PixelCanvas s = new PixelCanvas(16,16);
            var y = NesPalette.c("YELLOW");
            var w = NesPalette.c("WHITE");
            var black = NesPalette.c("BLACK");
            for(int yy=4;yy<=12;yy++){
                for(int xx=4;xx<=11;xx++){
                    if(((xx+yy)%3)!=0) s.px(xx,yy,y);
                }
            }
            for(int yy=2;yy<=13;yy++) s.px(13,yy,w);
            s.px(12,6,y);
            for(int yy=3;yy<=12;yy++) s.px(4,yy,black);
            return s;
        }

        static PixelCanvas gelCube(){
            PixelCanvas s = new PixelCanvas(16,16);
            var cyan = NesPalette.c("CYAN");
            var blue = NesPalette.c("BLUE");
            var white = NesPalette.c("WHITE");
            for(int y=4;y<=13;y++) for(int x=4;x<=13;x++) s.px(x,y,cyan);
            for(int x=4;x<=13;x++){ s.px(x,4,blue); s.px(x,13,blue); }
            for(int y=4;y<=13;y++){ s.px(4,y,blue); s.px(13,y,blue); }
            s.px(8,8,white); s.px(9,8,white);
            s.px(8,9,white); s.px(9,9,white);
            s.px(8,10,white);
            return s;
        }
    }
}
