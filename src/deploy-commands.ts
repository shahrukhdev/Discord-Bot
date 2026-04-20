import dotenv from "dotenv";
import { REST, Routes } from "discord.js";
import { itemCommand } from "./commands/item.js";

dotenv.config();

const commands = [itemCommand.data.toJSON()]; // serialize command data

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log(`🚀 Started refreshing application (slash) commands.`);

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,   // your bot application ID
        process.env.GUILD_ID!     // your testing server ID
      ),
      { body: commands }
    );

    console.log(`✅ Successfully reloaded application (slash) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
