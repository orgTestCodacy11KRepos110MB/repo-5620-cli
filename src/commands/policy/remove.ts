import { isEmpty } from 'lodash'
import { flags } from '@oclif/command'
import Command from '../base'
import { PluginType } from '../../utils/constants'

export default class Remove extends Command {
  static description = 'Remove currently installed policy pack'

  static aliases = ['remove', 'rm', 'del', 'policy:rm', 'policy:del']

  static examples = [
    '$ cg policy delete',
    '$ cg policy delete aws',
    '$ cg policy delete aws --no-save',
  ]

  static strict = false

  static hidden = false

  static flags = {
    'no-save': flags.boolean({
      default: false,
      description: 'Set to not alter lock file, just delete plugin',
    }),
    ...Command.flags,
  }

  static args = Command.args

  async run(): Promise<void> {
    const {
      argv,
      flags: { 'no-save': noSave },
    } = this.parse(Remove)
    const allPolicyPacks = argv
    const manager = this.getPluginManager(PluginType.PolicyPack)
    const lockFile = manager.getLockFile()
    if (isEmpty(lockFile)) {
      this.logger.info('No policy packs found, have you installed any?')
      this.exit()
    }
    for (const key of allPolicyPacks) {
      await manager.removePlugin(key)
      if (!noSave) {
        manager.removeFromLockFile(key)
      }
    }
  }
}