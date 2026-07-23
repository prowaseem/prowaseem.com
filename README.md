# prowaseem.com

Personal portfolio for Muhammad Waseem Irshad — Senior Frontend Engineer.

## Stack

Vite + React 19 + TypeScript, Tailwind CSS v4 ("Warm Sunset" theme), Framer Motion,
Vitest + React Testing Library. Contact form delivery via [Web3Forms](https://web3forms.com).

## Development

```bash
npm install
npm run dev       # local dev server
npm run test      # run the test suite once
npm run test:watch
npm run build     # outputs static files to dist/
npm run preview   # preview the production build locally
```

## Contact form setup

Get a free access key at https://web3forms.com, then create `.env.local`:

```
VITE_WEB3FORMS_ACCESS_KEY=your-access-key-here
```

## Deployment

`npm run build` produces a self-contained `dist/` folder. Sync its contents to the
S3 bucket backing prowaseem.com (outside the scope of this repo).
