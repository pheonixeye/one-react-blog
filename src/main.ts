import "./index.css";
import { renderNav } from "./components/Nav";
import { renderFooter } from "./components/Footer";
import { renderBlogList } from "./views/BlogList";
import { renderArticle } from "./views/Article";
import { getLang, setLang } from "./i18n";

const root = document.getElementById("root");

async function route() {
  if (!root) return;
  const hash = window.location.hash.slice(1);
  const [path, id] = hash.split("/");

  root.innerHTML = "";
  root.appendChild(renderNav());

  const main = document.createElement("main");
  main.className =
    "flex-grow w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-[80px] md:pt-[100px] flex flex-col";
  root.appendChild(main);

  try {
    if (
      ["product", "engineering", "operations", "culture"].includes(path) ||
      !path
    ) {
      main.appendChild(await renderBlogList(path || ""));
    } else if (path === "article" && id) {
      main.appendChild(await renderArticle(id));
    } else {
      main.innerHTML =
        '<div class="p-20 text-center text-headline-md text-on-surface">404 Not Found</div>';
    }
  } catch (error) {
    console.error("Routing error:", error);
    main.innerHTML =
      '<div class="p-20 text-center text-error text-body-lg">An error occurred loading the page.</div>';
  }

  root.appendChild(renderFooter());
  window.scrollTo(0, 0);
}

// Initial setup
setLang("ar"); // Default to Arabic

window.addEventListener("hashchange", route);
window.addEventListener("languagechange", route);

route();
