export function getActiveUsers(roomId, users) {
	return users.filter((user) => user.currentRoom === roomId);
}
