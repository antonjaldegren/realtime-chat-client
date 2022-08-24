import React from "react";
import PropTypes from "prop-types";
import {
	Button,
	Drawer,
	DrawerOverlay,
	DrawerBody,
	DrawerHeader,
	DrawerCloseButton,
	useDisclosure,
	DrawerContent,
} from "@chakra-ui/react";

function MyDrawer({ children, buttonTitle }) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Button onClick={onOpen}>{buttonTitle}</Button>
			<Drawer
				initialFocusRef={null}
				placement="left"
				onClose={onClose}
				isOpen={isOpen}
			>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Rooms</DrawerHeader>
					<DrawerBody p={0}>{children}</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
}

MyDrawer.propTypes = {
	children: PropTypes.element,
	buttonTitle: PropTypes.string,
};

export default MyDrawer;
