const fs = require("fs");
const path = require("path");
const { Liquid } = require("liquidjs");
const Prismic = require("prismic-javascript");
const PrismicDOM = require("prismic-dom");

PRISMIC_URL = "https://thehorizonmagazine.cdn.prismic.io/api/v2";

async function fetchHomepageData() {
  const api = await Prismic.getApi(PRISMIC_URL);
  return (await api.getSingle("homepage")).data;
}

function engineWithRender(render) {
  const engine = new Liquid({
    root: path.resolve(__dirname, "src/views/"),
    extname: ".liquid",
  });
  engine.registerFilter("render", (data) => render(data));
  return engine;
}

async function build() {
  const data = await fetchHomepageData();
  const render = PrismicDOM.RichText.asHtml.bind(PrismicDOM);
  const engine = engineWithRender(render);
  const html = engine.renderFileSync("index", { ...data });
  fs.writeFileSync("dist/index.html", html);
}

build();
