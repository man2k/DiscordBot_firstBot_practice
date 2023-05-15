import { SlashCommandBuilder } from "@discordjs/builders";

const weatherCommand = new SlashCommandBuilder()
  .setName("weather")
  .setDescription("Get weather details of any place")
  .addStringOption((option) =>
    option
      .setName("location")
      .setDescription("Input the location you want to get weather report on")
      .setRequired(true)
  );

export default weatherCommand.toJSON();
