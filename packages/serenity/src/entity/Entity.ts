import type { MetadataDictionary, Vector3f, MetadataFlags } from '@serenityjs/bedrock-protocol';
import { MetadataKey, MetadataType } from '@serenityjs/bedrock-protocol';
import type { Dimension, Item } from '../world/index.js';
import { EntityInventory } from './Inventory.js';

let RUNTIME_ID = 1n;

interface EntityMetadata {
	flag?: boolean;
	type: MetadataType;
	value: bigint | boolean | number | string;
}

class Entity {
	public readonly runtimeId: bigint;
	public readonly uniqueId: bigint;
	public readonly identifier: string;
	public readonly dimension: Dimension; // Should we not store the dimension in the entity? Not sure.
	public readonly position: Vector3f;
	public readonly velocity: Vector3f;
	public readonly rotation: Vector3f;
	public readonly metadata: Map<MetadataFlags | MetadataKey, EntityMetadata>;
	public readonly properties: Map<string, bigint | number | string>;
	public readonly inventory: EntityInventory;

	public constructor(identifier: string, dimension: Dimension, uniqueId?: bigint) {
		this.runtimeId = RUNTIME_ID++;
		this.uniqueId = uniqueId ?? BigInt.asIntN(64, BigInt(Math.floor((Math.random() * 256) ^ Number(this.runtimeId))));
		this.identifier = identifier;
		this.dimension = dimension;
		this.position = { x: 0, y: 0, z: 0 };
		this.velocity = { x: 0, y: 0, z: 0 };
		this.rotation = { x: 0, y: 0, z: 0 };
		this.metadata = new Map();
		this.properties = new Map();
		this.inventory = new EntityInventory(this);
	}

	/**
	 * Gets the metadata value from the metadata map.
	 *
	 * @returns The metadata dictionary.
	 */
	public getMetadataDictionary(): MetadataDictionary[] {
		return [...this.metadata.entries()].map(([key, value]) => {
			return {
				key: value.flag ? MetadataKey.Flags : (key as MetadataKey),
				type: value.type,
				value: value.value,
				flag: value.flag ? (key as MetadataFlags) : undefined,
			};
		});
	}

	/**
	 * The variant of the entity.
	 */
	public get variant(): number {
		// Get the variant from the metadata.
		const varint = this.metadata.get(MetadataKey.Variant);

		// Return 0 if the varint is null.
		if (!varint) return Number();

		// Return the varint as a number.
		return varint.value as number;
	}

	/**
	 * Set the variant of the entity.
	 */
	public set variant(value: number) {
		// Set the variant in the metadata.
		this.metadata.set(MetadataKey.Variant, { type: MetadataType.Int, value });

		// Send the metadata to the world.
		this.dimension.updateEntity(this);
	}

	/**
	 * The name tag of the entity.
	 */
	public get nametag(): string {
		// Get the name tag from the metadata.
		const name = this.metadata.get(MetadataKey.Nametag);

		// Return an empty string if the name is null.
		if (!name) return String();

		// Return the name as a string.
		return name.value as string;
	}

	/**
	 * Set the name tag of the entity.
	 */
	public set nametag(value: string) {
		// Set the name tag in the metadata.
		this.metadata.set(MetadataKey.Nametag, { type: MetadataType.String, value });

		// Send the metadata to the world.
		this.dimension.updateEntity(this);
	}

	/**
	 * The scale of the entity.
	 */
	public get scale(): number {
		// Get the scale from the metadata.
		const scale = this.metadata.get(MetadataKey.Scale);

		// Return 1 if the scale is null.
		if (!scale) return Number(1);

		// Return the scale as a number.
		return scale.value as number;
	}

	/**
	 * Set the scale of the entity.
	 */
	public set scale(value: number) {
		// Set the scale in the metadata.
		this.metadata.set(MetadataKey.Scale, { type: MetadataType.Float, value });

		// Send the metadata to the world.
		this.dimension.updateEntity(this);
	}
}

export { Entity };