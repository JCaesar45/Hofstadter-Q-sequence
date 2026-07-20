// app.ts
# /// script
# dependencies = []
# ///

// Strict TypeScript implementation focusing on immutable state transitions 
// and functional paradigms. Utilizes advanced generics and readonly types.

interface SequenceState {
    readonly terms: ReadonlyArray<number>;
    readonly currentIndex: number;
}

type QSequenceGenerator = (n: number) => SequenceState;

/**
 * Pure function to generate the Hofstadter Q sequence state up to n.
 * Avoids side effects by returning a new state object rather than mutating.
 */
const generateQSequence: QSequenceGenerator = (n: number): SequenceState => {
    if (n < 1) {
        throw new RangeError("Domain error: n must be >= 1");
    }

    if (n === 1 || n === 2) {
        return { terms: [0, 1, 1], currentIndex: n };
    }

    // Pre-allocate typed array for performance in TS/JS environments
    const terms = new Array<number>(n + 1);
    terms[1] = 1;
    terms[2] = 1;

    for (let i = 3; i <= n; i++) {
        const offset1 = terms[i - 1];
        const offset2 = terms[i - 2];
        
        // TypeScript ensures array bounds logic is respected at compile time 
        // if strictNullChecks and noImplicitAny are enabled.
        terms[i] = terms[i - offset1] + terms[i - offset2];
    }

    return Object.freeze({
        terms: Object.freeze(terms),
        currentIndex: n
    });
};

/**
 * Higher-order function to memoize sequence generation for repeated lookups.
 */
const createMemoizedEngine = () => {
    const cache = new Map<number, SequenceState>();

    return (n: number): SequenceState => {
        if (cache.has(n)) {
            return cache.get(n)!;
        }
        
        // Optimization: If we have a cached state for a smaller n, we could 
        // theoretically extend it, but for pure functional purity, we recompute 
        // or we implement a progressive cache. Let's keep it simple and robust.
        const state = generateQSequence(n);
        cache.set(n, state);
        return state;
    };
};

// Execution context
const engine = createMemoizedEngine();

try {
    const testCases: number[] = [1000, 1500, 2000, 2500];
    
    console.log("=== Hofstadter Q-Sequence Engine (TypeScript) ===");
    
    for (const n of testCases) {
        const state = engine(n);
        console.log(`Q(${n}) => ${state.terms[n]}`);
    }
} catch (error) {
    if (error instanceof Error) {
        console.error(`Execution failed: ${error.message}`);
    }
}

export { generateQSequence, createMemoizedEngine, SequenceState };
