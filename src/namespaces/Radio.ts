import yts from 'yt-search'
import ytdl from 'ytdl-core'
import { joinVoiceChannel, DiscordGatewayAdapterCreator, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } from "@discordjs/voice"
import { Client, VoiceChannel } from "discord.js"
import dayjs from 'dayjs';

const channelId = ["818590955677417515"]

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
        this.client.guilds.cache.forEach(guild => {
            guild.channels.cache.forEach(async (channel) => {
                if (channelId.includes(channel.id)) {
                    return joinVoiceChannel({
                        channelId: channel.id,
                        guildId: guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
                    })
                }
            })
        })

        return joinVoiceChannel({
            channelId: "818590955677417515",
            guildId: "717098989831005184",
            adapterCreator: (await this.client.guilds.fetch("717098989831005184")).voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
        })
    }

    public async run()
    {
        const song = await this.songs()
        if (typeof song !== "boolean") {

            // Création de l'audio pour discord
            this.player.play(createAudioResource(ytdl(song.url)))

            const join = await this.join()
            join.subscribe(this.player)

            // Savegarde dans la queue
            queu.songs = song
            queu.startSong = dayjs().unix()
        } else {
            this.songs()
        }

        this.player.on(AudioPlayerStatus.Idle, () => {
            this.songs()
        })

        this.player.on('error', (err) => {
            console.log(err.message)
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