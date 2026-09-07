# Discord Bot Reference

## Official Sources

- Discord Developer Portal: https://discord.com/developers/applications
- Discord.js guide: https://discordjs.guide/
- Bun + Discord.js guide: https://bun.sh/docs/guides/ecosystem/discordjs

## Creating A Bot Application

1. Open https://discord.com/developers/applications
2. Click `New Application`
3. Go to `Bot` tab → `Reset Token` (copy immediately, shown once)
4. Get `Application ID` from `General Information`
5. Go to `OAuth2` → `URL Generator` → select scopes `bot` and `applications.commands`
6. Select permissions the bot needs, then copy invite URL and open it in a server you own

## Token And IDs

- `DISCORD_TOKEN`: bot token, treat as a password
- `APPLICATION_ID`: app id for registering slash commands
- `GUILD_ID`: server id for testing (right-click server with Developer Mode enabled)

## Recommended Library

- `discord.js` v14: rich abstractions, slash commands, components, modals.
- Alternatives: `@discordjs/rest`, `@discordjs/ws` for low-level use.

## Intents And Permissions

- `GatewayIntentBits.Guilds` is required for slash commands.
- `GuildMessages` and `MessageContent` only if reading messages.
- `applications.commands` OAuth scope is required for slash commands.
- Use least-privilege: request only intents the bot actually uses.

## Slash Commands

- Build with `SlashCommandBuilder`.
- Register globally with `Routes.applicationCommands(applicationId)`.
- Register for a guild with `Routes.applicationGuildCommands(applicationId, guildId)` for faster testing.
- Use `client.on('interactionCreate')` to handle `ChatInputCommandInteraction`.

## Best Practices

- Never commit `DISCORD_TOKEN`.
- Use `.env` (Bun reads automatically) and add it to `.gitignore`.
- Split commands and events into separate files.
- Use TypeScript declaration merging or interface for `client.commands`.
- Use `bun --watch` for dev, `bun start` for prod.
