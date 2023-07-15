const path = require('path')
const fs = require('fs')

const {
  ARDENT_DATA_DIR,
  ARDENT_BACKUP_DIR
} = require('../lib/consts')

;(async () => {
  console.log(`Backup location: ${ARDENT_BACKUP_DIR}`)
  console.log(`Target location: ${ARDENT_DATA_DIR}`)
  console.log('Restoring from backup …')

  console.time('Backups restored')

  const pathToTradeDbBackup = path.join(ARDENT_BACKUP_DIR, '/trade.db')
  const pathToTradeDbLive = path.join(ARDENT_DATA_DIR, '/trade.db')

  const pathToStationsDbBackup = path.join(ARDENT_BACKUP_DIR, '/stations.db')
  const pathToStationsLive = path.join(ARDENT_DATA_DIR, '/stations.db')

  const pathToSystemsDbBackup = path.join(ARDENT_BACKUP_DIR, '/systems.db')
  const pathToSystemsDbLive = path.join(ARDENT_DATA_DIR, '/systems.db')

  if (!fs.existsSync(ARDENT_DATA_DIR)) { fs.mkdirSync(ARDENT_DATA_DIR, { recursive: true }) }

  restoreDatabaseFromBackup(pathToTradeDbBackup, pathToTradeDbLive)
  restoreDatabaseFromBackup(pathToStationsDbBackup, pathToStationsLive)
  restoreDatabaseFromBackup(pathToSystemsDbBackup, pathToSystemsDbLive)

  console.timeEnd('Backups restored')

  process.exit()
})()

function restoreDatabaseFromBackup (dbToRestoreFrom, dbToRestoreTo) {
  // Delete existing files in target location
  fs.rmSync(dbToRestoreTo, { force: true })
  fs.rmSync(`${dbToRestoreTo}-journal}`, { force: true })
  fs.rmSync(`${dbToRestoreTo}-shm`, { force: true })
  fs.rmSync(`${dbToRestoreTo}-wal`, { force: true })

  // Copy file from backup to live data dir
  // Note: Backup files are always single files (they are pre-vaccumed)
  fs.copyFileSync(dbToRestoreFrom, dbToRestoreTo)
}
