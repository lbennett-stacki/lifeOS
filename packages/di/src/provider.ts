import { AnyConstructor } from '@lifeos/utils';

export type ProviderKey = AnyConstructor<any> | symbol | string;

interface ProviderDeclarationCustom<V> {
  key: ProviderKey;
  value: V;
}

export type ProviderDeclaration<V> =
  | AnyConstructor<any>
  | ProviderDeclarationCustom<V>;
