enum PlayerActionType {
  Unknown = -1,
  StartDestroyBlock = 0,
  AbortDestroyBlock = 1,
  StopDestroyBlock = 2,
  GetUpdatedBlock = 3,
  DropItem = 4,
  StartSleeping = 5,
  StopSleeping = 6,
  Respawn = 7,
  StartJump = 8,
  StartSprinting = 9,
  StopSprinting = 10,
  StartSneaking = 11,
  StopSneaking = 12,
  CreativeDestroyBlock = 13,
  ChangeDimensionAck = 14,
  StartGliding = 15,
  StopGliding = 16,
  DenyDestroyBlock = 17,
  CrackBlock = 18,
  ChangeSkin = 19,
  DEPRECATED_UpdatedEnchantingSeed = 20,
  StartSwimming = 21,
  StopSwimming = 22,
  StartSpinAttack = 23,
  StopSpinAttack = 24,
  InteractWithBlock = 25,
  PredictDestroyBlock = 26,
  ContinueDestroyBlock = 27,
  StartItemUseOn = 28,
  StopItemUseOn = 29,
  HandledTeleport = 30,
  MissedSwing = 31,
  StartCrawling = 32,
  StopCrawling = 33,
  StartFlying = 34,
  StopFlying = 35,
  ClientAckServerData = 36,
  StartUsingItem = 37,
  Count = 38
}

export { PlayerActionType };
