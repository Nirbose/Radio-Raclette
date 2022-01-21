import * as logger from "../app/logger.js"
import yts from 'yt-search'
import ytdl from 'ytdl-core'
import { joinVoiceChannel, DiscordGatewayAdapterCreator, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus, VoiceConnection } from "@discordjs/voice"
import { Client, Guild } from "discord.js"
import dayjs from 'dayjs';

const channelId = ["818590955677417515", "877174466873020466", "828281176887656459"]

const keys = [
    // Année 70 (pour un theme)
    [
        "religion Isak danielson", "Lie to me Riell", "To Feet", "Ambre", "Tessae", "Twenty One pilote"
    ]
]

interface Emitions { 
    title: string
    author: string
    started_at: string
    filter?: string
    days?: number[]
}

export const emitions: Emitions[] = [
    {
        title: "micode balle perdue",
        author: "Micode",
        filter: "CAI%253D",
        started_at: "18:26",
    }
]

export let queu = {
    songs: {} as yts.VideoSearchResult,
    startSong: 0,
}

export class Radio {
    public emition = {
        title: "none",
        filter: "none",
    } as Emitions

    private player
    private emitionLoad = false
    private read = false

    constructor(private client: Client) {
        this.player = createAudioPlayer()
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

    public async run(emition = false)
    {
        let song = await this.songs()

        if (this.emitionLoad) return
        if (emition) song = await this.emitions()
        if (!this.emitionLoad && this.read) return

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
            this.read = true
        } else {
            this.songs()
        }

        this.player.setMaxListeners(10)

        this.player.on(AudioPlayerStatus.Idle, () => {
            if (this.emitionLoad) this.emitionLoad = false
            if (this.read) this.read = false

            this.run()
        })

        this.player.on('error', (err) => {
            logger.log(err.message)
        })
    }

    private async songs(): Promise<boolean | yts.VideoSearchResult>
    {
        const videos = await (await yts(keys[0][Math.floor(Math.random() * keys[0].length)])).videos.slice(0, 5)
        let videosSave: yts.VideoSearchResult[] = []
        videos.forEach((video, index) => {
            if (video.duration.seconds <= 300 || this.emitionLoad) {
                videosSave.push(video)
            } else {
                if (index === videos.length - 1) {
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

    private async emitions(): Promise<yts.VideoSearchResult | boolean> {
        const videos = await yts({
            query: this.emition.title,
            sp: this.emition.filter
        })

        this.emitionLoad = true

        return videos.videos[0]
    }
}