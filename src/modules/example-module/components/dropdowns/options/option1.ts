export const config: DropdownConfig = {
	parentCustomId: "example-dropdown",
	value: "option1",
};

export const run: DropdownRun = (i) => {
	return i.reply({ content: "You selected option 1!!!!!" });
};
