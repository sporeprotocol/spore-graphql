import { Script, helpers } from '@ckb-lumos/lumos';
import { predefinedSporeConfigs } from '@spore-sdk/core';

export function encodeToAddress(script: Script) {
  return helpers.encodeToAddress(script, {
    config: predefinedSporeConfigs.Aggron4.lumos,
  });
}
