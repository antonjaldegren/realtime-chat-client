import React, { Box, Text, Heading, Flex } from "@chakra-ui/react";
import Emoji from "react-emoji-render";

import Avatar from "boring-avatars";

function Message({ message, isMe }) {
	return (
		<Box
			bg={isMe ? "blue.400" : "white"}
			color={isMe ? "white" : "black"}
			shadow="sm"
			borderRadius="md"
			borderWidth="1px"
			borderColor={isMe ? "blue.500" : "gray.200"}
			maxW="80%"
			minW="40%"
			alignSelf={isMe ? "flex-end" : "flex-start"}
			mt={4}
		>
			<Box
				p={2}
				borderBottom="1px"
				borderColor={isMe ? "blue.500" : "gray.200"}
			>
				<Flex align="center" mb={2}>
					<Avatar
						size={30}
						name={message.author_id}
						variant="beam"
						colors={[
							"#FFAD08",
							"#EDD75A",
							"#73B06F",
							"#0C8F8F",
							"#405059",
						]}
					/>
					<Heading size="sm" ml={3}>
						{message.author_username}
					</Heading>
				</Flex>
				<Text fontSize="xs" color={isMe ? "blue.100" : "gray.500"}>
					{new Date(parseInt(message.created_at)).toLocaleString()}
				</Text>
			</Box>
			<Text p={3}>
				<Emoji text={message.message} />
			</Text>
		</Box>
	);
}

export default Message;
