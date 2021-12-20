# [thehorizonmagazine.com](https://thehorizonmagazine.com)

Code lives in this GitHub repository.

Content lives in [Prismic](https://prismic.io).

Website is hosted by [Vercel](https://vercel.com), which listens for updates from GitHub and Prismic and rebuilds automatically when changes are detected.

The connection from Prismic to Vercel looks like this:

<img width="1362" alt="Screenshot 2021-12-16 at 08 34 10" src="https://user-images.githubusercontent.com/96229206/146682997-eabcc704-0d74-4667-9754-eee6f2cafba8.png">

The connection from GitHub to Vercel is configured on the Vercel side and looks like this:

![Screenshot 2021-12-16 at 08 28 13](https://user-images.githubusercontent.com/96229206/146683036-d7fd461c-be99-4f84-a6bd-bbeacb28bebd.png)

## How the code works

The [`build.js`](build.js) file asks Prismic for the "homepage" data and then injects that data into the [`index.liquid`](src/views/index.liquid) template. Styling (CSS) comes from the [`style.css`](src/style.css) file

## Troubleshooting

You can see logs for failed deployments by selecting a deployment from [the list in Vercel](https://vercel.com/thehorizonmagazine/website/deployments) and expanding the "building" section (see below).

<img width="1070" alt="Screenshot 2021-12-20 at 19 07 32" src="https://user-images.githubusercontent.com/96229206/146819566-9c33f92a-4897-4572-976e-af11fb082291.png">

If a build fails, it'll probably be because the [`index.liquid`](src/views/index.liquid) template references a variable that doesn't exist on the Prismic side. Variables are referenced in the template in curly brackets like this: `{{ prismic_variable_name | render }}`. 

Hopefully breaking changes will be spotted in the build process and won't get deployed to the "Production" (live) instance of the website. If they do, you can roll back to a previous version of the website by viewing [the list of deployments in Vercel](https://vercel.com/thehorizonmagazine/website/deployments) and clicking "Promote to Production". You can preview that version of the website by selecting "Visit". I don't know how long these old versions stick around for but it might be forever..?

<img width="1137" alt="Screenshot 2021-12-20 at 19 11 33" src="https://user-images.githubusercontent.com/96229206/146820255-11652d64-5366-44eb-a6ec-521c15beec85.png">

## Previewing changes to the code

Want to test out a change without affecting the "Production" instance of the website? Here's an example of how you could do that:

You could change the color of links on the website from black to green [here](https://github.com/thehorizonmagazine/website/blob/8f3b25168b9404c00e21e6dfc90d9149bd352882/src/style.css#L52) using the edit button (see below)...

<img width="1191" alt="Screenshot 2021-12-20 at 19 24 18" src="https://user-images.githubusercontent.com/96229206/146821663-675c8056-82e1-414a-abf4-609086a28474.png">

And then scroll to the bottom of the page to "commit" your changes (and this is the important bit) to _a new branch_ (the name doesn't matter).

<img width="800" alt="Screenshot 2021-12-20 at 19 25 05" src="https://user-images.githubusercontent.com/96229206/146821808-ce00cfda-dee5-47b5-bd8a-d25190f4ddaa.png">

Once that's committed (you don't need to follow through to creating a pull request, although that gives you a nice "merge" button to click later if you're happy with the change) you should see an automatic deployment appear in Vercel under "Preview Deployments" on the overview page. From there, you can see whether the build succeeded, and visit the site to see how it looks. It looks like you're allowed to create 100 deployments per day. I think any changes after that would be ignored by Vercel until tomorrow.
