import React from "react";
import PropTypes from "prop-types";
import {
	Button,
	IconButton,
	Flex,
	Collapse,
	Box,
	Stack,
	Text,
	List,
	ListItem,
	ListIcon,
	Divider,
	Tooltip,
} from "@chakra-ui/react";
import { DeleteIcon, CheckCircleIcon } from "@chakra-ui/icons";

function Room({
	activeUsers,
	handleJoinRoom,
	handleRemoveRoom,
	isCurrentRoom,
	name,
	me,
}) {
	return (
		<>
			<Box py={2}>
				<Flex gap={3}>
					<Tooltip hasArrow label="Join room">
						<Button
							colorScheme="blue"
							variant="ghost"
							isActive={isCurrentRoom}
							justifyContent="flex-start"
							onClick={handleJoinRoom}
							flex={1}
						>
							<Text as="span" overflow="hidden">
								{name}
							</Text>
						</Button>
					</Tooltip>
					<Tooltip hasArrow label="Delete room">
						<IconButton
							colorScheme="blue"
							variant="outline"
							icon={<DeleteIcon />}
							onClick={handleRemoveRoom}
						/>
					</Tooltip>
				</Flex>
				<Collapse in={activeUsers.length > 0}>
					<List bg="gray.100" borderRadius={5} p={3} mt={3} gap={3}>
						<Stack>
							{activeUsers.map((user) => (
								<ListItem
									key={`userList${user.id}`}
									color="blue.600"
								>
									<ListIcon
										as={CheckCircleIcon}
										color="green.500"
									/>
									<Text as="span" fontWeight="bold">
										{user.username}
									</Text>
									{me.id === user.id && (
										<Text as="span"> (me)</Text>
									)}
								</ListItem>
							))}
						</Stack>
					</List>
				</Collapse>
			</Box>
			<Divider />
		</>
	);
}

Room.propTypes = {
	activeUsers: PropTypes.array,
	handleJoinRoom: PropTypes.func,
	handleRemoveRoom: PropTypes.func,
	isCurrentRoom: PropTypes.bool,
	name: PropTypes.string,
	me: PropTypes.object,
};

export default Room;
