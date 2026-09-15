export const DATE_SUITE = {
    name: 'date',
    description: 'Date command output',
    tests: [
        { input: 'date -d "2021-02-03 14:05:06" "+%Y-%m-%d %H:%M:%S"', expected: '2021-02-03 14:05:06' },
        { input: 'date -d "2021/02/03 14:05:06" "+%Y-%m-%d %H:%M:%S"', expected: '2021-02-03 14:05:06' },
        { input: 'date -d "02/03/2021 14:05:06" "+%Y-%m-%d %H:%M:%S"', expected: '2021-02-03 14:05:06' },
        { input: 'date -d "2021-02-03" +%Y-%m-%d', expected: '2021-02-03' },
        { input: 'date -d "2021/02/03" +%Y-%m-%d', expected: '2021-02-03' },
        { input: 'date -d "02/03/2021" +%Y-%m-%d', expected: '2021-02-03' },
        { input: 'date -d "2021-02-03 14:05:06" +%Y', expected: '2021' },
        { input: 'date -d "2021-02-03 14:05:06" +%m', expected: '02' },
        { input: 'date -d "2021-02-03 14:05:06" +%d', expected: '03' },
        { input: 'date -d "2021-02-03 14:05:06" +%H', expected: '14' },
        { input: 'date -d "2021-02-03 14:05:06" +%M', expected: '05' },
        { input: 'date -d "2021-02-03 14:05:06" +%S', expected: '06' },
        { input: 'date -d "2021-02-03 14:05:06" +%F', expected: '2021-02-03' },
        { input: 'date -d "2021-02-03 14:05:06" +%T', expected: '14:05:06' },
        { input: 'date -d "2021-02-03 14:05:06" +%R', expected: '14:05' },
        { input: 'date -d "2021-02-03 02:05:06" +%r', expected: '02:05:06 AM' },
        { input: 'date -d "2021-02-03 14:05:06" +%r', expected: '02:05:06 PM' },
        { input: 'date -d "2021-02-03 14:05:06" +%D', expected: '02/03/21' },
    ]
}

export default DATE_SUITE