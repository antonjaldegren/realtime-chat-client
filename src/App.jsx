import { useState, useEffect } from "react";
import {
	Textarea,
	Button,
	Flex,
	Box,
	Stack,
	Text,
	Heading,
	FormControl,
	useDisclosure,
	FormErrorMessage,
	Divider,
} from "@chakra-ui/react";
import { io } from "socket.io-client";
import AddRoomModal from "./components/AddRoomModal";
import UsernameModal from "./components/UsernameModal";
import Message from "./components/Message";
import Room from "./components/Room";
import { getActiveUsers } from "./utils";
import WritingIndicator from "./components/WritingIndicator";

const socket = io("http://localhost:4000");

function App() {
	const [me, setMe] = useState({});
	const [messages, setMessages] = useState([]);
	const [rooms, setRooms] = useState([]);
	const [users, setUsers] = useState([]);
	const [currentRoom, setCurrentRoom] = useState(null);
	const [messageInput, setMessageInput] = useState("");
	const [errors, setErrors] = useState({
		create_room: false,
		message: false,
	});
	const { isOpen, onOpen, onClose } = useDisclosure();

	function handleSendMessage() {
		socket.emit("message", { message: messageInput, room_id: currentRoom });
		setMessageInput("");
	}

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

	function handleSetUsername(username) {
		setMe({ ...me, username });
		socket.emit("set_username", username);
	}

	function handleIsWriting(isWriting) {
		socket.emit("is_writing", {
			isWriting,
			room_id: currentRoom,
		});
	}

	useEffect(() => {
		socket.on("connect", () => {
			setMe((prevState) => ({ ...prevState, id: socket.id }));
		});

		socket.on("initial_data", (data) => {
			setRooms(data.rooms);
			setUsers(data.users);
		});

		socket.on("message", (data) => {
			setMessages((prevState) => [data, ...prevState]);
		});

		socket.on("updated_rooms", (data) => {
			setCurrentRoom((prevState) =>
				data.findIndex((room) => room.id === prevState) === -1
					? null
					: prevState
			);
			setRooms(data);
		});

		socket.on("updated_users", (data) => {
			setUsers(data);
		});

		socket.on("existing_messages", (data) => {
			setMessages(data.reverse());
		});

		socket.on("error_status", (data) => {
			setErrors((prevState) => ({
				...prevState,
				...data,
			}));
			if (!data.create_room) onClose();
		});

		socket.on("disconnect", () => {
			setCurrentRoom(null);
			setMessages([]);
			setUsers([]);
		});
		return () => socket.off();
	}, []);

	return (
		<div className="App">
			<UsernameModal handleSetUsername={handleSetUsername} />
			<Flex>
				<Stack w="20%" p={4} gap={5} h="100vh" overflowY="scroll">
					<Stack>
						<Flex justify="space-between">
							<Heading size="lg">Rooms</Heading>
							<AddRoomModal
								isOpen={isOpen}
								onOpen={onOpen}
								onClose={onClose}
								handleCreateRoom={handleCreateRoom}
								isError={errors.create_room}
							/>
						</Flex>
						<Divider />
						{rooms.length ? (
							rooms.map(({ id, name }) => (
								<Room
									key={`roomsList${id}`}
									activeUsers={getActiveUsers(id, users)}
									name={name}
									id={id}
									isCurrentRoom={id === currentRoom}
									handleJoinRoom={() => handleJoinRoom(id)}
									handleRemoveRoom={() =>
										handleRemoveRoom(id)
									}
									me={me}
								/>
							))
						) : (
							<Text color="gray.400">No rooms added</Text>
						)}
					</Stack>
				</Stack>
				<Box h="100vh" flex={1}>
					<Flex
						borderLeft="1px"
						borderBottom="1px"
						borderColor="gray.200"
						borderBottomLeftRadius="md"
						direction="column-reverse"
						shadow="inner"
						p={4}
						bg="gray.50"
						h="75vh"
						overflowY="scroll"
					>
						<WritingIndicator
							writingUsers={users.filter(
								(user) =>
									user.isWriting &&
									user.currentRoom === currentRoom &&
									user.id !== me.id
							)}
						/>
						{currentRoom ? (
							messages.map((message) => (
								<Message
									key={`messagesList${message.id}`}
									message={message}
									isMe={message.author_id === me.id}
								/>
							))
						) : (
							<Text color="gray.400">
								Please pick a room in the list
							</Text>
						)}
					</Flex>

					<Flex direction="column" h="25vh" py={5} pr={4} bg="white">
						<FormControl isInvalid={errors.message} flex={1}>
							<Textarea
								h="100%"
								placeholder="Enter message here"
								resize="none"
								value={messageInput}
								onChange={(e) =>
									setMessageInput(e.target.value)
								}
								isDisabled={currentRoom === null}
								onFocus={() => handleIsWriting(true)}
								onBlur={() => handleIsWriting(false)}
							/>
							<FormErrorMessage>
								You can't send an empty message!
							</FormErrorMessage>
						</FormControl>
						<Button
							mt={3}
							alignSelf="flex-end"
							colorScheme="blue"
							onClick={handleSendMessage}
							flexShrink={0}
							isDisabled={currentRoom === null}
						>
							Send
						</Button>
					</Flex>
				</Box>
			</Flex>
		</div>
	);
}

export default App;
