package com.neskit;

import java.awt.Color;

public final class SpriteGenerator {

    public PixelCanvas knight(){
        PixelCanvas s = new PixelCanvas(16,16);
        Color black = NesPalette.c("BLACK");
        Color dg = NesPalette.c("DARK_GRAY");
        Color lg = NesPalette.c("LIGHT_GRAY");
        Color red = NesPalette.c("RED");
        Color white = NesPalette.c("WHITE");

        // helmet
        for(int y=2;y<=6;y++) for(int x=5;x<=10;x++) s.px(x,y,dg);
        for(int x=6;x<=9;x++) s.px(x,4,black);
        // plume
        for(int y=1;y<=4;y++) s.px(8,y,red);
        s.px(8,0,red);

        // body
        for(int y=7;y<=11;y++) for(int x=5;x<=10;x++) s.px(x,y,lg);
        for(int x=5;x<=10;x++) s.px(x,11,dg);

        // legs
        for(int y=12;y<=14;y++){ s.px(6,y,dg); s.px(9,y,dg); }
        s.px(6,15,black); s.px(9,15,black);

        // arms
        for(int y=8;y<=10;y++){ s.px(4,y,dg); s.px(11,y,dg); }

        // sword
        for(int y=6;y<=11;y++) s.px(13,y,white);
        s.px(12,10,dg); s.px(14,10,dg);

        return s;
    }

    public PixelCanvas mage(){
        PixelCanvas s = new PixelCanvas(16,16);
        Color black = NesPalette.c("BLACK");
        Color purple = NesPalette.c("PURPLE");
        Color blue = NesPalette.c("BLUE");
        Color yellow = NesPalette.c("YELLOW");
        Color brown = NesPalette.c("BROWN");
        // hat
        for(int y=1;y<=5;y++){
            int x0 = 8-(y+1), x1 = 8+(y+1);
            for(int x=x0;x<=x1;x++) s.px(x,y,purple);
        }
        s.px(8,0,purple);
        // face
        for(int y=6;y<=7;y++) for(int x=7;x<=9;x++) s.px(x,y,yellow);
        s.px(7,7,black); s.px(9,7,black);
        // robe
        for(int y=8;y<=14;y++) for(int x=5;x<=11;x++) s.px(x,y,blue);
        for(int y=9;y<=13;y++){ s.px(5,y,purple); s.px(11,y,purple); }
        for(int x=6;x<=10;x++) s.px(x,14,purple);
        // staff
        for(int y=7;y<=14;y++) s.px(3,y,brown);
        s.px(3,6,yellow); s.px(2,6,yellow); s.px(4,6,yellow);
        return s;
    }

    public PixelCanvas rogue(){
        PixelCanvas s = new PixelCanvas(16,16);
        Color black = NesPalette.c("BLACK");
        Color dg = NesPalette.c("DARK_GREEN");
        Color g = NesPalette.c("GREEN");
        Color tan = NesPalette.c("TAN");
        Color brown = NesPalette.c("BROWN");
        Color white = NesPalette.c("WHITE");
        Color dgray = NesPalette.c("DARK_GRAY");

        for(int y=2;y<=6;y++) for(int x=5;x<=10;x++) s.px(x,y,dg);
        for(int y=4;y<=5;y++) for(int x=7;x<=9;x++) s.px(x,y,tan);
        s.px(7,5,black); s.px(9,5,black);

        for(int y=7;y<=11;y++) for(int x=5;x<=10;x++) s.px(x,y,g);
        for(int x=6;x<=9;x++) s.px(x,11,brown);

        for(int y=12;y<=14;y++){ s.px(6,y,dg); s.px(9,y,dg); }
        s.px(6,15,black); s.px(9,15,black);

        // dagger
        s.px(12,10,white); s.px(13,9,white); s.px(11,11,dgray);
        return s;
    }

    public PixelCanvas slime(){
        PixelCanvas s = new PixelCanvas(16,16);
        Color black = NesPalette.c("BLACK");
        Color cyan = NesPalette.c("CYAN");
        Color blue = NesPalette.c("BLUE");
        Color white = NesPalette.c("WHITE");

        int cx=8, cy=10;
        for(int y=5;y<=14;y++){
            for(int x=3;x<=12;x++){
                int dx=x-cx, dy=y-cy;
                if(dx*dx+dy*dy <= 34) s.px(x,y,cyan);
            }
        }
        // outline: cheap neighbor check
        for(int y=4;y<15;y++){
            for(int x=2;x<14;x++){
                int a = (s.image().getRGB(x,y)>>>24)&0xFF;
                if(a==0) continue;
                boolean edge=false;
                int[][] n={{-1,0},{1,0},{0,-1},{0,1}};
                for(int[] d:n){
                    int nx=x+d[0], ny=y+d[1];
                    if(nx<0||ny<0||nx>=16||ny>=16){ edge=true; break; }
                    int na=(s.image().getRGB(nx,ny)>>>24)&0xFF;
                    if(na==0){ edge=true; break; }
                }
                if(edge) s.px(x,y,blue);
            }
        }
        s.px(6,10,black); s.px(10,10,black);
        s.px(5,8,white); s.px(6,8,white);
        return s;
    }
}
