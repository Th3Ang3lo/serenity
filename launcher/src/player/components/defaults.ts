import { Attribute } from "@serenityjs/protocol";

const LF32_MAX = 3.402_823_466e+38;

// NOTE: This file is not used anymore, it is kept for reference.
// Shall be removed in the future.

// These values need to be transferred to an EntityAttributeComponent

export const DEFAULT_ATTRIBUTES = [
	{
		name: Attribute.Absorption,
		min: 0,
		max: 16,
		default: 0,
		current: 0,
		modifiers: []
	},
	{
		name: Attribute.PlayerSaturation,
		min: 0,
		max: 20,
		default: 5,
		current: 5,
		modifiers: []
	},
	{
		name: Attribute.PlayerExhaustion,
		min: 0,
		max: 20,
		default: 0,
		current: 0,
		modifiers: []
	},
	{
		name: Attribute.KnockbackResistence,
		min: 0,
		max: 1,
		default: 0,
		current: 0,
		modifiers: []
	},
	{
		name: Attribute.Health,
		min: 0,
		max: 20,
		default: 20,
		current: 20,
		modifiers: []
	},
	{
		name: Attribute.Movement,
		min: 0,
		max: LF32_MAX,
		default: 0.1,
		current: 2,
		modifiers: []
	},
	{
		name: Attribute.FollowRange,
		min: 0,
		max: 2048,
		default: 16,
		current: 16,
		modifiers: []
	},
	{
		name: Attribute.PlayerHunger,
		min: 0,
		max: 20,
		default: 20,
		current: 0,
		modifiers: []
	},
	{
		name: Attribute.AttackDamage,
		min: 0,
		max: 1,
		default: 1,
		current: 1,
		modifiers: []
	},
	{
		name: Attribute.PlayerLevel,
		min: 0,
		max: 24_791,
		default: 0,
		current: 744,
		modifiers: []
	},
	{
		name: Attribute.PlayerExperience,
		min: 0,
		max: 1,
		default: 0,
		current: 0,
		modifiers: []
	},
	{
		name: Attribute.UnderwaterMovement,
		min: 0,
		max: LF32_MAX,
		default: 0.02,
		current: 0.02,
		modifiers: []
	},
	{
		name: Attribute.Luck,
		min: -1024,
		max: 1024,
		default: 0,
		current: 0,
		modifiers: []
	},
	{
		name: Attribute.FallDamage,
		min: 0,
		max: LF32_MAX,
		default: 1,
		current: 1,
		modifiers: []
	},
	{
		name: Attribute.HorseJumpStrength,
		min: 0,
		max: 2,
		default: 0.7,
		current: 0.7,
		modifiers: []
	},
	{
		name: Attribute.ZombieSpawnReinforcements,
		min: 0,
		max: 1,
		default: 0,
		current: 0,
		modifiers: []
	},
	{
		name: Attribute.LavaMovement,
		min: 0,
		max: LF32_MAX,
		default: 0.02,
		current: 0.02,
		modifiers: []
	}
];
