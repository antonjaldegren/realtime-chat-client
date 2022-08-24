import React from "react";
import PropTypes from "prop-types";
import { Text, Collapse } from "@chakra-ui/react";

function WritingIndicator({ writingUsers }) {
	function getWritingUsers() {
		if (writingUsers.length > 1) {
			const firstUsers = writingUsers
				.slice(0, writingUsers.length - 1)
				.map((user) => user.username)
				.join(", ");

			const lastUser = writingUsers[writingUsers.length - 1].username;

			return (
				<>
					{firstUsers} and {lastUser}
				</>
			);
		} else if (writingUsers.length === 1) {
			return <>{writingUsers[0].username}</>;
		}
		return null;
	}

	return (
		<div>
			<Collapse in={writingUsers.length > 0} animateOpacity>
				<Text color="gray.500" mt={4}>
					{getWritingUsers()} is writing...
				</Text>
			</Collapse>
		</div>
	);
}

WritingIndicator.propTypes = {
	writingUsers: PropTypes.array,
};

export default WritingIndicator;
