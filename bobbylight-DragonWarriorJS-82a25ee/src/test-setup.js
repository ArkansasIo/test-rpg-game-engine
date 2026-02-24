import { vi } from 'vitest';
/**
 * Provides a guaranteed in-memory localStorage implementation for all test files.
 *
 * Node.js 22+ experimentally exposes localStorage as a native global backed by
 * sqlite. On some platforms (notably Ubuntu in CI), jsdom cannot override it,
 * which causes localStorage.clear() to be missing or non-functional. Explicitly
 * stubbing it here ensures consistent behaviour across all environments.
 *
 * With Node 25+ this might be removable if we update the tests to use
 * --localstorage-file
 */
class InMemoryStorage {
    constructor() {
        this.store = new Map();
    }
    get length() {
        return this.store.size;
    }
    clear() {
        this.store.clear();
    }
    getItem(key) {
        var _a;
        return (_a = this.store.get(key)) !== null && _a !== void 0 ? _a : null;
    }
    key(index) {
        var _a;
        return (_a = [...this.store.keys()][index]) !== null && _a !== void 0 ? _a : null;
    }
    removeItem(key) {
        this.store.delete(key);
    }
    setItem(key, value) {
        this.store.set(key, value);
    }
}
vi.stubGlobal('localStorage', new InMemoryStorage());
//# sourceMappingURL=test-setup.js.map