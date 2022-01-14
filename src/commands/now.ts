import * as app from "../app.js"

export default new app.Command({
  name: "now",
  description: "The now command",
  channelType: "all",
  async run(message) {
    const song = app.Radio.queu.songs
    const time = app.dayjs().unix() - app.Radio.queu.startSong
    const parse = app.dayjs(time * 1000).format("mm:ss")

    let bar = "—".repeat(15)
    let progress = Math.ceil(time / song.duration.seconds * bar.length)
    let split = bar.split('')
    split[progress] = "O"

    const embed = new app.MessageEmbed()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setThumbnail(song.thumbnail)
      .setTitle(song.title)
      .setURL(song.url)
      .setDescription(`\`[${parse}]\` / \`[${song.duration.timestamp}]\`\n${split.join('')}`)
      .setColor('BLURPLE')

    // todo: code here
    return message.send({embeds: [embed]})
  }
})