# [thehorizonmagazine.com](https://thehorizonmagazine.com)

Code lives in this GitHub repository.

Content lives in [Prismic](https://prismic.io).

Issue PDFs live in [Dropbox](https://www.dropbox.com/home/HorizonIssues).

Website is hosted by [Vercel](https://vercel.com), which listens for updates from GitHub and Prismic and rebuilds automatically when changes are detected.

The connection from Prismic to Vercel looks like this:

<img width="1362" alt="Screenshot 2021-12-16 at 08 34 10" src="https://user-images.githubusercontent.com/96229206/146682997-eabcc704-0d74-4667-9754-eee6f2cafba8.png">

The connection from GitHub to Vercel is configured on the Vercel side and looks like this:

![Screenshot 2021-12-16 at 08 28 13](https://user-images.githubusercontent.com/96229206/146683036-d7fd461c-be99-4f84-a6bd-bbeacb28bebd.png)

## How the code works

The [`build.js`](build.js) file asks Prismic for the "homepage" data and then injects that data into the [`index.liquid`](src/views/index.liquid) template. Styling (CSS) comes from the [`style.css`](src/style.css) file

The build.js file also downloads the issue PDFs from dropbox and creates a page for each issue, using the dropbox filename as the issue title. A mapping of `issue title -> issue URL` is created and used to generate the `editionslist` section of the homepage.

Each issue page embeds the issue PDF like this: `<iframe src="./{{ slug }}.pdf#toolbar=0" width="100%" height="100%" style="border: none;"></iframe>` and `{{ slug }}` is 'injected' into the template in the build.js file.
The `toolbar=0` parameter in the iframe src instructs the pdf reader to hide its toolbar but this only works in chrome-based browsers.

Because PDF support in mobile browsers is hit and miss, mobile users are directed to the actual PDF files (not webpages where those files are embedded). 
This is achieved through script tags at the bottom of the `index.liquid` and `issue.liquid` template files. In `index.liquid` we adjust the hyperlink destination
for each issue to point directly to the PDF if we detect you're on a mobile device, and if you land on the issue page we forcibly redirect you to the PDF 
(this would happen if a desktop user sent you a link to a specific issue and you opened it on a phone).

## Releasing new issues

Changes in Dropbox (e.g. renaming an issue, releasing a new issue, removing an issue) will not automatically trigger a re-build of the website.

To manually trigger a re-build, visit [the deployments page for the site in Vercel](https://vercel.com/thehorizonmagazine/website/deployments?environment=production), and 'Redeploy' the most recent deployment.
It might ask if you want to use the existing build cache: say no. You want to re-run the full build so that a fresh copy of the Dropbox folder is used.

![how to redeploy](https://github.com/thehorizonmagazine/website/assets/4623769/a954d0f3-76bb-43e3-9cdf-9c192843f654)

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
