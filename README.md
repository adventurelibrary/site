# Adventure Library Nuxt

## Public Site
```
npm i
npm run dev
```

## Admin Site
```
npm run dev-admin
```

## Deploy

```
npm i
npm run build
npm start
```

# Modules
A "module" represents a grouping of logic and components, generally related to a specific data item: User, Asset, Bundle, etc.

Each module folder has TypeScript code in its root, and Vue components in a `components` folder.

A rule of thumb for where a file pertaining to a module should go is:
 - Is it a page someone should be able to navigate to? If yes, it's probably meant to go in the `pages` directory explained below.
 - Does it render a Vue template or HTML onto the page? If yes, it should be a .vue file in components.
 - Is it TypeScript logic that could be used regardless of framework? If yes, it should be a .ts file in the module's root.

# Routing
The `pages` folder is used to generate the routes of the site. A file at `pages/users.vue` will be available at the route `/users`

Folder structure is preserved. Files named `index.vue` will serve as folder indexes.

Using a _ before the filename enables route param support. A file at `pages/asset/_slug.vue` will accept routes like `asset/some-art` and the value "some-art" will be available in the routes "params".

# EC2 Instance Deployment
https://testing.adventurelibrary.art points to an Amazon EC2 instance that is running our Nuxt project.

## Node
The Nuxt instance is started with `systemd`. 

The configuration file for the nuxt instance is here `/lib/systemd/system/testing.adventurelibrary.art.service`

After making changes to that config file you need to run `sudo systemctl daemon-reload`.

Restart the service: `sudo systemctl restart testing.adventurelibrary.art.service`

You can view logs of the Nuxt project with: `journalctl -b -f -n 100`

## Nginx
The server is configured with nginx to forward the port 80 from testing.adventurelibrary.art to the port that Nuxt is running on.

Edit config: `sudo vim /etc/nginx/nginx.conf`

Test config to check for errors: `sudo nginx -t`

Restart nginx: `sudo nginx -s reload`

# Automated Deploy on EC2
The following scripts need to exist in the same directory as the Nuxt folder. For example: "/home/ec2-user/site"

### `deploy.sh`

```bash
#!/bin/bash
cd /home/ec2-user/site
git pull origin master
npm install
npm run build
sudo systemctl restart testing.adventurelibrary.art.service
```

### `deploy-checker.sh`

```bash
#!/bin/bash

cd /home/ec2-user/site

PREV_FILE="./prev-log.txt"
CURR_FILE="./curr-log.txt"

LAST_LOG=`cat $PREV_FILE`

echo "Last log: $LAST_LOG"

git fetch origin master
git log -n 1 --pretty=short > $CURR_FILE

CURR_LOG=`cat $CURR_FILE`

echo "Curr Log: $CURR_LOG"

if [ "$LAST_LOG" = "$CURR_LOG" ]; then
        echo "No changes"
else
        echo "Log has changed! Time to redeploy."
        echo "Saving current log to prev-log.txt"
        cp ./curr-log.txt ./prev-log.txt
        echo "Running redeploy script"
        sh ./deploy.sh
        echo "Done running deploy script"
fi
```

You must run **chmod +x {file}** on each so that they can be executed.

You can **manually redeploy** by running `./deploy.sh` in the site folder.

## Redeploy Cronjob
Run `crontab -e` to edit the crontab, then add this line:

`*/5 * * * * /home/ec2-user/site/deploy-checker.sh` to check for new code every 5 minutes.

If you want to change the timing, here are some examples: https://crontab.guru/examples.html

You can **view the logs** with: `tail /var/spool/mail/ec2-user -n 200`
