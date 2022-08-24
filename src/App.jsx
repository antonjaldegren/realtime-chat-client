import React, { useState, useEffect } from "react";
import {
	Textarea,
	Button,
	Flex,
	Hide,
	Text,
	Box,
	Badge,
	HStack,
	FormControl,
	useDisclosure,
	FormErrorMessage,
} from "@chakra-ui/react";
import { io } from "socket.io-client";
import UsernameModal from "./components/UsernameModal";
import Message from "./components/Message";
import WritingIndicator from "./components/WritingIndicator";
import Rooms from "./components/Rooms";
import MyDrawer from "./components/MyDrawer";
import AddRoomModal from "./components/AddRoomModal";

const socket = io(import.meta.env.VITE_SERVER_URL);

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

	function handleCreateRoom(id) {
		socket.emit("create_room", id);
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
		<Flex h="100vh" className="App">
			<UsernameModal handleSetUsername={handleSetUsername} />

			<Flex flex={1}>
				<Hide below="md">
					<Box w={{ md: "275px", lg: "350px" }}>
						<Rooms
							me={me}
							rooms={rooms}
							users={users}
							currentRoom={currentRoom}
							setCurrentRoom={setCurrentRoom}
							handleCreateRoom={handleCreateRoom}
							socket={socket}
							roomError={errors.create_room}
							isOpen={isOpen}
							onOpen={onOpen}
							onClose={onClose}
							withHeader
						/>
					</Box>
				</Hide>
				<Flex direction="column" flex={1} w="0" ml={3}>
					<Flex
						borderLeft="1px"
						borderBottom="1px"
						borderColor="gray.200"
						borderBottomLeftRadius="md"
						direction="column-reverse"
						shadow="inner"
						p={4}
						bg="gray.50"
						flex={1}
						overflowY="auto"
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
								Enter a room to start chatting!
							</Text>
						)}
					</Flex>
					<Flex direction="column" gap={3} py={4} pr={4} bg="white">
						<Hide above="md">
							{currentRoom && (
								<small>
									Current room:{"  "}
									<Badge colorScheme="blue">
										{
											rooms.find(
												(room) =>
													room.id === currentRoom
											).name
										}
									</Badge>
								</small>
							)}
						</Hide>
						<FormControl isInvalid={errors.message} flex={1}>
							<Textarea
								h="125px"
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
								You can&apos;t send an empty message!
							</FormErrorMessage>
						</FormControl>
						<Flex direction="row-reverse" justify="space-between">
							<Button
								colorScheme="blue"
								onClick={handleSendMessage}
								isDisabled={currentRoom === null}
							>
								Send
							</Button>
							<Hide above="md">
								<HStack>
									<MyDrawer buttonTitle="Rooms">
										<Rooms
											me={me}
											rooms={rooms}
											users={users}
											currentRoom={currentRoom}
											setCurrentRoom={setCurrentRoom}
											handleCreateRoom={handleCreateRoom}
											socket={socket}
											roomError={errors.create_room}
											isOpen={isOpen}
											onOpen={onOpen}
											onClose={onClose}
										/>
									</MyDrawer>
									<AddRoomModal
										isOpen={isOpen}
										onOpen={onOpen}
										onClose={onClose}
										handleCreateRoom={handleCreateRoom}
										isError={errors.create_room}
									/>
								</HStack>
							</Hide>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}

export default App;
