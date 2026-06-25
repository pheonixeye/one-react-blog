import { htmlToElement } from "../utils";
import { getArticles } from "../api";
import { t, getLang } from "../i18n";

export async function renderBlogList(categoryFilter: string) {
  const articles = await getArticles();
  const lang = getLang();

  // Filter for category
  const filteredArticles = categoryFilter
    ? articles.filter(
        (a: any) =>
          (a.category?.en || a.category)?.toLowerCase() ===
          categoryFilter.toLowerCase(),
      )
    : articles; // home page shows all

  const container = document.createElement("div");
  container.className = "w-full flex flex-col md:flex-row gap-stack-lg mt-12";

  const uniqueTags = Array.from(
    new Set(
      filteredArticles.flatMap((a: any) =>
        a.tags.map((t: any) =>
          typeof t === "string" ? t : t.en || t.ar || JSON.stringify(t),
        ),
      ),
    ),
  );

  const filterContentHtml = `
    <h3 class="text-label-md text-primary mb-stack-md uppercase tracking-wider">${t("subtopics")}</h3>
    <ul class="space-y-2 filter-list">
      ${uniqueTags
        .map((tagId) => {
          // Find the actual tag object or string to get localized text
          const actualTag = filteredArticles
            .flatMap((a: any) => a.tags)
            .find(
              (t: any) =>
                (typeof t === "string"
                  ? t
                  : t.en || t.ar || JSON.stringify(t)) === tagId,
            );
          const tagText =
            typeof actualTag === "string"
              ? actualTag
              : actualTag[lang] || actualTag.en || tagId;
          const tagValue =
            typeof tagId === "string" ? tagId.replace(/"/g, "&quot;") : tagId;
          return `
          <li>
            <label class="flex items-center gap-3 p-2 rounded-md hover:bg-surface-variant cursor-pointer transition-colors group">
              <input type="checkbox" value="${tagValue}" class="tag-filter-checkbox rounded border-outline-variant bg-surface text-primary focus:ring-primary focus:ring-offset-0 focus:ring-offset-surface">
              <span class="text-body-md text-on-surface-variant group-hover:text-primary transition-colors">${tagText}</span>
            </label>
          </li>
         `;
        })
        .join("")}
    </ul>
  `;

  const asideHtml = `
    <aside class="hidden md:block w-full md:w-64 flex-shrink-0 mb-stack-lg md:mb-0 relative">
      <div class="sticky top-[100px] glass-surface rounded-xl p-stack-md">
        ${filterContentHtml}
      </div>
    </aside>
  `;

  // Inject into mobile drawer if it exists
  const mobileFiltersContainer = document.getElementById(
    "mobile-filters-container",
  );
  if (mobileFiltersContainer) {
    mobileFiltersContainer.innerHTML = filterContentHtml;
  }

  const generateArticlesHtml = (items: any[]) =>
    items
      .map(
        (article: any) => `
    <article class="glass-surface rounded-xl group hover:-translate-y-1 hover:border-outline transition-all duration-300 cursor-pointer flex flex-col h-full shadow-sm overflow-hidden" onclick="window.location.hash='article/${article.id}'">
      <div class="h-48 w-full bg-surface-container-highest relative overflow-hidden rounded-t-xl flex items-center justify-center">
        ${
          article.coverImage
            ? `<img src="${article.coverImage}" class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105 transform" alt="Cover" />`
            : `<span class="material-symbols-outlined text-6xl text-outline-variant opacity-50">developer_board</span>`
        }
      </div>
      <div class="p-stack-md flex-grow flex flex-col">
        <div class="flex gap-2 mb-stack-sm flex-wrap">
          ${article.tags
            .map((tagObj: any) => {
              const tagText =
                typeof tagObj === "string" ? tagObj : tagObj[lang] || tagObj.en;
              return `<span class="bg-primary/10 text-primary border border-primary/20 text-mono-sm px-2 py-1 rounded-full">${tagText}</span>`;
            })
            .join("")}
        </div>
        <h2 class="text-body-lg font-semibold text-on-surface mb-stack-sm group-hover:text-primary transition-colors leading-tight">${article.title[lang] || article.title.en}</h2>
        <p class="text-body-md text-on-surface-variant flex-grow line-clamp-3">${article.summary[lang] || article.summary.en}</p>
        <div class="mt-stack-md pt-stack-sm border-t border-outline-variant/30 flex items-center justify-between text-on-surface-variant text-mono-sm">
          <div class="flex items-center gap-2">
             <span class="material-symbols-outlined text-sm">schedule</span> ${article.readTime} ${t("readTime")}
          </div>
          <span class="text-primary font-medium flex items-center gap-1 group-hover:-translate-x-1 transition-transform">${t("readArticle")} <span class="material-symbols-outlined text-[16px]">arrow_forward</span></span>
        </div>
      </div>
    </article>
  `,
      )
      .join("");

  const categoryName = categoryFilter ? t(categoryFilter as any) : t("home");
  const categoryDesc = categoryFilter
    ? t(
        `desc${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}` as any,
      )
    : t("descHome");

  const mainContentHtml = `
    <div class="flex-grow">
      <header class="mb-[80px] relative">
        <h1 class="text-headline-lg-mobile md:text-display-lg text-on-surface mb-stack-sm font-bold">${categoryName}</h1>
        <p class="text-body-lg text-on-surface-variant max-w-2xl">${categoryDesc}</p>
      </header>
      <div id="articles-grid" class="grid grid-cols-1 md:grid-cols-2 gap-gutter relative">
        ${generateArticlesHtml(filteredArticles)}
      </div>
    </div>
  `;

  container.appendChild(htmlToElement(asideHtml));
  container.appendChild(htmlToElement(mainContentHtml));

  // Add filter logic
  const updateGrid = () => {
    const selectedTags = Array.from(
      new Set(
        Array.from(
          document.querySelectorAll(".tag-filter-checkbox:checked"),
        ).map((cb: any) => cb.value),
      ),
    );
    const articlesGrid = container.querySelector("#articles-grid");
    if (articlesGrid) {
      const itemsToRender =
        selectedTags.length > 0
          ? filteredArticles.filter((a: any) =>
              a.tags.some((tag: any) => {
                const tagId =
                  typeof tag === "string"
                    ? tag
                    : tag.en || tag.ar || JSON.stringify(tag);
                return selectedTags.includes(tagId);
              }),
            )
          : filteredArticles;
      articlesGrid.innerHTML = generateArticlesHtml(itemsToRender);
    }
  };

  // Sync mobile and desktop checkboxes
  const syncCheckboxes = (changedValue: string, isChecked: boolean) => {
    document
      .querySelectorAll(
        `.tag-filter-checkbox[value="${changedValue.replace(/"/g, '\\"')}"]`,
      )
      .forEach((cb: any) => {
        cb.checked = isChecked;
      });
  };

  const changeHandler = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("tag-filter-checkbox")) {
      syncCheckboxes(
        (target as HTMLInputElement).value,
        (target as HTMLInputElement).checked,
      );
      updateGrid();

      // Close mobile drawer if inside it
      if (target.closest("#mobile-filters-container")) {
        const drawer = document.querySelector("#mobile-drawer");
        if (drawer && !drawer.classList.contains("translate-x-full")) {
          drawer.classList.add("translate-x-full");
          document.body.style.overflow = "";
          const icon = document.querySelector(
            "#hamburger-btn .material-symbols-outlined",
          );
          if (icon) icon.textContent = "menu";
        }
      }
    }
  };

  // Use event delegation on document body to catch mobile drawer events too
  document.body.addEventListener("change", changeHandler);

  // Clean up listener when container is destroyed
  const observer = new MutationObserver((mutations) => {
    if (!document.body.contains(container)) {
      document.body.removeEventListener("change", changeHandler);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return container;
}
