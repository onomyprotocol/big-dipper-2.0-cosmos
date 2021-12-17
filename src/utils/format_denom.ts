import numeral from 'numeral';
import { chainConfig } from '@configs';

/**
 * Helper Function to convert the base denom to their display denom
 * @param denom The denom you wish to convert to
 * @param value The value in base denom value
 */
export const formatDenom = (value: number | string, denom = ''): TokenUnit => {
  return formatDenomByExponent(value, denom);
};

/**
 * Helper Function to convert the base denom value to the correct voting value
 * @param denom The denom you wish to convert to
 * @param value The value in base denom value
 */
export const formatVotingPower = (value: number | string, denom = ''): TokenUnit => {
  const powerReductionExponent = 6;
  return formatDenomByExponent(value, denom, powerReductionExponent);
};

const formatDenomByExponent = (value: number | string, denom = '', exponent = 0): TokenUnit => {
  const selectedDenom = chainConfig.tokenUnits[denom];

  if (typeof value !== 'string' && typeof value !== 'number') {
    value = 0;
  }

  if (typeof value === 'string') {
    value = numeral(value).value() as number;
  }

  const results = {
    value,
    denom,
    format: '0,0.[000000]',
  };

  if (!selectedDenom) {
    return results;
  }

  // if udaric is less than one edgecase
  if (value < 1) {
    value = 0;
  }
  if (exponent === 0) {
    exponent = selectedDenom.exponent;
  }
  const ratio = 10 ** exponent;
  results.value = value / ratio;
  results.denom = selectedDenom.display;
  results.format = `0,0${selectedDenom.exponent ? `.[${'0'.repeat(selectedDenom.exponent)}]` : ''}`;
  return results;
};
