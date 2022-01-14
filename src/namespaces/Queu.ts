import yts from 'yt-search'
import ytdl from 'ytdl-core'
import { joinVoiceChannel, DiscordGatewayAdapterCreator, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } from "@discordjs/voice"
import { Client, VoiceChannel } from "discord.js"

const keys = [
    [
        "pop emd", "tendence misic", "musique", "danse", "religion Isak danielson"
    ],
    [
        "underscore", "micode"
    ]
]

export let queu = {
    songs: [],
    now: {}
}

export function get() {}

export async function radioRun(client: Client) {
    client.guilds.cache.forEach(guild => {
        guild.channels.cache.forEach(async (channel) => {
            if (channel.id === "818590955677417515") {
                if (channel.isVoice()) {
                    if (channel instanceof VoiceChannel) {
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
                            const videos = await yts(keys[0][Math.floor(Math.random() * keys[0].length)])
                            let shouldSkip = false;
                            videos.videos.forEach(async (video, index) => {
                                if (shouldSkip) {
                                    return;
                                }

                                if (video.duration.seconds <= 360) {
                                    shouldSkip = true;
                                    const resource = createAudioResource(ytdl(video.url))
                                    player.play(resource)

                                    join.subscribe(player)
                                } else {
                                    if (index === videos.videos.length - 1) {
                                        init()
                                    }
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
}