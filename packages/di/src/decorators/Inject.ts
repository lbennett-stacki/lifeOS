import { INJECT_REFLECT_METADATA_KEY } from '../keys';
import { ProviderKey } from '../provider';
import { InjectReflectMetadata, InjectReflectMetadataItem } from '../types';

export const Inject = (providerKey: ProviderKey) => {
  return function (
    target: any,
    _propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) {
    const existing: InjectReflectMetadata =
      Reflect.getMetadata(INJECT_REFLECT_METADATA_KEY, target) ?? [];

    const newItem: InjectReflectMetadataItem = {
      parameterIndex,
      providerKey,
    };

    Reflect.defineMetadata(
      INJECT_REFLECT_METADATA_KEY,
      [...existing, newItem] satisfies InjectReflectMetadata,
      target,
    );
  };
};
