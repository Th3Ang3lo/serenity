import { EffectType } from "@serenityjs/protocol";

import { Entity } from "../entity";
import { WorldEvent } from "../enums";

import { EventSignal } from "./event-signal";

class EffectRemoveEventSignal extends EventSignal {
  public static readonly identifier: WorldEvent = WorldEvent.EffectRemove;

  /**
   * The entity where the effect was removed
   */
  public readonly entity: Entity;

  /**
   * The effect that was removed
   */
  public readonly effect: EffectType;

  public constructor(entity: Entity, effect: EffectType) {
    super(entity.getWorld());
    this.entity = entity;
    this.effect = effect;
  }
}

export { EffectRemoveEventSignal };
