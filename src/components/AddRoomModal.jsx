import { useState } from "react";
import {
	Button,
	IconButton,
	Input,
	Tooltip,
	FormControl,
	FormLabel,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

function AddRoomModal({ joinRoom }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [input, setInput] = useState("");

	function handleCreate() {
		joinRoom(input);
		onClose();
	}

	return (
		<>
			<Tooltip hasArrow label="Create new room">
				<IconButton
					variant="ghost"
					aria-label="Create new room"
					icon={<AddIcon />}
					onClick={onOpen}
				/>
			</Tooltip>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Create new room</ModalHeader>
					<ModalCloseButton />

					<ModalBody>
						<FormControl>
							<FormLabel htmlFor="roomName">Room name</FormLabel>
							<Input
								id="roomName"
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
							/>
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button mr={3} onClick={onClose}>
							Close
						</Button>
						<Button
							colorScheme="blue"
							onClick={handleCreate}
							disabled={input === ""}
						>
							Create
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

export default AddRoomModal;
