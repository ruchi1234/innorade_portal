/*
 * Colors
 */
export const white = '#ffffff';

export const martinique = '#2c2b49';
export const space = '#303939';
export const mineshaft = '#333';
export const turquoise = '#49d0bf';
export const scampi = '#6563a4';
export const plum = '#805275';
export const edward = '#aeb8b8';
export const iron = '#d7d9d9';
export const mellow = '#dee458';
export const selago = '#dfdfea';
export const mercury = '#e5e5e5';
export const gallery = '#ebebeb';
export const haze = '#eff1f1';
export const lightGrey = '#f0f0f0';
export const wildSand = '#f4f4f4';

export const facebook = '#3b5998';
export const twitter = '#1da1f2';
export const pinterest = '#C92228';
export const instagram = '#405de6';

export const mobileOnly = (style) => ({
  '@media (max-width: 990px)': style,
});

export const quicksand = {
  fontFamily: 'Quicksand',
  fontStyle: 'normal',
  fontWeight: '400',
  src: "local('Quicksand Regular'), local('Quicksand-Regular'), url(https://fonts.gstatic.com/s/quicksand/v5/sKd0EMYPAh5PYCRKSryvW1tXRa8TVwTICgirnJhmVJw.woff2) format('woff2')",
  unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000',
};

export const raleway = {
  fontFamily: 'Raleway',
  fontStyle: 'normal',
  fontWeight: 'normal',
  src: "local('Raleway'), local('Raleway-Regular'), url(https://fonts.gstatic.com/s/raleway/v11/0dTEPzkLWceF7z0koJaX1A.woff2) format('woff2')",
  unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000',
};

export const reset = {
  color: 'black',
  fontFamily: raleway,
  fontWeight: 400,
};
