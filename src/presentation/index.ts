import Express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import helmet from 'helmet'
import type { Server } from 'http'

import { ServiceList } from '../app.js'
import { AppConfig } from '../config.js'

export async function WebLayer(config: AppConfig, services: ServiceList) {
  const app = Express()
  let server: Server | undefined
  app.use(helmet())
  app.use(Express.json())

  app.use("/classes", classRouterFactory())
  app.use("/teachers", teacherRouterFactory())
  app.use("/parents", parentRouterFactory())
  app.use("/students", studentRouterFactory())

  app.get("/ping", (_, res) => {
    res.send("pong").end()
  })

  app.use(async (err: any, _: Request, res: Response, next: NextFunction) => {
    if (err) {
      return res.status(err?.status ?? 500).json({
        code: err?.code ?? "UNKNOW_ERROR",
        message: err?.message ?? "No error message",
        name: err?.name ?? "InternalError",
      })
    }

    next()
  })

  const start = async () => {
    console.debug("Starting Web Layer")

    server = app.listen(config.PORT, () =>
      console.info(`Listening on port ${config.PORT}`)
    )
  }

  const stop = async () => {
    console.debug()

    if (server) {
      server.close((err) => {
        let exitCode = 0

        if (err) {
          console.error(`Error closing Web Layer`, err)
          exitCode = 1
        }

        console.info("Web Layer stopped")
        process.exit(exitCode)
      })
    }
  }

  return {
    start,
    stop,
  }
}