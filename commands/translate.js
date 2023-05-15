import { SlashCommandBuilder } from "@discordjs/builders";

const translateCommand = new SlashCommandBuilder()
  .setName("translate")
  .setDescription("Translate your texts from any language to any language")
  .addStringOption((option) =>
    option.setName("text").setDescription("Input your text").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("inputlanguage")
      .setDescription("Your input text language?")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("outputlanguage")
      .setDescription("Your output text language?")
      .setRequired(true)
  );

export default translateCommand.toJSON();
