package com.neskit;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;

public final class ImageIOUtil {
    private ImageIOUtil(){}

    public static void savePng(BufferedImage img, File out) throws IOException {
        out.getParentFile().mkdirs();
        ImageIO.write(img, "PNG", out);
    }
}
