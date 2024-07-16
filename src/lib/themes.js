import extend from 'licia/extend'
import isArr from 'licia/isArr'
import contain from 'licia/contain'

const keyMap = [
  'background',
  'foreground',
  'selectForeground',
  'accent',
  'highlight',
  'border',
  'primary',
  'contrast',
  'varColor',
  'stringColor',
  'keywordColor',
  'numberColor',
  'operatorColor',
  'linkColor',
  'textColor',
  'tagNameColor',
  'functionColor',
  'attributeNameColor',
  'commentColor',
]

const keyMapLen = keyMap.length

function arrToMap(arr) {
  const ret = {}

  for (let i = 0; i < keyMapLen; i++) {
    ret[keyMap[i]] = arr[i]
  }

  return ret
}

function createDarkTheme(theme) {
  if (isArr(theme)) theme = arrToMap(theme)
  if (!theme.darkerBackground) theme.darkerBackground = theme.contrast
  return extend(
    {
      consoleWarnBackground: '#332a00',
      consoleWarnForeground: '#ffcb6b',
      consoleWarnBorder: '#650',
      consoleErrorBackground: '#290000',
      consoleErrorForeground: '#ff8080',
      consoleErrorBorder: '#5c0000',
      light: '#ccc',
      dark: '#aaa',
    },
    theme
  )
}

function createLightTheme(theme) {
  if (isArr(theme)) theme = arrToMap(theme)
  if (!theme.darkerBackground) theme.darkerBackground = theme.contrast
  return extend(
    {
      consoleWarnBackground: '#fffbe5',
      consoleWarnForeground: '#5c5c00',
      consoleWarnBorder: '#fff5c2',
      consoleErrorBackground: '#fff0f0',
      consoleErrorForeground: '#f00',
      consoleErrorBorder: '#ffd6d6',
      light: '#fff',
      dark: '#eee',
    },
    theme
  )
}

const darkThemes = [
  'Dark',
  'Material Oceanic',
  'Material Darker',
  'Material Palenight',
  'Material Deep Ocean',
  'Monokai Pro',
  'Dracula',
  'Arc Dark',
  'Atom One Dark',
  'Solarized Dark',
  'Night Owl',
  'AMOLED',
]

export function isDarkTheme(theme) {
  return contain(darkThemes, theme)
}

// prettier-ignore
export default {
  Light: createLightTheme({
    darkerBackground: '#f3f3f3',
    background: '#fff',
    foreground: '#333',
    selectForeground: '#333',
    accent: '#1a73e8',
    highlight: '#eaeaea',
    border: '#ccc',
    primary: '#333',
    contrast: '#f2f7fd',
    varColor: '#c80000',
    stringColor: '#1a1aa6',
    keywordColor: '#881280',
    numberColor: '#1c00cf',
    operatorColor: '#808080',
    linkColor: '#1155cc',
    textColor: '#8097bd',
    tagNameColor: '#881280',
    functionColor: '#222',
    attributeNameColor: '#994500',
    commentColor: '#236e25',
    cssProperty: '#c80000',
  }),
  Dark: createDarkTheme({
    darkerBackground: '#333',
    background: '#242424',
    foreground: '#a5a5a5',
    selectForeground: '#eaeaea',
    accent: '#7cacf8',
    highlight: '#000',
    border: '#3d3d3d',
    primary: '#ccc',
    contrast: '#0b2544',
    varColor: '#e36eec',
    stringColor: '#f29766',
    keywordColor: '#9980ff',
    numberColor: '#9980ff',
    operatorColor: '#7f7f7f',
    linkColor: '#ababab',
    textColor: '#42597f',
    tagNameColor: '#5db0d7',
    functionColor: '#d5d5d5',
    attributeNameColor: '#9bbbdc',
    commentColor: '#747474',
  }),
  'Material Oceanic': createDarkTheme([
    '#263238', '#B0BEC5', '#FFFFFF', '#009688', '#425B67',
    '#2A373E', '#607D8B', '#1E272C', '#eeffff', '#c3e88d',
    '#c792ea', '#f78c6c', '#89ddff', '#80cbc4', '#B0BEC5',
    '#f07178', '#82aaff', '#ffcb6b', '#546e7a',
  ]),
  'Material Darker': createDarkTheme([
    '#212121', '#B0BEC5', '#FFFFFF', '#FF9800', '#3F3F3F',
    '#292929', '#727272', '#1A1A1A', '#eeffff', '#c3e88d',
    '#c792ea', '#f78c6c', '#89ddff', '#80cbc4', '#B0BEC5',
    '#f07178', '#82aaff', '#ffcb6b', '#616161',
  ]),
  'Material Lighter': createLightTheme([
    '#FAFAFA', '#546E7A', '#546e7a', '#00BCD4', '#E7E7E8',
    '#d3e1e8', '#94A7B0', '#F4F4F4', '#272727', '#91B859',
    '#7C4DFF', '#F76D47', '#39ADB5', '#39ADB5', '#546E7A',
    '#E53935', '#6182B8', '#F6A434', '#AABFC9',
  ]),
  'Material Palenight': createDarkTheme([
    '#292D3E', '#A6ACCD', '#FFFFFF', '#ab47bc', '#444267',
    '#2b2a3e', '#676E95', '#202331', '#eeffff', '#c3e88d',
    '#c792ea', '#f78c6c', '#89ddff', '#80cbc4', '#A6ACCD',
    '#f07178', '#82aaff', '#ffcb6b', '#676E95',
  ]),
  'Material Deep Ocean': createDarkTheme([
    '#0F111A', '#8F93A2', '#FFFFFF', '#84ffff', '#1F2233',
    '#41465b', '#4B526D', '#090B10', '#eeffff', '#c3e88d',
    '#c792ea', '#f78c6c', '#89ddff', '#80cbc4', '#8F93A2',
    '#f07178', '#82aaff', '#ffcb6b', '#717CB4',
  ]),
  'Monokai Pro': createDarkTheme([
    '#2D2A2E', '#fcfcfa', '#FFFFFF', '#ffd866', '#5b595c',
    '#423f43', '#939293', '#221F22', '#FCFCFA', '#FFD866',
    '#FF6188', '#AB9DF2', '#FF6188', '#78DCE8', '#fcfcfa',
    '#FF6188', '#A9DC76', '#78DCE8', '#727072',
  ]),
  Dracula: createDarkTheme([
    '#282A36', '#F8F8F2', '#8BE9FD', '#FF79C5', '#6272A4',
    '#21222C', '#6272A4', '#191A21', '#F8F8F2', '#F1FA8C',
    '#FF79C6', '#BD93F9', '#FF79C6', '#F1FA8C', '#F8F8F2',
    '#FF79C6', '#50FA78', '#50FA7B', '#6272A4',
  ]),
  'Arc Dark': createDarkTheme([
    '#2f343f', '#D3DAE3', '#FFFFFF', '#42A5F5', '#3F3F46',
    '#404552', '#8b9eb5', '#262b33', '#CF6A4C', '#8F9D6A',
    '#9B859D', '#CDA869', '#A7A7A7', '#7587A6', '#D3DAE3',
    '#CF6A4C', '#7587A6', '#F9EE98', '#747C84',
  ]),
  'Atom One Dark': createDarkTheme([
    '#282C34', '#979FAD', '#FFFFFF', '#2979ff', '#383D48',
    '#2e3239', '#979FAD', '#21252B', '#D19A66', '#98C379',
    '#C679DD', '#D19A66', '#61AFEF', '#56B6C2', '#979FAD',
    '#F07178', '#61AEEF', '#E5C17C', '#59626F',
  ]),
  'Atom One Light': createLightTheme([
    '#FAFAFA', '#232324', '#232324', '#2979ff', '#EAEAEB',
    '#DBDBDC', '#9D9D9F', '#FFFFFF', '#986801', '#50A14E',
    '#A626A4', '#986801', '#4078F2', '#0184BC', '#232324',
    '#E4564A', '#4078F2', '#C18401', '#A0A1A7',
  ]),
  'Solarized Dark': createDarkTheme([
    '#002B36', '#839496', '#FFFFFF', '#d33682', '#11353F',
    '#0D3640', '#586e75', '#00252E', '#268BD2', '#2AA198',
    '#859900', '#D33682', '#93A1A1', '#268BD2', '#839496',
    '#268BD2', '#B58900', '#B58900', '#657B83',
  ]),
  'Solarized Light': createLightTheme([
    '#fdf6e3', '#586e75', '#002b36', '#d33682', '#F6F0DE',
    '#f7f2e2', '#93a1a1', '#eee8d5', '#268BD2', '#2AA198',
    '#859900', '#D33682', '#657B83', '#268BD2', '#586e75',
    '#268BD2', '#B58900', '#657B83', '#93A1A1',
  ]),
  Github: createLightTheme([
    '#F7F8FA', '#5B6168', '#FFFFFF', '#79CB60', '#CCE5FF',
    '#DFE1E4', '#292D31', '#FFFFFF', '#24292E', '#032F62',
    '#D73A49', '#005CC5', '#D73A49', '#005CC5', '#5B6168',
    '#22863A', '#6F42C1', '#6F42C1', '#6A737D',
  ]),
  'Night Owl': createDarkTheme([
    '#011627', '#b0bec5', '#ffffff', '#7e57c2', '#152C3B',
    '#2a373e', '#607d8b', '#001424', '#addb67', '#ecc48d',
    '#c792ea', '#f78c6c', '#c792ea', '#80CBC4', '#b0bec5',
    '#7fdbca', '#82AAFF', '#FAD430', '#637777',
  ]),
  'Light Owl': createLightTheme([
    '#FAFAFA', '#546e7a', '#403f53', '#269386', '#E0E7EA',
    '#efefef', '#403F53', '#FAFAFA', '#0C969B', '#c96765',
    '#994cc3', '#aa0982', '#7d818b', '#994cc3', '#546e7a',
    '#994cc3', '#4876d6', '#4876d6', '#637777',
  ]),
  AMOLED: createDarkTheme([
    '#000000', '#8F93A2', '#FFFFFF', '#68FFAE', '#000000',
    '#41465b', '#4B526D', '#000000', '#DEFDF7', '#38ff9f',
    '#ab2eff', '#A76DF7', '#38ff9f', '#86F3C7', '#8F93A2',
    '#ab2eff', '#8293FF', '#38ff9f', '#6575c7',
  ]),
}
