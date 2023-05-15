import { SlashCommandBuilder } from "@discordjs/builders";

const orderCommand = new SlashCommandBuilder()
  .setName("order")
  .setDescription("Order your food!")
  .addStringOption((option) => {
    return option
      .setName("food")
      .setDescription("Select your Food")
      .setRequired(true)
      .setChoices(
        { name: "Cake", value: "Cake" },
        { name: "Burger", value: "Burger" },
        { name: "Pizza", value: "Pizza" }
      );
  })
  .addStringOption((option) => {
    return option
      .setName("drink")
      .setDescription("Select your drink")
      .setRequired(false)
      .setChoices(
        { name: "Water", value: "Water" },
        { name: "Coke", value: "Coke" },
        { name: "Mirinda", value: "Mirinda" }
      );
  });

export default orderCommand.toJSON();
