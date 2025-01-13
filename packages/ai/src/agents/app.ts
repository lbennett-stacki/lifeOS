import { AnyConstructor } from '@lifeos/utils';
import { logger } from '../logger.js';
import {
  ModuleDeclaration,
  ProviderDeclaration,
  Container,
  MODULE_REFLECT_METADATA_KEY,
  ModuleRefectMetadata,
  ProviderKey,
} from '@lifeos/di';

export class AgentApp<
  M extends ModuleDeclaration[] = ModuleDeclaration[],
  P extends ProviderDeclaration[] = ProviderDeclaration[],
> {
  private readonly container: Container<P>;

  constructor(
    public readonly root: AnyConstructor<any>,
    private readonly log = logger.service('agent-app'),
  ) {
    if (!Reflect.hasMetadata(MODULE_REFLECT_METADATA_KEY, root)) {
      this.log.error('Provided root module is not an agent module');
      throw new Error('Provided root module is not an agent module');
    }

    const metadata: ModuleRefectMetadata<M, P> = Reflect.getMetadata(
      MODULE_REFLECT_METADATA_KEY,
      root,
    );

    this.container = new Container(metadata.providers);
  }

  resolve<K extends ProviderKey>(providerKey: K) {
    return this.container.resolve(providerKey);
  }
}
