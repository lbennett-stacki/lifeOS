import { AnyConstructor } from '@lifeos/utils';
import { logger } from '../logger';
import {
  ModuleDeclaration,
  ProviderDeclaration,
  Container,
  MODULE_REFLECT_METADATA_KEY,
  ModuleRefectMetadata,
} from '@lifeos/di';

export class AgentApp<
  M extends ModuleDeclaration[],
  P extends ProviderDeclaration<any>[],
> {
  private readonly container: Container<P>;

  constructor(
    private readonly root: AnyConstructor<any>,
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

  resolve<I, C extends AnyConstructor<I>>(target: C) {
    return this.container.resolve(target);
  }

  graph() {
    return this.root;
  }
}
