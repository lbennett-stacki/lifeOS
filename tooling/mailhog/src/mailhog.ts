import { ChildProcess, spawn, exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class MailHog {
  constructor(private process?: ChildProcess) {}

  async start() {
    await this.killAllExisting();

    this.process = spawn('mailhog', [], {
      stdio: 'inherit',
    });

    process.on('exit', this.stop);
  }

  async stop() {
    this.process?.kill();
    await this.killAllExisting();
    process.off('exit', this.stop);
  }

  private async killAllExisting() {
    try {
      await execAsync('pkill -f mailhog');
    } catch (e) {
      console.error(e);
    }
  }

  static async start() {
    const hog = new MailHog();
    await hog.start();
    return hog;
  }
}
