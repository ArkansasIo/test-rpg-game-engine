/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
import { DwGame } from './dw/DwGame';
import { LoadingState } from './dw/LoadingState';
import { addArchetypeGalleryButton } from './dw/ProceduralRpgAssetSystem';
// Register static image assets before game start
function registerStaticAssets(game: DwGame) {
    game.assets.addImage('title', 'res/title.png');
}
import { addArchetypeGalleryButton } from './dw/ProceduralRpgAssetSystem';


function getScaleAndSize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Maintain aspect ratio (17:15 tiles)
    const tileW = 17;
    const tileH = 15;
    const scaleW = Math.floor(w / tileW / 16);
    const scaleH = Math.floor(h / tileH / 16);
    const scale = Math.max(1, Math.min(scaleW, scaleH));
    return {
        scale,
        width: tileW * 16 * scale,
        height: tileH * 16 * scale,
    };
}



function startGame() {
    const { scale, width, height } = getScaleAndSize();
    const game = new DwGame({ parent: 'parent', scale, width, height, keyRefreshMillis: 300, targetFps: 60 });
    registerStaticAssets(game);
    game.setState(new LoadingState(game));
    game.start();
    window.addEventListener('resize', () => {
        const { width, height } = getScaleAndSize();
        game.canvas.width = width;
        game.canvas.height = height;
        game.render();
    });
    // Enable the archetype asset gallery button
    addArchetypeGalleryButton();
}

startGame();
