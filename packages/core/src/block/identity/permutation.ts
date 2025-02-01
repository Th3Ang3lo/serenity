import { BinaryStream } from "@serenityjs/binarystream";
import {
  ByteTag,
  CompoundTag,
  IntTag,
  LongTag,
  StringTag,
  TagType
} from "@serenityjs/nbt";

import {
  BlockState,
  BlockTypeNbtPermutationDefinition,
  BlockTypeNbtStateDefinition,
  GenericBlockState
} from "../../types";
import { BlockIdentifier } from "../../enums";

import { BlockType } from "./type";
import { BlockTypeComponentCollection } from "./collection";

class BlockPermutation<T extends keyof BlockState = keyof BlockState> {
  /**
   * A collective registry of all block permutations.
   */
  public static readonly permutations = new Map<number, BlockPermutation>();

  /**
   * The offset of the hash algorithm.
   */
  public static readonly hashOffset = 0x81_1c_9d_c5;

  /**
   * The network hash of the block permutation.
   */
  public readonly networkId: number;

  /**
   * The index value of the block permutation in the block type.
   */
  public readonly index: number;

  /**
   * The state of the block permutation.
   */
  public readonly state: BlockState[T];

  /**
   * The block type of the block permutation.
   */
  public readonly type: BlockType<T>;

  /**
   * The Molang conditional query of the block permutation.
   * This is used on the client end to determine the block state and components.
   */
  public readonly query: string;

  /**
   * The vanilla components of the block permutation. (hardness, friction, lighting, etc.s)
   * This components are active on the client end when the query condition is met.
   * These components will override any global components of the block type.
   */
  public readonly components: BlockTypeComponentCollection;

  /**
   * Whether the block permutation is component based.
   * This is determined by the presence of any components in the block permutation.
   */
  public get isComponentBased(): boolean {
    return this.components.getTags().length > 0;
  }

  /**
   * Create a new block permutation.
   * @param network The network hash of the block permutation.
   * @param state The state of the block permutation.
   * @param type The block type of the block permutation.
   */
  public constructor(
    networkId: number,
    state: BlockState[T],
    type: BlockType<T>
  ) {
    // Assign the block permutation properties.
    this.networkId = networkId;
    this.state = state;
    this.type = type;
    this.index = type.permutations.length;
    this.components = new BlockTypeComponentCollection(this);

    // Get keys of the block state.
    const keys = Object.keys(state ?? {});

    // Create the MolangQuery for the permutation.
    let query = String();
    for (const key of keys) {
      // Get the value of the block state.
      let value = state[key as keyof BlockState[T]] as unknown;

      // Update the value if it is a string.
      value = typeof value === "string" ? `'${value}'` : value;

      // Append the query for the block state.
      query += `query.block_state('${key}') == ${value}`;

      // Check if a conjunction is needed.
      if (keys.indexOf(key) !== keys.length - 1) query += " && ";
    }

    // Assign the block permutation query.
    this.query = query;
  }

  /**
   * Check if the block permutation matches the identifier and state.
   * @param identifier The block identifier to match.
   * @param state The block state to match.
   */
  public matches(state: BlockState[T]): boolean {
    // Check if the block state matches.
    for (const key in state) {
      if (this.state[key] !== state[key]) {
        return false;
      }
    }

    // Return true if the block permutation matches.
    return true;
  }

  /**
   * Resolve a block permutation from the block identifier and state.
   * @param identifier The block identifier to resolve.
   * @param state The block state to resolve.
   */
  public static resolve<T extends keyof BlockState>(
    identifier: T,
    state?: BlockState[T]
  ): BlockPermutation<T> {
    // Get the block type from the registry.
    const type = BlockType.types.get(identifier as BlockIdentifier);

    // Check if the block type exists.
    if (!type) return this.resolve(BlockIdentifier.Air) as BlockPermutation<T>;

    // Check if the state is not provided.
    const permutation = type.permutations.find((permutation) => {
      for (const key in state) {
        // Get the value of the block state.
        const value = (permutation.state as never)[key];

        // Check if the value is a boolean
        const bool = value === true || value === false ? true : false;

        // Convert the state to a boolean if it is a boolean.
        const query =
          bool && (state[key] === 0 || state[key] === 1)
            ? state[key] === 1
            : state[key];

        // Check if the block state matches
        if (value !== query) {
          return false;
        }
      }

      // Return true if the block permutation matches.
      return true;
    });

    // Check if the block permutation does not exist.
    if (!permutation) {
      // Return the default permutation if the state is not found.
      return type.permutations[0] as BlockPermutation<T>;
    }

    // Return the block permutation.
    return permutation as BlockPermutation<T>;
  }

  /**
   * Create a new block permutation.
   * Primarily used for custom block types.
   * @param type The block type of the block permutation.
   * @param state The state of the block permutation.
   */
  public static create(
    type: BlockType,
    state: GenericBlockState = {},
    components: Partial<BlockTypeComponentCollection> = {}
  ): BlockPermutation {
    // Calculate the network hash of the block permutation.
    const network = BlockPermutation.hash(type.identifier, state);

    // Create a new block permutation.
    const permutation = new this(network, state, type);

    // Register the block permutation.
    BlockPermutation.permutations.set(network, permutation);

    // Register the permutation in the block type.
    type.permutations.push(permutation);

    // Assignt the properties of the block permutation.
    Object.assign(permutation.components, components);

    // Get the properties of the block type.
    const typeProperties = type.properties.value.properties;
    const permutations = type.properties.value.permutations;

    // Get the keys of the block state.
    const keys = Object.keys(state);

    // Check if the properties exist
    if (typeProperties) {
      // Iterate over the keys of the block state.
      for (const key of keys) {
        // Get the value of the key
        const value = state[key];

        // Find the property in the properties.
        let property = typeProperties.value.find(
          ({ value }) => value.name.value === key
        );

        // If the property does not exist, create a new property.
        if (!property) {
          // Create a new property tag.
          property = new CompoundTag<BlockTypeNbtStateDefinition>();

          // Create the name tag for the property.
          property.createStringTag({ name: "name", value: key });

          // Create the value tag for the property.
          property.createListTag({
            name: "enum",
            listType: this.getTagType(value)
          });

          // Add the property to the properties.
          typeProperties.push(property);
        }

        // Find the index of the value in the property.
        const index = property.value.enum.value.find(
          (tag) => tag.value === value
        );

        // Add the value to the property if it does not exist.
        if (index === undefined) {
          property.value.enum.value.push(this.createTag(value));
        }
      }
    }

    if (permutations) {
      // Create a new permutation tag.
      const tag = new CompoundTag<BlockTypeNbtPermutationDefinition>();

      // Create the condition tag for the permutation.
      tag.createStringTag({ name: "condition", value: permutation.query });

      // Add the permutation properties to the tag.
      tag.addTag(permutation.components);

      // Add the permutation to the permutations.
      permutations.push(tag);
    }

    // Return the block permutation.
    return permutation;
  }

  public static toNbt(permutation: BlockPermutation): CompoundTag<unknown> {
    const nbt = new CompoundTag({ name: "", value: {} });

    const name = new StringTag({
      name: "name",
      value: permutation.type.identifier
    });

    const states = new CompoundTag({ name: "states", value: {} });

    const keys = Object.keys(permutation.state);
    const values = Object.values(permutation.state);

    for (const [index, key] of keys.entries()) {
      const value = values[index];

      switch (typeof value) {
        case "number": {
          states.addTag(new IntTag({ name: key, value }));
          break;
        }

        case "string": {
          states.addTag(new StringTag({ name: key, value }));
          break;
        }

        case "boolean": {
          states.addTag(new ByteTag({ name: key, value: value ? 1 : 0 }));
          break;
        }
      }
    }

    nbt.addTag(name);
    nbt.addTag(states);

    return nbt;
  }

  public static fromNbt(nbt: CompoundTag<unknown>): BlockPermutation {
    const name = nbt.getTag("name") as StringTag;
    const states = nbt.getTag("states") as CompoundTag<unknown>;

    const state: Record<string, number | string> = {};

    const raw = states.value as Record<string, IntTag | StringTag | ByteTag>;

    for (const [key, tag] of Object.entries(raw)) {
      state[key] = tag.value;
    }

    return BlockPermutation.resolve(name.value as BlockIdentifier, state);
  }

  protected static getTagType(value: unknown): TagType {
    switch (typeof value) {
      case "boolean":
        return TagType.Byte;
      case "number":
        return TagType.Int;
      case "bigint":
        return TagType.Long;
      case "string":
        return TagType.String;
      default:
        throw new Error(`Unsupported value type: ${typeof value}`);
    }
  }

  protected static createTag(
    value: unknown
  ): StringTag | IntTag | LongTag | ByteTag {
    switch (typeof value) {
      case "boolean":
        return new ByteTag({ value: value ? 1 : 0 });
      case "number":
        return new IntTag({ value });
      case "bigint":
        return new LongTag({ value });
      case "string":
        return new StringTag({ value });
      default:
        throw new Error(`Unsupported value type: ${typeof value}`);
    }
  }

  public static hash(identifier: string, state: GenericBlockState): number {
    // Separate the keys and values of the state object.
    const keys = Object.keys(state);
    const values = Object.values(state);

    // Create a new compound tag with the name of the identifier.
    const root = new CompoundTag({ name: "", value: {} });
    root.addTag(new StringTag({ name: "name", value: identifier }));

    // Create a new compound tag with the name of "states".
    const states = new CompoundTag({ name: "states", value: {} });

    // Loop through each key and value in the state object.
    for (const [index, key] of keys.entries()) {
      const value = values[index];

      switch (typeof value) {
        case "number": {
          states.addTag(new IntTag({ name: key, value }));
          break;
        }

        case "string": {
          states.addTag(new StringTag({ name: key, value }));
          break;
        }

        case "boolean": {
          states.addTag(new ByteTag({ name: key, value: value ? 1 : 0 }));
          break;
        }
      }
    }

    // Add the states tag to the root tag.
    root.addTag(states);

    // Create a new binary stream and write the root tag to it.
    const stream = new BinaryStream();
    CompoundTag.write(stream, root);

    // Assign the hash to the offset.
    let hash = this.hashOffset;

    // Loop through each element in the buffer.
    for (const element of stream.getBuffer()) {
      // Set the hash to the XOR of the hash and the element.
      hash ^= element & 0xff;

      // Apply the hash algorithm.
      hash +=
        (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);

      // Convert the hash to a signed 32-bit integer.
      hash = hash | 0;
    }

    // Return the hash.
    return hash;
  }
}

export { BlockPermutation };
