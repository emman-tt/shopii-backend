import cron from 'node-cron'
import { sequelize } from '../config/sqlConfig.js'

export function startKeepAlive () {
  cron.schedule('*/5 * * * *', async () => {
    try {
      console.log('[CRON] Keep-alive ping at', new Date().toISOString())

      await sequelize.query('SELECT 1')

      console.log('[CRON] Backend & Database active ')
    } catch (error) {
      console.error('[CRON] Keep-alive failed:', error.message)
    }
  })
}

export function stopKeepAlive () {
  cron.getTasks().forEach(task => task.stop())
  console.log('[CRON] Keep-alive stopped')
}
