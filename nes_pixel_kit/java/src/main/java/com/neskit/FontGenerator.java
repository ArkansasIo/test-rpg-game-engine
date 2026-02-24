package com.neskit;

import java.awt.*;
import java.awt.image.BufferedImage;

public final class FontGenerator {

    // Generates an 8x8 ASCII sheet (chars 32..127) using Java's default font then pixel-quantizes.
    // For a real NES project, swap this for a handcrafted bitmap font.
    public PixelCanvas asciiSheet(){
        PixelCanvas sheet = new PixelCanvas(16*8, 6*8);
        Font f = new Font(Font.MONOSPACED, Font.PLAIN, 12);
        for(int i=32;i<128;i++){
            char ch = (char)i;
            PixelCanvas glyph = rasterizeChar(ch, f);
            int idx = i-32;
            int col = idx % 16;
            int row = idx / 16;
            sheet.blit(glyph, col*8, row*8);
        }
        return sheet;
    }

    private PixelCanvas rasterizeChar(char ch, Font font){
        // render big then downscale to 8x8 by nearest
        BufferedImage big = new BufferedImage(16,16,BufferedImage.TYPE_BYTE_GRAY);
        Graphics2D g = big.createGraphics();
        g.setColor(Color.BLACK);
        g.fillRect(0,0,16,16);
        g.setColor(Color.WHITE);
        g.setFont(font);
        g.drawString(String.valueOf(ch), 1, 12);
        g.dispose();

        BufferedImage small = new BufferedImage(8,8,BufferedImage.TYPE_BYTE_GRAY);
        Graphics2D g2 = small.createGraphics();
        g2.drawImage(big, 0,0,8,8, null);
        g2.dispose();

        PixelCanvas out = new PixelCanvas(8,8);
        Color white = NesPalette.c("WHITE");
        for(int y=0;y<8;y++){
            for(int x=0;x<8;x++){
                int v = small.getRaster().getSample(x,y,0);
                if(v>80) out.px(x,y,white);
            }
        }
        return out;
    }
}
