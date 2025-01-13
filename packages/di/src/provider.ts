import { AnyConstructor } from '@lifeos/utils';

export type ProviderKey = AnyConstructor | symbol | string;

interface ProviderDeclarationCustom<V = any> {
  key: ProviderKey;
  value: V;
}

export type ProviderDeclaration<V = any> =
  | AnyConstructor
  | ProviderDeclarationCustom<V>;
