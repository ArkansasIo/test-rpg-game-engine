package com.neskit;

public final class SheetBuilder {
    private SheetBuilder(){}

    public static PixelCanvas makeSheet(int cols, int rows, int cellW, int cellH){
        return new PixelCanvas(cols*cellW, rows*cellH);
    }
}
