import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { itemCommand } from "./commands/item.js";

dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);
}); 

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "item") {
    try {
      await itemCommand.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: "There was an error!" });
      } else {
        await interaction.reply({ content: "There was an error!", ephemeral: true });
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN!);