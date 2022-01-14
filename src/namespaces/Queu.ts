import yts from 'yt-search'
import ytdl from 'ytdl-core'
import { joinVoiceChannel, DiscordGatewayAdapterCreator, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } from "@discordjs/voice"
import { Client, VoiceChannel } from "discord.js"
import dayjs from 'dayjs';

const keys = [
    [
        "tendence misic", "danse", "religion Isak danielson", "Lie to me Riell"
    ],
    [
        "underscore", "micode"
    ]
]

export let queu = {
    songs: {} as yts.VideoSearchResult,
    startSong: 0,
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
                            let videosSave: yts.VideoSearchResult[] = []
                            videos.videos.forEach((video, index) => {
                                if (video.duration.seconds <= 360) {
                                    videosSave.push(video)
                                } else {
                                    if (index === videos.videos.length - 1) {
                                        init()
                                    }
                                }
                            })

                            const video = videosSave[Math.floor(Math.random() * videosSave.length)]
                            if (typeof video !== "undefined") {

                                // Création de l'audio pour discord
                                const resource = createAudioResource(ytdl(video.url))
                                player.play(resource)
                                join.subscribe(player)

                                // Savegarde dans la queue
                                queu.songs = video
                                queu.startSong = dayjs().unix()
                            } else {
                                init()
                            }
                        }

                        player.on(AudioPlayerStatus.Idle, () => {
                            init()
                        })

                        client.on('error', (err) => {
                            console.log(err.message)
                        });

                        player.on('error', (err) => {
                            console.log(err.message)
                        })

                        init()
                    }
                }
            }
        })
    })
}