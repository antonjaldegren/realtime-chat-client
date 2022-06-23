import { useState, useEffect } from "react";
import {
	Textarea,
	Button,
	Flex,
	Box,
	Stack,
	Text,
	Heading,
	Collapse,
} from "@chakra-ui/react";
import { io } from "socket.io-client";
import AddRoomModal from "./components/AddRoomModal";
import UsernameModal from "./components/UsernameModal";
import Message from "./components/Message";

const socket = io("http://localhost:4000");

function App() {
	const [me, setMe] = useState({});
	const [messages, setMessages] = useState([]);
	const [rooms, setRooms] = useState([]);
	const [users, setUsers] = useState([]);
	const [currentRoom, setCurrentRoom] = useState(null);
	const [messageInput, setMessageInput] = useState("");
	const [isWriting, setIsWriting] = useState(false);
	const [someoneElseIsWriting, setSomeoneElseIsWriting] = useState({
		isWriting: false,
		user: { username: null, id: null },
	});

	function handleSendMessage() {
		socket.emit("message", { message: messageInput, to: currentRoom });
		setMessageInput("");
	}

	function joinRoom(id) {
		if (id === currentRoom) return;
		// if (currentRoom !== null) {
		// 	socket.emit("leave_room", currentRoom);
		// }
		socket.emit("join_room", id);
		setCurrentRoom(id);
	}

	function postUsername(username) {
		setMe({ ...me, username });
		socket.emit("set_username", username);
	}

	// function getDMs(id) {}

	useEffect(() => {
		socket.on("connect", () => {
			setMe((prevState) => ({ ...prevState, id: socket.id }));
			socket.emit("ready");
		});

		socket.on("initial_data", (data) => {
			setRooms(data.rooms);
			setUsers(data.users);
		});

		socket.on("message", (data) => {
			setMessages((prevState) => [data, ...prevState]);
		});

		socket.on("new_room", (data) => {
			setRooms(data);
		});

		socket.on("updated_users", (data) => {
			setUsers(data);
		});

		socket.on("existing_messages", (data) => {
			setMessages(data.reverse());
		});

		socket.on("is_writing", (data) => {
			console.log(data);
			setSomeoneElseIsWriting(data);
		});

		socket.on("disconnect", () => {
			setCurrentRoom(null);
			setMessages([]);
			setUsers([]);
			console.log("Disconnected from server");
		});
		return () => socket.off();
	}, []);

	useEffect(() => {
		socket.emit("is_writing", { isWriting: isWriting, to: currentRoom });
	}, [isWriting]);

	return (
		<div className="App">
			<UsernameModal postUsername={postUsername} />
			<Flex>
				<Stack w="20%" p={4} gap={5}>
					<Stack>
						<Heading size="lg">Users</Heading>
						{users.length ? (
							users.map((user) => (
								<Button
									key={`usersList${user.id}`}
									colorScheme="blue"
									variant="ghost"
									isActive={user.id === currentRoom}
									disabled={user.id === me.id}
									justifyContent="flex-start"
									onClick={() => getDMs(user.id)}
								>
									{user.username || "Anonymous"}{" "}
									{user.id === me.id && "(me)"}
								</Button>
							))
						) : (
							<Text>No users online</Text>
						)}
					</Stack>
					<Stack>
						<Flex justify="space-between">
							<Heading size="lg">Rooms</Heading>
							<AddRoomModal joinRoom={joinRoom} />
						</Flex>
						{rooms.length ? (
							rooms.map((room) => (
								<Button
									key={`roomsList${room.id}`}
									colorScheme="blue"
									variant="ghost"
									isActive={room.id === currentRoom}
									justifyContent="flex-start"
									onClick={() => joinRoom(room.id)}
								>
									{room.id}
								</Button>
							))
						) : (
							<Text>No rooms added</Text>
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
						<Collapse
							in={someoneElseIsWriting.isWriting}
							animateOpacity
						>
							<Text color="gray.500" mt={4}>
								{someoneElseIsWriting.user.username} is
								writing...
							</Text>
						</Collapse>
						{currentRoom && messages ? (
							messages.map((message) => (
								<Message
									key={`messagesList${message.id}`}
									message={message}
									isMe={message.author.id === me.id}
								/>
							))
						) : (
							<Text>Please pick a room or user in the list</Text>
						)}
					</Flex>

					<Flex direction="column" h="25vh" py={5} pr={4} bg="white">
						<Textarea
							h="100%"
							mb={3}
							placeholder="Enter message here"
							resize="none"
							value={messageInput}
							onChange={(e) => setMessageInput(e.target.value)}
							isDisabled={currentRoom === null}
							onFocus={() => setIsWriting(true)}
							onBlur={() => setIsWriting(false)}
						/>
						<Button
							alignSelf="flex-end"
							colorScheme="blue"
							onClick={handleSendMessage}
							flexShrink={0}
							isDisabled={
								currentRoom === null || messageInput === ""
							}
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
