import * as app from "../app.js"

export default new app.Command({
  name: "now",
  description: "The now command",
  channelType: "all",
  async run(message) {
    const time = app.dayjs().unix() - app.Queu.queu.startSong
    const parse = app.dayjs(time * 1000).format("mm:ss")

    let bar = "—".repeat(15)
    let progress = Math.ceil(time / app.Queu.queu.songs.duration.seconds * bar.length)
    let split = bar.split('')
    split[progress] = "O"

    const embed = new app.MessageEmbed()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setThumbnail(app.Queu.queu.songs.thumbnail)
      .setTitle(app.Queu.queu.songs.title)
      .setURL(app.Queu.queu.songs.url)
      .setDescription(`\`[${parse}]\` / \`[${app.Queu.queu.songs.duration.timestamp}]\`\n${split.join('')}`)
      .setColor('BLURPLE')

    // todo: code here
    return message.send({embeds: [embed]})
  }
})