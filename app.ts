import express, { Request, Response } from 'express';
import icons from './dist/icons.json';

const app = express();
const PORT = process.env.PORT || 3000;

const iconNameList: string[] = [
  ...new Set(Object.keys(icons).map(i => i.split('-')[0])),
];

const shortNames: { [key: string]: string } = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  tailwind: 'tailwindcss',
  vue: 'vuejs',
  nuxt: 'nuxtjs',
  go: 'golang',
  cf: 'cloudflare',
  wasm: 'webassembly',
  postgres: 'postgresql',
  k8s: 'kubernetes',
  next: 'nextjs',
  mongo: 'mongodb',
  md: 'markdown',
  ps: 'photoshop',
  ai: 'illustrator',
  pr: 'premiere',
  ae: 'aftereffects',
  scss: 'sass',
  sc: 'scala',
  net: 'dotnet',
  gatsbyjs: 'gatsby',
  gql: 'graphql',
  vlang: 'v',
  amazonwebservices: 'aws',
  bots: 'discordbots',
  express: 'expressjs',
  googlecloud: 'gcp',
  mui: 'materialui',
  windi: 'windicss',
  unreal: 'unrealengine',
  nest: 'nestjs',
  ktorio: 'ktor',
  pwsh: 'powershell',
  au: 'audition',
  rollup: 'rollupjs',
  rxjs: 'reactivex',
  rxjava: 'reactivex',
  ghactions: 'githubactions',
  sklearn: 'scikitlearn',
  uniswap: 'uniswap',
  pancakeswap: 'pancakeswap',
  jup6: 'jup6',
  solana: 'solana',
  polygon: 'polygon',
  bnb: 'bnb',
  ethereum: 'ethereum',
};

const themedIcons: string[] = [
  ...Object.keys(icons)
    .filter(i => i.includes('-light') || i.includes('-dark'))
    .map(i => i.split('-')[0]),
];

const ICONS_PER_LINE = 15;
const ONE_ICON = 48;
const SCALE = ONE_ICON / (300 - 44);

function generateSvg(iconNames: string[], perLine: number): string {
  const iconSvgList = iconNames.map(i => icons[i]);

  const length = Math.min(perLine * 300, iconNames.length * 300) - 44;
  const height = Math.ceil(iconSvgList.length / perLine) * 300 - 44;
  const scaledHeight = height * SCALE;
  const scaledWidth = length * SCALE;

  return `
  <svg width="${scaledWidth}" height="${scaledHeight}" viewBox="0 0 ${length} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
    ${iconSvgList
      .map(
        (i, index) =>
          `
        <g transform="translate(${(index % perLine) * 300}, ${
            Math.floor(index / perLine) * 300
          })">
          ${i}
        </g>
        `
      )
      .join(' ')}
  </svg>
  `;
}

function parseShortNames(names: string[], theme: string = 'dark'): string[] {
  return names
    .map(name => {
      if (iconNameList.includes(name))
        return name + (themedIcons.includes(name) ? `-${theme}` : '');
      else if (name in shortNames)
        return (
          shortNames[name] +
          (themedIcons.includes(shortNames[name]) ? `-${theme}` : '')
        );
      else return '';
    })
    .filter(Boolean);
}

// 路由处理
app.get('/icons', (req: Request, res: Response) => {
  const iconParam = req.query.i || req.query.icons;
  if (!iconParam) return res.status(400).send("You didn't specify any icons!");

  const theme = req.query.t || req.query.theme;
  if (theme && theme !== 'dark' && theme !== 'light')
    return res.status(400).send('Theme must be either "light" or "dark"');

  const perLine = parseInt(
    (req.query.perline as string) || `${ICONS_PER_LINE}`,
    10
  );
  if (isNaN(perLine) || perLine < -1 || perLine > 50)
    return res
      .status(400)
      .send('Icons per line must be a number between 1 and 50');

  let iconShortNames: string[] = [];
  if (iconParam === 'all') iconShortNames = iconNameList;
  else iconShortNames = (iconParam as string).split(',');

  const iconNames = parseShortNames(
    iconShortNames,
    (theme as string) || undefined
  );
  if (!iconNames.length)
    return res.status(400).send("You didn't format the icons param correctly!");

  const svg = generateSvg(iconNames, perLine);

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

app.get('/api/icons', (req: Request, res: Response) => {
  res.json(iconNameList);
});

app.get('/api/svgs', (req: Request, res: Response) => {
  res.json(icons);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
