// import { BlockIdentifier } from "./enums";

import { BlockIdentifier } from "./enums";
import { BlockState } from "./types";

import type { BlockPermutation } from "./permutation";

class BlockType<T extends keyof BlockState = keyof BlockState> {
	/**
	 * A collective registry of all block types.
	 */
	public static readonly types = new Map<string, BlockType>();

	/**
	 * The identifier of the block type.
	 */
	public readonly identifier: T;

	/**
	 * Whether the block type is loggable.
	 */
	public readonly loggable: boolean;

	/**
	 * The default components of the block type.
	 */
	public readonly components: Array<string>;

	/**
	 * The default permutations of the block type.
	 */
	public readonly permutations: Array<BlockPermutation>;

	/**
	 * Create a new block type.
	 * @param identifier The identifier of the block type.
	 * @param loggable Whether the block type is loggable.
	 * @param components The default components of the block type.
	 * @param permutations The default permutations of the block type.
	 */
	public constructor(
		identifier: T,
		loggable: boolean,
		components?: Array<string>,
		permutations?: Array<BlockPermutation>
	) {
		this.identifier = identifier;
		this.loggable = loggable;
		this.components = components ?? [];
		this.permutations = permutations ?? [];
	}

	/**
	 * Get the permutation of the block type.
	 * @param state The state of the block type.
	 */
	public getPermutation(state?: BlockState[T]): BlockPermutation<T> {
		// Iterate over the permutations.
		for (const permutation of this.permutations) {
			// Check if the permutation matches the state.
			if (!state || permutation.matches(state as BlockState[T])) {
				return permutation as BlockPermutation<T>;
			}
		}

		// Return the default permutation if the state is not found.
		return this.permutations[0] as BlockPermutation<T>;
	}

	/**
	 * Get the block type from the registry.
	 */
	public static get<T extends keyof BlockState>(
		identifier: T
	): BlockType<T> | null {
		// Get the block type from the registry.
		const type = BlockType.types.get(identifier as BlockIdentifier);

		// Check if the block type exists.
		if (!type) {
			return null;
		}

		// Return the block type.
		return type as BlockType<T>;
	}

	/**
	 * Get all block types from the registry.
	 */
	public static getAll(): Array<BlockType> {
		return [...BlockType.types.values()];
	}
}

export { BlockType };
