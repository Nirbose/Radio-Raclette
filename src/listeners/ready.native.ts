import figlet from "figlet"
import boxen from "boxen"
import chalk from "chalk"

import * as app from "../app.js"

import { filename } from "dirname-filename-esm"

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

    let radio = new app.Radio.Radio(client)
    radio.run()

    setInterval(() => {
      let date = app.dayjs().format("HH:mm")

      app.Radio.emitions.forEach(emition => {
        if (date == emition.started_at) {
          radio.emition = emition
          radio.run(true)
        }
      })
    }, 10000)
  },
}

export default listener
