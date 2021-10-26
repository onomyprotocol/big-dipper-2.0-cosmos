/* eslint-disable max-len */
import { useEffect } from 'react';
import * as R from 'ramda';
import {
  useRecoilState,
  useRecoilValue,
  SetterOrUpdater,
} from 'recoil';
import { chainConfig } from '@configs';
import {
  writeProfile, readDelegatorAddress,
} from '@recoil/profiles';
import { getProfile } from './utils';

/**
 * Accepts a delegator address and returns the appropriate profile
 * @param address
 */
export const useProfileRecoil = (address: string): AvatarName => {
  const delegatorAddress = useRecoilValue(readDelegatorAddress(address));
  const [profile, setProfile] = useRecoilState(writeProfile(delegatorAddress)) as [AvatarName, SetterOrUpdater<AvatarName>];

  useEffect(() => {
    const fetchProfile = async () => {
      const fetchedProfile = await getProfile(delegatorAddress);
      if (fetchedProfile === null) {
        setProfile(null);
      } else {
        setProfile({
          address: delegatorAddress,
          name: fetchedProfile.nickname,
          imageUrl: fetchedProfile.imageUrl,
        });
      }
    };

    if (chainConfig.extra.profile
      && delegatorAddress
      && profile === null) {
      fetchProfile();
    }
  }, []);

  return profile;
};
