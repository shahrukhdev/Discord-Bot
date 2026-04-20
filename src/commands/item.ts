import { SlashCommandBuilder, ChatInputCommandInteraction, AttachmentBuilder, EmbedBuilder } from "discord.js";
import items from "../data/items.json" with { type: "json" };

type ItemKey = keyof typeof items;
type Item = typeof items[ItemKey];

export const itemCommand = {
  data: new SlashCommandBuilder()
    .setName("item")
    .setDescription("Send an item info")
    .addStringOption(option => {
      option.setName("name").setDescription("Select the item").setRequired(true);
      for (const key of Object.keys(items) as ItemKey[]) {
        option.addChoices({ name: items[key].label, value: key });
      }
      return option;
    })
    .addStringOption(option =>
      option.setName("id").setDescription("Customer ID (optional)").setRequired(false)
    )
    .addIntegerOption(option =>
      option.setName("qty").setDescription("Quantity (optional)").setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString("name") as ItemKey;
    const id = interaction.options.getString("id");
    const qty = interaction.options.getInteger("qty");
    const item: Item = items[name];

    if (!item) {
      await interaction.reply({ content: "Item not found!", ephemeral: true });
      return;
    }

    // Build embed
    const embed = new EmbedBuilder()
      .setTitle(item.label)
      .setColor(0x00ff00) // green color
      .setImage(`attachment://${item.image}`) // reference attachment filename
      .setFooter({ text: "Item Bot" });

    // Add optional fields
    const descriptionParts = [];
    if (id) descriptionParts.push(`Customer ID: ${id}`);
    if (qty !== null) descriptionParts.push(`Quantity: ${qty}`);
    if (descriptionParts.length) embed.setDescription(descriptionParts.join("\n"));

    // Prepare attachment
    const attachment = new AttachmentBuilder(`./src/images/${item.image}`);

    await interaction.reply({
      embeds: [embed],
      files: [attachment],
    });
  },
};