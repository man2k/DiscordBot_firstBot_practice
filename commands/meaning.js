import { SlashCommandBuilder } from "@discordjs/builders";

const meaningCommand = new SlashCommandBuilder()
  .setName("meaning")
  .setDescription("Get meaning of any english word.")
  .addStringOption((option) =>
    option.setName("word").setDescription("Input your word").setRequired(true)
  );

export default meaningCommand.toJSON();
