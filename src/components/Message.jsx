import { Box, Text, Heading } from "@chakra-ui/react";
import Emoji from "react-emoji-render";

function Message({ message, me }) {
	return (
		<Box
			key={`messagesList${message.id}`}
			bg={me ? "blue.400" : "white"}
			color={me ? "white" : "black"}
			shadow="sm"
			borderRadius="md"
			borderWidth="1px"
			borderColor={me ? "blue.500" : "gray.200"}
			maxW="80%"
			minW="40%"
			alignSelf={me ? "flex-end" : "flex-start"}
		>
			<Box
				p={2}
				borderBottom="1px"
				borderColor={me ? "blue.500" : "gray.200"}
			>
				<Heading size="sm">{message.author}</Heading>
				<Text fontSize="xs" color={me ? "blue.100" : "gray.500"}>
					{message.created_at}
				</Text>
			</Box>
			<Text p={3}>
				<Emoji text={message.message} />
			</Text>
		</Box>
	);
}

export default Message;
