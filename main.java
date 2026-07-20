// HofstadterQ.java
// Modern Java (17+) implementation utilizing Records for immutable data carriers
// and optimized primitive arrays for maximum throughput.

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

public class HofstadterQ {

    /**
     * Immutable record to hold the sequence result and metadata.
     * Java records provide concise syntax for data-only classes.
     */
    public record SequenceResult(long[] sequence, int targetN, long nthValue, long executionTimeNanos) {
        public long getQ(int index) {
            if (index < 1 || index > targetN) {
                throw new IndexOutOfBoundsException("Index out of sequence bounds: " + index);
            }
            return sequence[index];
        }
    }

    /**
     * Computes the Hofstadter Q sequence up to n.
     * Uses a flat long[] array to prevent boxing/unboxing overhead 
     * and ensure contiguous memory allocation for CPU cache efficiency.
     *
     * @param n The target depth of the sequence.
     * @return A SequenceResult record containing the computed data.
     */
    public static SequenceResult compute(int n) {
        if (n < 1) {
            throw new IllegalArgumentException("n must be >= 1");
        }

        long startTime = System.nanoTime();
        
        // Base cases handling
        if (n == 1 || n == 2) {
            long[] base = {0, 1, 1};
            return new SequenceResult(base, n, 1, System.nanoTime() - startTime);
        }

        long[] q = new long[n + 1];
        q[1] = 1;
        q[2] = 1;

        // Core iterative loop. 
        // Kept strictly to primitive operations for maximum JIT optimization.
        for (int i = 3; i <= n; i++) {
            int idx1 = i - (int) q[i - 1];
            int idx2 = i - (int) q[i - 2];
            q[i] = q[idx1] + q[idx2];
        }

        long duration = System.nanoTime() - startTime;
        return new SequenceResult(q, n, q[n], duration);
    }

    public static void main(String[] args) {
        System.out.println("Initializing Hofstadter Q-Sequence Engine (Java)...");
        
        int[] testDepths = {1000, 1500, 2000, 2500, 10000};

        for (int depth : testDepths) {
            SequenceResult result = compute(depth);
            
            System.out.printf("Depth: %5d | Q(n): %5d | Time: %6.3f ms%n", 
                    result.targetN(), 
                    result.nthValue(), 
                    result.executionTimeNanos() / 1_000_000.0);
        }
    }
}
