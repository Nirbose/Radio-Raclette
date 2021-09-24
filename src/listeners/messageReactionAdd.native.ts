import * as app from "../app.js"

const listener: app.Listener<"messageReactionAdd"> = {
  event: "messageReactionAdd",
  async run(_reaction, _user) {
    const reaction = await _reaction.fetch()
    const user = await _user.fetch()

    if (!user.bot) {
      const message = reaction.message
      const guild = message.guild
      if (guild) {
        const paginator = app.Paginator.getByMessage(message)
        if (paginator) {
          paginator.handleReaction(reaction, user)
        }
      }
    }
  },
}

export default listener
