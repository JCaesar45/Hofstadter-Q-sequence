# The Q-Matrix: Visualizing Self-Reference

I built this because standard implementations of the Hofstadter Q-sequence always felt like they were missing the point. Hofstadter didn't just give us a math puzzle; he gave us a mirror. The sequence looks back at itself to determine its next step. `Q(n) = Q(n−Q(n−1)) + Q(n−Q(n−2))`. It’s chaotic, it’s self-referential, and until you actually plot it in a phase space, it’s just a list of numbers.

This project is my attempt to bridge the gap between raw computation and visual intuition. The web interface doesn't just calculate the sequence; it maps `Q(n)` against `Q(n-1)`. When you watch the canvas render, you aren't just seeing numbers go up. You're watching a strange attractor form. You're seeing the ghost of the Fibonacci sequence trying to break out of a recursive loop.

## Architecture & Methodological Choices

I didn't want to write boilerplate. Every language implementation here solves the exact same problem, but I tailored the paradigms to fit the native strengths of each ecosystem.

*   **JavaScript / Canvas:** The browser is inherently single-threaded. If you ask it to calculate $n=100,000$ synchronously, the UI freezes, the glassmorphism stutters, and the illusion breaks. I implemented a chunked computation loop using `requestAnimationFrame`. It yields to the main thread every few hundred iterations, keeping the render pipeline at 60fps while the math grinds in the background.
*   **Python:** I avoided `functools.lru_cache` for the main engine. Recursion limits in Python are a pain, and the function call overhead for $10^5$ recursive steps is brutal. The `HofstadterEngine` class uses an iterative bottom-up approach, maintaining an internal state array. It’s $O(n)$ time and space, and it scales linearly without blowing the stack.
*   **TypeScript:** Went heavy on the functional paradigm here. Strict typing, immutable state transitions via `ReadonlyArray`, and a memoization wrapper. It’s overkill for a simple sequence, but it demonstrates how to enforce architectural purity in a codebase that might eventually need to integrate with a larger reactive framework.
*   **Java:** Modern Java (17+). I used a `record` for the return type to ensure the result is immutable and thread-safe. The core loop uses a flat `long[]` array. No `ArrayList`, no boxing, no `BigInteger` (since $Q(n) \approx n/2$, it fits comfortably in a primitive `long` up to the billions). It’s designed to be aggressively optimized by the HotSpot JIT compiler.

## The Aesthetic

The UI leans into a "luxurious cyberpunk" aesthetic. Deep blacks, glassmorphism panels, and a gold/amber accent palette. It’s meant to feel like you’re operating a piece of high-end, slightly dangerous scientific equipment. The typography pairs Inter for the UI with JetBrains Mono for the data readouts, creating a clear visual hierarchy between the human interface and the machine state.

## Running the Stack

1.  **Web Interface:** Just open `index.html` in a modern browser. No build step required. The JS is vanilla ES6+.
2.  **Python:** `python hofstadter.py 5000`
3.  **Java:** `javac HofstadterQ.java && java HofstadterQ`
4.  **TypeScript:** Run via `ts-node app.ts` or compile with `tsc`.

## References & Further Reading

If you want to understand the math behind the madness, you have to go back to the source. Hofstadter introduced this in his Pulitzer-winning work, and the sequence has been cataloged extensively since.

Hofstadter, D. R. (1979). *Gödel, Escher, Bach: An eternal golden braid*. Basic Books.

Sloane, N. J. A. (n.d.). Sequence A005185. In *The On-Line Encyclopedia of Integer Sequences*. Retrieved July 21, 2026, from https://oeis.org/A005185

Conway, J. H. (1986). *Problem 6366*. The American Mathematical Monthly, 93(6), 472–473. (Note: Conway's analysis of the Q-sequence's unpredictable behavior remains one of the definitive mathematical breakdowns of why this sequence defies simple closed-form expression).
