import { ContainerId, ContainerType } from "@serenityjs/protocol";

import { EntityContainer } from "../../container";

import { PlayerComponent } from "./player-component";

import type { Player } from "../../player";

class PlayerCursorComponent extends PlayerComponent {
	public readonly container: EntityContainer;

	public readonly containerType: ContainerType = ContainerType.Inventory;

	public readonly containerId: ContainerId = ContainerId.Ui;

	public readonly inventorySize: number = 1;

	public constructor(player: Player) {
		super(player, "minecraft:cursor");
		this.container = new EntityContainer(
			player,
			this.containerType,
			this.containerId,
			this.inventorySize
		);
	}
}

export { PlayerCursorComponent };
