import { number } from '@ckb-lumos/codec';
import { ScriptConfig } from '@ckb-lumos/config-manager';
import { Script, Hash, helpers, utils } from '@ckb-lumos/lumos';
import { bytifyRawString, SporeConfig } from '@spore-sdk/core';

const hashStore: Map<string, Hash> = new Map();

export function hashKeys(keys: any[]): Hash {
  const string = JSON.stringify(keys);
  if (hashStore.has(string)) {
    return hashStore.get(string)!;
  }

  const hash = utils.ckbHash(bytifyRawString(string));
  hashStore.set(string, hash);
  return hash;
}

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

export function ScriptEqualDeepCheck(script_a: Script, script_b: Script, config: SporeConfig) {
  const omni_a = isOmnilockScript(script_a, config);
  const omni_b = isOmnilockScript(script_b, config);
  if (omni_a !== omni_b) {
    return false;
  }
  if (omni_a && omni_b) {
    return script_a.args.slice(0, 42) == script_b.args.slice(0, 42);
  } else {
    return script_a === script_b;
  }
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
  if (isOmnilockScript(script, config) && script.args.length >= 46) {
    // The Omnilock has a flag in the args, where each bit represents a feature.
    // Refer to: https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0042-omnilock/0042-omnilock.md#omnilock-args
    const flag = number.Uint8.unpack(`0x${script.args.slice(44, 46)}`);
    const flagArray: number[] = [];
    for (let i = 7; i >= 0; i--) {
      flagArray.push((flag >> i) & 1);
    }

    // Is anyone-can-pay mode enabled
    return flagArray[6] === 1;
  }

  return isAnyoneCanPayScript(script, config);
}
