# hofstadter.py
# Advanced Python implementation utilizing iterative generation and type hinting.
# Designed for high-throughput sequence generation without hitting recursion limits.

from typing import Iterator, List, Tuple
import time
import sys

class HofstadterEngine:
    """
    Core engine for computing the Hofstadter Q-sequence.
    Uses an iterative bottom-up approach to maintain O(n) time complexity 
    and O(n) space complexity, avoiding the overhead of recursive memoization.
    """
    
    def __init__(self, sequence: List[int] = None):
        self._sequence: List[int] = sequence if sequence is not None else [0, 1, 1]
        
    @property
    def state(self) -> List[int]:
        return self._sequence

    def compute_to(self, n: int) -> int:
        """
        Computes the sequence up to the nth term iteratively.
        Returns the nth term.
        """
        if n < 1:
            raise ValueError("Sequence index must be a positive integer (n >= 1).")
            
        if n <= len(self._sequence) - 1:
            return self._sequence[n]
            
        # Extend the internal state array
        for i in range(len(self._sequence), n + 1):
            q_prev1 = self._sequence[i - 1]
            q_prev2 = self._sequence[i - 2]
            
            # The core Hofstadter Q recurrence relation
            val = self._sequence[i - q_prev1] + self._sequence[i - q_prev2]
            self._sequence.append(val)
            
        return self._sequence[n]

    def stream(self, start: int = 1, stop: int = None) -> Iterator[Tuple[int, int]]:
        """
        Generator that yields (index, value) tuples.
        Useful for memory-efficient processing of massive sequences.
        """
        idx = start
        while True:
            if stop is not None and idx > stop:
                break
            yield idx, self.compute_to(idx)
            idx += 1

def benchmark(depth: int) -> None:
    """CLI benchmark utility."""
    engine = HofstadterEngine()
    
    print(f"[*] Initializing Hofstadter Engine...")
    print(f"[*] Target depth: {depth}")
    
    start_time = time.perf_counter()
    result = engine.compute_to(depth)
    end_time = time.perf_counter()
    
    delta = (end_time - start_time) * 1000
    
    print(f"[+] Computation complete.")
    print(f"[+] Q({depth}) = {result}")
    print(f"[+] Execution time: {delta:.4f} ms")
    print(f"[+] Memory footprint: {sys.getsizeof(engine.state) / 1024:.2f} KB")

if __name__ == "__main__":
    # Default execution for demonstration
    target_n = 2500
    if len(sys.argv) > 1:
        try:
            target_n = int(sys.argv[1])
        except ValueError:
            print("Error: Argument must be an integer.")
            sys.exit(1)
            
    benchmark(target_n)
