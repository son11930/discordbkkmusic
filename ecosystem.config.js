module.exports = {
  apps: [{
    name: "discord-music-bot",
    script: "npx",
    args: "ts-node src/index.ts",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: "production",
    }
  }]
}
