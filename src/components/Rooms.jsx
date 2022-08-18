import {
	Flex,
	Box,
	Stack,
	Text,
	Heading,
	useDisclosure,
} from "@chakra-ui/react";
import AddRoomModal from "./AddRoomModal";
import Room from "./Room";

function Rooms({
	me,
	rooms,
	users,
	currentRoom,
	setCurrentRoom,
	socket,
	roomError,
	isOpen,
	onOpen,
	onClose,
	withHeader,
}) {
	function handleCreateRoom(id) {
		socket.emit("create_room", id);
	}

	function handleJoinRoom(id) {
		if (id === currentRoom) return;
		setCurrentRoom(id);
		socket.emit("join_room", id);
	}

	function handleRemoveRoom(id) {
		socket.emit("remove_room", id);
	}

	return (
		<Box
			w="100%"
			h="100%"
			overflowY="auto"
			borderRight="1px"
			borderColor="gray.200"
		>
			{withHeader && (
				<Flex
					justify="space-between"
					bg="white"
					position="sticky"
					top={0}
					right={0}
					zIndex={999}
					p={4}
					borderBottom="1px"
					borderColor="gray.200"
				>
					<Heading size="lg">Rooms</Heading>
					<AddRoomModal
						isOpen={isOpen}
						onOpen={onOpen}
						onClose={onClose}
						handleCreateRoom={handleCreateRoom}
						isError={roomError}
					/>
				</Flex>
			)}
			<Stack p={4}>
				{rooms.length > 0 &&
					rooms.map(({ id, name }) => (
						<Room
							key={`roomsList${id}`}
							activeUsers={users.filter(
								(user) => user.currentRoom === id
							)}
							name={name}
							id={id}
							isCurrentRoom={id === currentRoom}
							handleJoinRoom={() => handleJoinRoom(id)}
							handleRemoveRoom={() => handleRemoveRoom(id)}
							me={me}
						/>
					))}
				{rooms.length > 0 ||
					(me.username && (
						<Text color="gray.400">No rooms added</Text>
					))}
			</Stack>
		</Box>
	);
}

export default Rooms;
