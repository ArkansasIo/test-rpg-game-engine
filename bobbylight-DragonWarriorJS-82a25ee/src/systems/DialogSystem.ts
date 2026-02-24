import type { DialogScript } from '../types/RpgTypes';

export class DialogSystem {

    private readonly scripts = new Map<string, DialogScript>();

    public constructor(scripts: DialogScript[]) {
        for (const script of scripts) {
            this.scripts.set(script.id, script);
        }
    }

    public getLines(scriptId: string): string[] {
        return this.scripts.get(scriptId)?.lines ?? [];
    }

    public hasScript(scriptId: string): boolean {
        return this.scripts.has(scriptId);
    }
}
