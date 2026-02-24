export type EquipmentMap<T> = Record<string, T>;

declare global {
    interface Window {
        showProceduralAssetGeneratorUI?: () => void;
    }
}

export {};
