import figlet from "figlet"
import boxen from "boxen"
import chalk from "chalk"
import ytdl from "ytdl-core"
import yts from "yt-search"

import * as app from "../app.js"

import { filename } from "dirname-filename-esm"
import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel, NoSubscriberBehavior } from "@discordjs/voice"

const __filename = filename(import.meta)

const listener: app.Listener<"ready"> = {
  event: "ready",
  description: "Just log that bot is ready",
  once: true,
  async run(client) {
    app.log(
      `Ok i'm ready! ${chalk.blue(
        "My default prefix is"
      )} ${chalk.bgBlueBright.black(process.env.BOT_PREFIX)}`
    )

    figlet(app.fetchPackageJson().name, (err, value) => {
      if (err) return app.error(err, __filename, true)

      console.log(
        boxen(chalk.blueBright(value), {
          float: "center",
          borderStyle: {
            topLeft: " ",
            topRight: " ",
            bottomLeft: " ",
            bottomRight: " ",
            top: " ",
            left: " ",
            right: " ",
            bottom: " ",
          },
        })
      )
    })

    const keys = {
      music: ["pop emd", "tendence", "musique", "danse"]
    }

    client.guilds.cache.forEach(guild => {
      guild.channels.cache.forEach(async (channel) => {
        if (channel.id === "818590955677417515") {
          if (channel.isVoice()) {
            if (channel instanceof app.VoiceChannel) {
              let join = joinVoiceChannel({
                channelId: channel.id,
                guildId: guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
              })

              const player = createAudioPlayer({
                behaviors: {
                  noSubscriber: NoSubscriberBehavior.Pause,
                },
              })

              const init = async () => {
                const videos = await yts(keys.music[Math.floor(Math.random() * keys.music.length)])
                videos.videos.forEach(async (video, index) => {
                  if (video.duration.seconds !> 300) {
                    const resource = createAudioResource(ytdl(video.url))
                    player.play(resource)

                    join.subscribe(player)
                  } else {
                    console.log(`${index} | ${video.title}`)
                  }
                })
              }

              player.on(AudioPlayerStatus.Idle, () => {
                init()
              })

              init()
            }
          }
        }
      })
    })
  },
}

export default listener
