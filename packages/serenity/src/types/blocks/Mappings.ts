interface RawBlock {
	name: string;
	states: Record<string, number | string>;
	version: number;
}

interface MappedBlock {
	identifier: string;
	permutations: MappedBlockPermutation[];
	version: number;
}

interface MappedBlockPermutation {
	runtimeId: number;
	state: Record<string, number | string>;
}

export type { RawBlock, MappedBlock, MappedBlockPermutation };