export const ECHO_SUITE = {
    name: 'echo',
    description: 'Echo command output',
    tests: [
        { input: 'echo hello', expected: 'hello' },
        { input: 'echo hello world', expected: 'hello world' },
        { input: 'echo "hello world"', expected: 'hello world' },
        { input: `echo 'hello world'`, expected: 'hello world' },
        { input: 'echo "hello" "world"', expected: 'hello world' },
        { input: 'echo', expected: '' },
        { input: 'echo multiple spaces', expected: 'multiple spaces' },
        { input: 'echo "preserved spaces"', expected: 'preserved spaces' },
        { input: 'echo "with \\"quotes\\""', expected: 'with "quotes"' },
        { input: 'echo one two three', expected: 'one two three' },
    ]
}

export default ECHO_SUITE
