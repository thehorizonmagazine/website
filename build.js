import path from "path";
import { fileURLToPath } from "url";
import { Liquid } from "liquidjs";
import Prismic from "prismic-javascript";
import PrismicDOM from "prismic-dom";
import { glob, fs, $ } from "zx";

const PRISMIC_URL = "https://thehorizonmagazine.cdn.prismic.io/api/v2";
const DROPBOX_URL = "https://www.dropbox.com/sh/0p6m7q2iqvb8ck5/AAAHsyIeaHag_Shls6085-cca?dl=1"

async function fetchHomepageData() {
  const api = await Prismic.getApi(PRISMIC_URL);
  return (await api.getSingle("homepage")).data;
}

function engineWithRender(render) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const engine = new Liquid({
    root: path.resolve(__dirname, "src/views/"),
    extname: ".liquid",
  });
  engine.registerFilter("render", (data) => render(data));
  return engine;
}

async function getIssues() {
  if (!fs.pathExistsSync('issues')) {
    await $`curl ${DROPBOX_URL} -L -o issues.zip`
    await $`unzip issues.zip -x / -d issues/`
  }

  const filePaths = await glob("./issues/*.pdf");
  const issues = filePaths.sort().map((path) => {
    const title = path.split("/").pop().split(".pdf")[0];
    const slug = title.replace(/ /g, "_");
    const href = `./${slug}`;
    return {
      path,
      title,
      slug,
      href,
    };
  });

  issues.forEach(({ path, slug }) => {
    fs.copySync(path, `./dist/${slug}.pdf`);
  });

  return issues;
}

async function build() {
  try {
    const data = await fetchHomepageData();

    const issues = await getIssues();

    const render = PrismicDOM.RichText.asHtml.bind(PrismicDOM);
    const engine = engineWithRender(render);
    const html = engine.renderFileSync("index", {
      ...data,
      editionslist: issues,
    });
    fs.writeFileSync("dist/index.html", html);

    issues.forEach(({ path, title, slug }) => {
      const html = engine.renderFileSync("issue", {
        title,
        slug,
      });

      const dirName = `dist/${slug}`
      fs.ensureDirSync(dirName)
      fs.writeFileSync(`${dirName}/index.html`, html);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

build();
