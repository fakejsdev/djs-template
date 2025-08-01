export const config: AutocompleteConfig = {
  commandName: "ping",
  optionName: "message",
  name: "Ping Message Autocomplete",
  description: "Provides message suggestions for ping command",
};

export const run: AutocompleteRun = async (interaction) => {
  const focusedValue = interaction.options.getFocused();

  const choices = [
    "Hello World!",
    "How are you doing?",
    "What's up?",
    "Good morning!",
    "Good evening!",
    "Nice to meet you!",
  ].filter((choice) =>
    choice.toLowerCase().includes(focusedValue.toLowerCase())
  );

  await interaction.respond(
    choices.slice(0, 25).map((choice) => ({ name: choice, value: choice }))
  );
};
