import { Chunk } from "../chunk";

import { WorldProvider } from "./provider";

import type { Dimension } from "../world";

/**
 * The internal provider is a basic provider that stores chunks in memory.
 * This provider does not save or load chunks from disk, it is used for testing and development.
 */
class InternalProvider extends WorldProvider {
	public static identifier = "internal";

	/**
	 * The chunks stored in the provider.
	 */
	public readonly chunks: Map<string, Map<bigint, Chunk>> = new Map();

	public override readChunk(
		cx: number,
		cz: number,
		dimension: Dimension
	): Chunk {
		// Check if the chunks contain the dimension.
		if (!this.chunks.has(dimension.identifier)) {
			this.chunks.set(dimension.identifier, new Map());
		}

		// Get the dimension chunks.
		const chunks = this.chunks.get(dimension.identifier) as Map<bigint, Chunk>;

		// Check if the chunks contain the chunk hash.
		if (!chunks.has(Chunk.getHash(cx, cz))) {
			chunks.set(
				Chunk.getHash(cx, cz),
				dimension.generator.apply(new Chunk(cx, cz, this.hashes))
			);
		}

		// Return the chunk.
		return chunks.get(Chunk.getHash(cx, cz)) as Chunk;
	}

	public override writeChunk(chunk: Chunk, dimension: Dimension): void {
		// Check if the chunks contain the dimension.
		if (!this.chunks.has(dimension.identifier)) {
			this.chunks.set(dimension.identifier, new Map());
		}

		// Get the dimension chunks.
		const chunks = this.chunks.get(dimension.identifier) as Map<bigint, Chunk>;

		// Set the chunk.
		chunks.set(Chunk.getHash(chunk.x, chunk.z), chunk);
	}
}

export { InternalProvider };
