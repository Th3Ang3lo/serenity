import { ContainerClosePacket, DisconnectReason } from "@serenityjs/protocol";

import { SerenityHandler } from "./serenity-handler";

import type { NetworkSession } from "@serenityjs/network";

class ContainerClose extends SerenityHandler {
	public static packet = ContainerClosePacket.id;

	public static handle(
		packet: ContainerClosePacket,
		session: NetworkSession
	): void {
		// Get the player from the session
		// If there is no player, then disconnect the session.
		const player = this.serenity.getPlayer(session);
		if (!player)
			return session.disconnect(
				"Failed to connect due to an invalid player. Please try again.",
				DisconnectReason.InvalidPlayer
			);

		// Send the packet back to the client
		session.send(packet);
	}
}

export { ContainerClose };
