import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	FormControl,
	FormLabel,
	Input,
	Button,
	useDisclosure,
} from "@chakra-ui/react";

function UsernameModal({ handleSetUsername }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const ref = useRef();
	const [username, setUsername] = useState("");

	useEffect(() => onOpen(), []);

	function handleSave() {
		handleSetUsername(username);
		onClose();
	}

	return (
		<>
			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={ref}
				onClose={onClose}
				closeOnEsc={false}
				closeOnOverlayClick={false}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Welcome to the Chat!
						</AlertDialogHeader>

						<AlertDialogBody>
							<FormControl>
								<FormLabel htmlFor="username">
									Username
								</FormLabel>
								<Input
									id="username"
									type="text"
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
								/>
							</FormControl>
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button
								ref={ref}
								colorScheme="blue"
								onClick={handleSave}
								ml={3}
								disabled={username === ""}
							>
								Save
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
}

UsernameModal.propTypes = {
	handleSetUsername: PropTypes.func,
};

export default UsernameModal;
