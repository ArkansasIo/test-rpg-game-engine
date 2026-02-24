package com.neskit;

import java.awt.image.BufferedImage;
import java.awt.Color;

public final class PixelCanvas {
    private final BufferedImage img;

    public PixelCanvas(int w, int h){
        this.img = new BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB);
        // default transparent
    }

    public BufferedImage image(){ return img; }

    public void px(int x, int y, Color c){
        if(x<0||y<0||x>=img.getWidth()||y>=img.getHeight()) return;
        img.setRGB(x, y, c.getRGB());
    }

    public void fillRect(int x, int y, int w, int h, Color c){
        for(int yy=y; yy<y+h; yy++){
            for(int xx=x; xx<x+w; xx++){
                px(xx, yy, c);
            }
        }
    }

    public void blit(PixelCanvas src, int ox, int oy){
        BufferedImage s = src.image();
        for(int y=0; y<s.getHeight(); y++){
            for(int x=0; x<s.getWidth(); x++){
                int argb = s.getRGB(x,y);
                // alpha test
                if(((argb>>>24)&0xFF) == 0) continue;
                int dx = ox + x, dy = oy + y;
                if(dx<0||dy<0||dx>=img.getWidth()||dy>=img.getHeight()) continue;
                img.setRGB(dx, dy, argb);
            }
        }
    }
}
