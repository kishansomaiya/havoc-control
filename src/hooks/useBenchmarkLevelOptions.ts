import { BENCHMARK_LEVEL_TITLES, GLOBAL_BENCHMARK_LEVEL_TITLE } from '../const';
import { useMemo } from 'react';
import { BenchmarkLevel, GLOBAL_BENCHMARK_LEVEL } from '../types';
import { ScoresResultSetOptions } from '../api/openapi/auto-generated';

const GLOBAL_OPTION = {
    id: GLOBAL_BENCHMARK_LEVEL,
    title: GLOBAL_BENCHMARK_LEVEL_TITLE,
};

export const useBenchmarkLevelOptions = (
    resultSetOptions: ScoresResultSetOptions
): Array<{
    id: BenchmarkLevel | string;
    title: string;
}> => {
    return useMemo(() => {
        const definedBenchmarkLevels = Object.entries(BENCHMARK_LEVEL_TITLES)
            .map(([id, title]) => ({
                id: id as BenchmarkLevel,
                title,
            }))
            .filter(({ id }) => resultSetOptions.benchmarkLevels?.includes(id));

        return [GLOBAL_OPTION, ...definedBenchmarkLevels];
    }, [resultSetOptions]);
};
