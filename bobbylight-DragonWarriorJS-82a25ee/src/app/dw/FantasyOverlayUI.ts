export interface OverlayPanelLayout {
    x: number;
    y: number;
    width: number;
    height: number;
    bodyX: number;
    bodyY: number;
    bodyWidth: number;
    bodyHeight: number;
}

const THEME = {
    bgTop: '#17110b',
    bgBottom: '#090c14',
    border: '#b7934f',
    borderDark: '#4b3719',
    text: '#f1e2bd',
    mutedText: '#b7a27a',
    accent: '#d2b46b',
    selectionFill: 'rgba(177, 132, 58, 0.35)',
    barFill: 'rgba(8, 12, 20, 0.9)',
    paneFill: 'rgba(17, 24, 38, 0.72)',
    paneBorder: 'rgba(194, 158, 92, 0.65)',
};

export function drawFantasyBackdrop(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(23, 17, 11, 0.86)');
    gradient.addColorStop(1, 'rgba(4, 7, 14, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

export function drawFantasyPanel(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    title: string,
): OverlayPanelLayout {
    const panelGradient = ctx.createLinearGradient(0, y, 0, y + height);
    panelGradient.addColorStop(0, THEME.bgTop);
    panelGradient.addColorStop(1, THEME.bgBottom);
    ctx.fillStyle = panelGradient;
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = THEME.borderDark;
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);
    ctx.strokeStyle = THEME.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    const headerH = 34;
    const headerGradient = ctx.createLinearGradient(0, y, 0, y + headerH);
    headerGradient.addColorStop(0, 'rgba(59, 42, 22, 0.92)');
    headerGradient.addColorStop(1, 'rgba(29, 23, 17, 0.92)');
    ctx.fillStyle = headerGradient;
    ctx.fillRect(x + 2, y + 2, width - 4, headerH);
    ctx.strokeStyle = '#8f6d38';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 8, y + headerH + 2);
    ctx.lineTo(x + width - 8, y + headerH + 2);
    ctx.stroke();

    ctx.font = 'bold 18px Georgia';
    ctx.fillStyle = THEME.accent;
    ctx.fillText(title, x + 14, y + 24);

    return {
        x,
        y,
        width,
        height,
        bodyX: x + 16,
        bodyY: y + headerH + 14,
        bodyWidth: width - 32,
        bodyHeight: height - headerH - 26,
    };
}

export function drawPane(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    title?: string,
) {
    ctx.fillStyle = THEME.paneFill;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = THEME.paneBorder;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    if (title) {
        ctx.font = 'bold 12px Georgia';
        ctx.fillStyle = THEME.accent;
        ctx.fillText(title, x + 8, y + 14);
        ctx.strokeStyle = 'rgba(194, 158, 92, 0.45)';
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 18);
        ctx.lineTo(x + width - 8, y + 18);
        ctx.stroke();
    }
}

export function drawTabStrip(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    labels: string[],
    selected: number,
) {
    let ox = x;
    ctx.font = 'bold 12px Georgia';
    for (let i = 0; i < labels.length; i++) {
        const w = Math.max(68, ctx.measureText(labels[i]).width + 20);
        const active = i === selected;
        ctx.fillStyle = active ? 'rgba(188, 145, 75, 0.35)' : 'rgba(24, 30, 44, 0.88)';
        ctx.fillRect(ox, y, w, 22);
        ctx.strokeStyle = active ? '#c39a59' : 'rgba(137, 113, 74, 0.75)';
        ctx.strokeRect(ox, y, w, 22);
        ctx.fillStyle = active ? '#f6e5c0' : '#bea57a';
        ctx.fillText(labels[i], ox + 10, y + 15);
        ox += w + 6;
    }
}

export function drawMenuChrome(
    ctx: CanvasRenderingContext2D,
    labels: string[],
    activeLabel: string | null,
    width: number,
) {
    ctx.fillStyle = THEME.barFill;
    ctx.fillRect(0, 0, width, 42);
    ctx.strokeStyle = THEME.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 41);
    ctx.lineTo(width, 41);
    ctx.stroke();

    ctx.font = 'bold 15px Georgia';
    let x = 14;
    for (const label of labels) {
        const itemW = Math.max(78, ctx.measureText(label).width + 22);
        if (activeLabel === label) {
            ctx.fillStyle = 'rgba(195, 147, 67, 0.28)';
            ctx.fillRect(x - 6, 8, itemW, 26);
            ctx.strokeStyle = '#caa866';
            ctx.strokeRect(x - 6, 8, itemW, 26);
            ctx.fillStyle = '#f6e3b8';
        } else {
            ctx.fillStyle = THEME.mutedText;
        }
        ctx.fillText(label, x, 26);
        x += itemW + 8;
    }
}

export function drawFantasyLine(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    selected = false,
    tone: 'normal' | 'muted' | 'accent' = 'normal',
) {
    if (selected) {
        const w = ctx.measureText(text).width + 12;
        ctx.fillStyle = THEME.selectionFill;
        ctx.fillRect(x - 6, y - 14, w, 20);
        ctx.strokeStyle = 'rgba(215, 171, 99, 0.55)';
        ctx.strokeRect(x - 6, y - 14, w, 20);
    }

    if (tone === 'accent') {
        ctx.fillStyle = THEME.accent;
    } else if (tone === 'muted') {
        ctx.fillStyle = THEME.mutedText;
    } else {
        ctx.fillStyle = THEME.text;
    }
    ctx.fillText(text, x, y);
}
