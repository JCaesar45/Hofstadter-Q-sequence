/**
 * Calculates the nth term of the Hofstadter Q sequence.
 * @param {number} n - The position in the sequence (n >= 1).
 * @returns {number} The nth integer of the Hofstadter Q sequence.
 */
function hofstadterQ(n) {
    // Base cases
    if (n === 1 || n === 2) {
        return 1;
    }
    
    // Array to memoize the sequence. 
    // Index 0 is unused, index 1 and 2 are initialized to 1.
    const q = [0, 1, 1];
    
    // Iteratively build the sequence up to n
    for (let i = 3; i <= n; i++) {
        q[i] = q[i - q[i - 1]] + q[i - q[i - 2]];
    }
    
    return q[n];
}
