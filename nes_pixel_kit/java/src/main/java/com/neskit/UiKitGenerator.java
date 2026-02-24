package com.neskit;

import java.awt.Color;

public final class UiKitGenerator {

    public PixelCanvas window(int w, int h){
        PixelCanvas c = new PixelCanvas(w,h);
        Color white = NesPalette.c("WHITE");
        Color cyan = NesPalette.c("CYAN");
        Color db = NesPalette.c("DARK_BLUE");

        // border
        for(int x=0;x<w;x++){ c.px(x,0,white); c.px(x,h-1,white); }
        for(int y=0;y<h;y++){ c.px(0,y,white); c.px(w-1,y,white); }
        // fill
        for(int y=1;y<h-1;y++) for(int x=1;x<w-1;x++) c.px(x,y,db);
        // corners
        c.px(0,0,cyan); c.px(w-1,0,cyan); c.px(0,h-1,cyan); c.px(w-1,h-1,cyan);
        return c;
    }

    public PixelCanvas cursor(){
        PixelCanvas c = new PixelCanvas(8,8);
        Color white = NesPalette.c("WHITE");
        Color black = NesPalette.c("BLACK");
        for(int y=0;y<8;y++){
            for(int x=0;x<=y && x<8;x++) c.px(x,y,white);
            c.px(0,y,black);
        }
        return c;
    }

    public PixelCanvas heart(){
        PixelCanvas c = new PixelCanvas(8,8);
        Color red = NesPalette.c("RED");
        String[] bits = {
                "01100110",
                "11111111",
                "11111111",
                "01111110",
                "00111100",
                "00011000",
                "00000000",
                "00000000"
        };
        for(int y=0;y<8;y++){
            for(int x=0;x<8;x++){
                if(bits[y].charAt(x)=='1') c.px(x,y,red);
            }
        }
        return c;
    }
}
