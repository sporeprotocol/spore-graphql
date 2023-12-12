import { Script } from '@ckb-lumos/lumos';
import { ScriptConfig } from '@ckb-lumos/config-manager';
import { predefinedSporeConfigs } from '@spore-sdk/core';

type ScriptName = keyof (typeof predefinedSporeConfigs)['Aggron4']['lumos']['SCRIPTS'];

export function getScriptConfig(name: ScriptName): ScriptConfig | undefined {
  const script = predefinedSporeConfigs.Aggron4.lumos.SCRIPTS[name];
  return script;
}

export function isOmnilockScript(script: Script) {
  const omnilockScript = getScriptConfig('OMNILOCK');
  if (!omnilockScript) {
    return false;
  }
  return (
    script.codeHash === omnilockScript.CODE_HASH && script.hashType === omnilockScript.HASH_TYPE
  );
}

export function isAnyoneCanPayScript(script: Script) {
  const anyoneCanPayLockScript = getScriptConfig('ANYONE_CAN_PAY');
  if (!anyoneCanPayLockScript) {
    return false;
  }
  return (
    script.codeHash === anyoneCanPayLockScript.CODE_HASH &&
    script.hashType === anyoneCanPayLockScript.HASH_TYPE
  );
}

export function isSameScript(script1: Script | undefined, script2: Script | undefined) {
  if (!script1 || !script2) {
    return false;
  }
  return (
    script1.codeHash === script2.codeHash &&
    script1.hashType === script2.hashType &&
    script1.args === script2.args
  );
}

export function isAnyoneCanPay(script: Script | undefined) {
  if (!script) {
    return false;
  }
  if (isOmnilockScript(script)) {
    return script.args.slice(44, 46) === '02';
  }

  return isAnyoneCanPayScript(script);
}
