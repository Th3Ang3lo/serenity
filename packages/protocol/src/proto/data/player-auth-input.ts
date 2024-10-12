import { Endianness, Float32, VarInt } from "@serenityjs/binarystream";
import { Proto, Serialize } from "@serenityjs/raknet";

import { Packet } from "../../enums";
import { ClientPredictedVehicle } from "../types/client-predicted-vehicle";
import { InteractionMode } from "../../enums/interaction-mode";
import { PlayerAuthInputData } from "../types/player-auth-input-data";
import { InputMode } from "../../enums/input-mode";
import { PlayMode } from "../../enums/play-mode";
import {
  PlayerInputTick,
  Vector2f,
  Vector3f,
  PlayerBlockActions
} from "../types";

import { DataPacket } from "./data-packet";

@Proto(Packet.PlayerAuthInput)
export class PlayerAuthInputPacket extends DataPacket {
  @Serialize(Vector2f) public rotation!: Vector2f;
  @Serialize(Vector3f) public position!: Vector3f;
  @Serialize(Vector2f) public motion!: Vector2f;
  @Serialize(Float32, Endianness.Little) public headYaw!: number;
  @Serialize(PlayerAuthInputData) public inputData!: PlayerAuthInputData;
  @Serialize(VarInt) public inputMode!: InputMode;
  @Serialize(VarInt) public playMode!: PlayMode;
  @Serialize(VarInt) public interactionMode!: InteractionMode;
  // @Serialize(Vector2f) public interactRotation!: Vector2f; // TODO v748
  @Serialize(PlayerInputTick) public inputTick!: PlayerInputTick;
  @Serialize(Vector3f) public positionDelta!: Vector3f;
  @Serialize(PlayerBlockActions, 0, "inputData")
  public blockActions!: PlayerBlockActions | null;

  @Serialize(ClientPredictedVehicle, 0, "inputData")
  public predictedVehicle!: ClientPredictedVehicle | null;

  @Serialize(Vector2f) public analogueMotion!: Vector2f;
  // @Serialize(Vector3f) public cameraOrientation!: Vector3f; // TODO v748
}
