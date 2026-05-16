export const DATE_SUITE = {
    name: 'date',
    description: 'Date command output',
    tests: [
        { input: 'date -d "2021-02-03 14:05:06" -f "%Y-%m-%d %H:%M:%S"', expected: '2021-02-03 14:05:06' },
        { input: 'date -d "2021/02/03 14:05:06" -f "%Y-%m-%d %H:%M:%S"', expected: '2021-02-03 14:05:06' },
        { input: 'date -d "02/03/2021 14:05:06" -f "%Y-%m-%d %H:%M:%S"', expected: '2021-02-03 14:05:06' },
        { input: 'date -d "2021-02-03" -f "%Y-%m-%d', expected: '2021-02-03' },
        { input: 'date -d "2021/02/03" -f "%Y-%m-%d', expected: '2021-02-03' },
        { input: 'date -d "02/03/2021" -f "%Y-%m-%d', expected: '2021-02-03' },
        { input: 'date -d "2021-02-03 14:05:06" -f "%Y"', expected: '2021' },
        { input: 'date -d "2021-02-03 14:05:06" -f "%m"', expected: '02' },
        { input: 'date -d "2021-02-03 14:05:06" -f "%d"', expected: '03' },
        { input: 'date -d "2021-02-03 14:05:06" -f "%H"', expected: '14' },
        { input: 'date -d "2021-02-03 14:05:06" -f "%M"', expected: '05' },
        { input: 'date -d "2021-02-03 14:05:06" -f "%S"', expected: '06' },
        { input: 'date -d "2021-02-03 14:05:06" -f "%F"', expected: '2021-02-03' },
        { input: 'date -d "2021-02-03 14:05:06" -f "%T"', expected: '14:05:06' },
        { input: 'date -d "2021-02-03 14:05:06" -f "%R"', expected: '14:05' },
        { input: 'date -d "2021-02-03 02:05:06" -f "%r"', expected: '02:05:06 AM' },
        { input: 'date -d "2021-02-03 14:05:06" -f "%r"', expected: '02:05:06 PM' },
        { input: 'date -d "2021-02-03 14:05:06" -f "%D"', expected: '02/03/21' },
    ]
}

export default DATE_SUITE
