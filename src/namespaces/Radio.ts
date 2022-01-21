import * as logger from "../app/logger.js"
import yts from 'yt-search'
import ytdl from 'ytdl-core'
import { joinVoiceChannel, DiscordGatewayAdapterCreator, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus, VoiceConnection } from "@discordjs/voice"
import { Client, Guild } from "discord.js"
import dayjs from 'dayjs';

const channelId = ["818590955677417515", "877174466873020466"]

const keys = [
    // Année 70 (pour un theme)
    [
        "tendence misic", "danse", "religion Isak danielson", "Lie to me Riell", "To Feet", "Ambre", "Maxence", "Twenty One pilote"
    ],
    [
        "underscore", "micode"
    ]
]

export let queu = {
    songs: {} as yts.VideoSearchResult,
    startSong: 0,
}

export class Radio {
    private player

    constructor(private client: Client) {
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        })
    }

    public async join()
    {
        let joins: VoiceConnection[] = [];
        
        this.client.guilds.cache.forEach(guild => {
            guild.channels.cache.forEach(async (channel) => {
                if (channelId.includes(channel.id)) {
                    let join = joinVoiceChannel({
                        channelId: channel.id,
                        guildId: guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
                    })
                    
                    joins.push(join)
                }
            })
        })

        if (joins.length > 0) {
            return joins
        }

        return [joinVoiceChannel({
            channelId: "818590955677417515",
            guildId: "781105165754433537",
            adapterCreator: (await this.client.guilds.cache.get("781105165754433537") as Guild).voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
        })]
    }

    public async run()
    {
        const song = await this.songs()
        if (typeof song !== "boolean") {

            // Création de l'audio pour discord
            this.player.play(createAudioResource(ytdl(song.url)))

            const joins = await this.join()
            joins.forEach(join => {
                join.subscribe(this.player)
            })

            // Savegarde dans la queue
            queu.songs = song
            queu.startSong = dayjs().unix()
        } else {
            this.songs()
        }

        this.player.on(AudioPlayerStatus.Idle, () => {
            this.run()
        })

        this.player.on('error', (err) => {
            logger.log(err.message)
        })
    }

    private async songs(): Promise<boolean | yts.VideoSearchResult>
    {
        const videos = await yts(keys[0][Math.floor(Math.random() * keys[0].length)])
        let videosSave: yts.VideoSearchResult[] = []
        videos.videos.forEach((video, index) => {
            if (video.duration.seconds <= 360) {
                videosSave.push(video)
            } else {
                if (index === videos.videos.length - 1) {
                    this.songs()
                }
            }
        })

        const video = videosSave[Math.floor(Math.random() * videosSave.length)]

        if (typeof video !== "undefined") {
            return video
        } else {
            return false
        }
    }
}