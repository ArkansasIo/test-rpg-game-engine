package com.neskit;

import java.awt.Color;

public final class TileGenerator {

    public PixelCanvas grass(int variant){
        PixelCanvas t = new PixelCanvas(8,8);
        Color g = NesPalette.c("GREEN");
        Color dg = NesPalette.c("DARK_GREEN");
        Color y = NesPalette.c("YELLOW");

        t.fillRect(0,0,8,8,g);
        for(int yy=0;yy<8;yy++){
            for(int xx=0;xx<8;xx++){
                if(((xx+yy+variant)%4)==0) t.px(xx,yy,dg);
            }
        }
        for(int xx=0;xx<8;xx+=2) t.px(xx,0,y);
        return t;
    }

    public PixelCanvas stoneFloor(int v){
        PixelCanvas t = new PixelCanvas(8,8);
        Color dg = NesPalette.c("DARK_GRAY");
        Color lg = NesPalette.c("LIGHT_GRAY");
        Color black = NesPalette.c("BLACK");

        t.fillRect(0,0,8,8,dg);
        for(int y=0;y<8;y++){
            for(int x=0;x<8;x++){
                if(((x+y+v)%5)==0) t.px(x,y,lg);
            }
        }
        for(int x=1;x<=6;x++){
            if(((x+v)%3)==0) t.px(x,4,black);
        }
        return t;
    }

    public PixelCanvas wall(int v){
        PixelCanvas t = new PixelCanvas(8,8);
        Color dg = NesPalette.c("DARK_GRAY");
        Color black = NesPalette.c("BLACK");
        t.fillRect(0,0,8,8,dg);

        for(int y=0;y<8;y++){ t.px(0,y,black); t.px(7,y,black); }
        for(int x=0;x<8;x++){ t.px(x,0,black); t.px(x,7,black); }
        for(int y: new int[]{3,5}) for(int x=1;x<=6;x++) t.px(x,y,black);

        if(v%2==0){
            for(int y=1;y<=2;y++) t.px(3,y,black);
            t.px(5,4,black);
        }else{
            for(int y=1;y<=2;y++) t.px(5,y,black);
            t.px(3,4,black);
        }
        return t;
    }

    public PixelCanvas water(int frame){
        PixelCanvas t = new PixelCanvas(8,8);
        Color b = NesPalette.c("BLUE");
        Color c = NesPalette.c("CYAN");
        Color w = NesPalette.c("WHITE");

        t.fillRect(0,0,8,8,b);
        for(int x=0;x<8;x++){
            int y = (x*2 + frame) % 8;
            t.px(x,y,c);
        }
        for(int x=0;x<8;x+=2){
            t.px(x,(x+frame)%8,w);
        }
        return t;
    }

    public PixelCanvas uiFrameTile(){
        PixelCanvas t = new PixelCanvas(8,8);
        Color db = NesPalette.c("DARK_BLUE");
        Color w = NesPalette.c("WHITE");
        Color c = NesPalette.c("CYAN");
        t.fillRect(0,0,8,8,db);
        for(int x=0;x<8;x++){ t.px(x,0,w); t.px(x,7,w); }
        for(int y=0;y<8;y++){ t.px(0,y,w); t.px(7,y,w); }
        t.px(0,0,c); t.px(7,0,c); t.px(0,7,c); t.px(7,7,c);
        return t;
    }
}
