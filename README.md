

## Notes:
Tested on Debian Bookwork 12 - Raspbian Lite
Install mpg123 media player `sudo apt-get install mpg123 -y`
sudo apt install -y i2c-tools

`sudo ln -s droidjs.service /etc/systemd/system/droidjs.service`
`sudo ln -s droidjs.socket /etc/systemd/system/droidjs.socket`
sudo systemctl daemon-reload
sudo systemctl start droidjs

`sudo cp droidjs.service /etc/systemd/system/droidjs.service`
sudo systemctl daemon-reload
sudo systemctl enable droidjs
sudo systemctl start droidjs

i2c bus not working by default
raspi-config > Interface Options > I2C


# What follows is the original readme from create-svelte
# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
