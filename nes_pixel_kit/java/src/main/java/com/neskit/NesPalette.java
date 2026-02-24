package com.neskit;

import java.awt.Color;
import java.util.Map;

public final class NesPalette {
    private NesPalette(){}

    // NES-flavored subset palette (not hardware-exact)
    public static final Map<String, Color> P = Map.ofEntries(
            Map.entry("BLACK", new Color(0,0,0,255)),
            Map.entry("WHITE", new Color(248,248,248,255)),
            Map.entry("LIGHT_GRAY", new Color(188,188,188,255)),
            Map.entry("DARK_GRAY", new Color(124,124,124,255)),
            Map.entry("RED", new Color(168,0,32,255)),
            Map.entry("ORANGE", new Color(248,120,0,255)),
            Map.entry("YELLOW", new Color(248,216,120,255)),
            Map.entry("GREEN", new Color(0,168,0,255)),
            Map.entry("DARK_GREEN", new Color(0,120,0,255)),
            Map.entry("BLUE", new Color(0,88,248,255)),
            Map.entry("DARK_BLUE", new Color(0,40,160,255)),
            Map.entry("CYAN", new Color(0,184,248,255)),
            Map.entry("PURPLE", new Color(104,0,184,255)),
            Map.entry("BROWN", new Color(124,72,0,255)),
            Map.entry("TAN", new Color(216,176,112,255))
    );

    public static Color c(String name){
        return P.get(name);
    }
}
