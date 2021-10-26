import {
  selectorFamily,
  GetRecoilValue,
} from 'recoil';
import * as R from 'ramda';
import { bech32 } from 'bech32';
import { chainConfig } from '@configs';
import { readValidator } from '@recoil/validators';
import { atomFamilyState } from './atom';

// ======================================================================
// selector utils
// ======================================================================

const getDelegatorAddress = ({
  address, get,
}: {address: string, get: GetRecoilValue}): string => {
  const consensusRegex = `^(${chainConfig.prefix.consensus})`;
  const validatorRegex = `^(${chainConfig.prefix.validator})`;
  const delegatorRegex = `^(${chainConfig.prefix.account})`;
  let selectedAddress = '';
  if (new RegExp(consensusRegex).test(address)) {
    // address given is a consensus
    const validator = get(readValidator(address));
    if (validator) {
      selectedAddress = validator.delegator;
    }
  } else if (new RegExp(validatorRegex).test(address)) {
    // address given is a validator
    const decode = bech32.decode(address).words;
    selectedAddress = bech32.encode(chainConfig.prefix.account, decode);
  } else if (new RegExp(delegatorRegex).test(address)) {
    // address given is a delegator
    selectedAddress = address;
  }
  return selectedAddress;
};

/**
 * Takes a delegator address and returns the profile
 * Returns null if no record found
 * ex - cosmosvalcon1... returns cosmosvaloper1...
 * @param address string
 * @returns string | null
 */
const getProfile = (address: string) => ({ get }): AvatarName => {
  const delegatorAddress = getDelegatorAddress({
    address, get,
  });
  const state = get(atomFamilyState(delegatorAddress));
  const name = R.pathOr(address, ['moniker'], state);
  const imageUrl = R.pathOr('', ['imageUrl'], state);
  return ({
    address,
    name,
    imageUrl,
  });
};

const getProfiles = (addresses: string[]) => ({ get }): AvatarName[] => {
  const profiles = addresses.map((x) => {
    const delegatorAddress = getDelegatorAddress({
      address: x, get,
    });
    const state = get(atomFamilyState(delegatorAddress));
    const name = R.pathOr(x, ['moniker'], state);
    const imageUrl = R.pathOr('', ['imageUrl'], state);
    return ({
      address: x,
      name,
      imageUrl,
    });
  });
  return profiles;
};

// ======================================================================
// selectors
// ======================================================================
export const writeProfile = selectorFamily<AvatarName, string>({
  key: 'profile.write.profile',
  get: getProfile,
  set: (address: string) => ({
    set, get,
  }, profile: AvatarName) => {
    const delegatorAddress = getDelegatorAddress({
      address, get,
    });
    if (delegatorAddress) {
      if (profile === null) {
        set(atomFamilyState(delegatorAddress), false);
      } else {
        set(atomFamilyState(delegatorAddress), {
          moniker: profile.name,
          imageUrl: profile.imageUrl,
        });
      }
    }
  },
});

export const writeProfiles = selectorFamily({
  key: 'profile.read.profiles',
  get: getProfiles,
  set: (addresses: string[]) => ({
    set, get,
  }, profiles: AvatarName[]) => {
    const delegatorAddresses = addresses.map((x) => getDelegatorAddress({
      address: x, get,
    }));

    delegatorAddresses.forEach((x, i) => {
      if (x) {
        if (profiles[i] === null) {
          set(atomFamilyState(x), false);
        } else {
          set(atomFamilyState(x), {
            moniker: R.pathOr('', [i, 'name'], profiles),
            imageUrl: R.pathOr('', [i, 'imageUrl'], profiles),
          });
        }
      }
    });
  },
});

export const readProfile = selectorFamily({
  key: 'profile.read.profile',
  get: getProfile,
});

export const readProfiles = selectorFamily({
  key: 'profile.read.profiles',
  get: getProfiles,
});

export const readDelegatorAddress = selectorFamily({
  key: 'profile.read.delegatorAddress',
  get: (address:string) => ({ get }): string => {
    return getDelegatorAddress({
      address, get,
    });
  },
});

export const readDelegatorAddresses = selectorFamily({
  key: 'profile.read.delegatorAddresses',
  get: (addresses:string[]) => ({ get }): string[] => {
    return addresses.map((x) => {
      return getDelegatorAddress({
        address: x, get,
      });
    });
  },
});
