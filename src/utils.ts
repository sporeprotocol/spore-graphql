import { number } from '@ckb-lumos/codec';
import { Script, helpers } from '@ckb-lumos/lumos';
import { ScriptConfig } from '@ckb-lumos/config-manager';
import { SporeConfig } from '@spore-sdk/core';

export function encodeToAddress(script: Script, config: SporeConfig) {
  return helpers.encodeToAddress(script, {
    config: config.lumos,
  });
}

export function getScriptConfig(name: string, config: SporeConfig): ScriptConfig | undefined {
  return config.lumos.SCRIPTS[name];
}

export function isOmnilockScript(script: Script, config: SporeConfig) {
  const omnilockScript = getScriptConfig('OMNILOCK', config);
  if (!omnilockScript) {
    return false;
  }
  return script.codeHash === omnilockScript.CODE_HASH && script.hashType === omnilockScript.HASH_TYPE;
}

export function isAnyoneCanPayScript(script: Script, config: SporeConfig<string>) {
  const anyoneCanPayLockScript = getScriptConfig('ANYONE_CAN_PAY', config);
  if (!anyoneCanPayLockScript) {
    return false;
  }
  return script.codeHash === anyoneCanPayLockScript.CODE_HASH && script.hashType === anyoneCanPayLockScript.HASH_TYPE;
}

export function isSameScript(script1: Script | undefined, script2: Script | undefined) {
  if (!script1 || !script2) {
    return false;
  }
  return (
    script1.codeHash === script2.codeHash && script1.hashType === script2.hashType && script1.args === script2.args
  );
}

export function isAnyoneCanPay(script: Script | undefined, config: SporeConfig<string>) {
  if (!script) {
    return false;
  }
  if (isOmnilockScript(script, config)) {
    const flag = number.Uint8.unpack(`0x${script.args.slice(44, 46)}`);
    const flagArray: number[] = [];
    for (let i = 7; i >= 0; i--) {
      flagArray.push((flag >> i) & 1);
    }

    return flagArray[6] === 1;
  }

  return isAnyoneCanPayScript(script, config);
}
