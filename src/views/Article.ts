import { htmlToElement } from "../utils";
import { getArticleById, getArticles } from "../api";
import { t, getLang } from "../i18n";

export async function renderArticle(id: string) {
  const article = await getArticleById(id);
  const lang = getLang();
  if (!article)
    return htmlToElement(
      `<div class="p-20 text-center text-display-lg text-error">${t("notFound")}</div>`,
    );

  const allArticles = await getArticles();
  const relatedArticles = allArticles
    .filter((a: any) => a.id !== id)
    .map((a: any) => ({
      ...a,
      sharedTags: a.tags.filter((tagObj: any) => {
        const tStr = typeof tagObj === "string" ? tagObj : tagObj.en;
        return article.tags.some(
          (myTag: any) =>
            (typeof myTag === "string" ? myTag : myTag.en) === tStr,
        );
      }).length,
    }))
    .filter((a: any) => a.sharedTags > 0)
    .sort((a: any, b: any) => b.sharedTags - a.sharedTags)
    .slice(0, 3);

  if (relatedArticles.length < 3) {
    const existingIds = [id, ...relatedArticles.map((a: any) => a.id)];
    const moreArticles = allArticles
      .filter((a: any) => !existingIds.includes(a.id))
      .slice(0, 3 - relatedArticles.length);
    relatedArticles.push(...moreArticles);
  }

  const relatedHtml =
    relatedArticles.length > 0
      ? `
    <div class="mt-24 pt-12 border-t border-outline-variant/20">
      <h2 class="text-headline-md text-on-surface mb-8 font-bold">${t("relatedArticles")}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${relatedArticles
          .map(
            (rel: any) => `
          <div class="glass-surface rounded-xl overflow-hidden group cursor-pointer border border-outline-variant/10 hover:border-primary/30 transition-all duration-300 flex flex-col h-full shadow-sm" onclick="window.location.hash='article/${rel.id}'">
            <div class="h-40 w-full bg-surface-container-highest relative overflow-hidden rounded-t-xl">
              ${
                rel.coverImage
                  ? `<img src="${rel.coverImage}" class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105 transform" alt="Cover" />`
                  : `<span class="material-symbols-outlined text-4xl text-outline-variant opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">developer_board</span>`
              }
            </div>
            <div class="p-6 flex-grow flex flex-col">
              <div class="flex gap-2 mb-3 flex-wrap">
                ${rel.tags
                  .slice(0, 2)
                  .map((tagObj: any) => {
                    const tagText =
                      typeof tagObj === "string"
                        ? tagObj
                        : tagObj[lang] || tagObj.en;
                    return `<span class="bg-primary/10 text-primary border border-primary/20 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">${tagText}</span>`;
                  })
                  .join("")}
              </div>
              <h3 class="text-body-lg font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors leading-tight line-clamp-2">${rel.title[lang] || rel.title.en}</h3>
              <p class="text-body-md text-on-surface-variant flex-grow line-clamp-2 text-sm">${rel.summary[lang] || rel.summary.en}</p>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `
      : "";

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title[lang] || article.title.en,
    image: [article.coverImage],
    datePublished: article.date,
    author: [
      {
        "@type": "Person",
        name:
          article.author?.name?.[lang] ||
          article.author?.name?.en ||
          article.author?.name ||
          "Unknown",
      },
    ],
  };

  const schemaHtml = `<script type="application/ld+json">${JSON.stringify(schemaMarkup)}</script>`;

  const element = htmlToElement(`
    <article class="w-full max-w-4xl mx-auto flex flex-col mt-8 pb-24 relative">
      ${schemaHtml}
      <!-- Hero Image -->
      <div class="w-full h-[300px] md:h-[400px] relative overflow-hidden bg-surface-dim rounded-2xl border border-outline-variant/20 shadow-lg">
        <img src="${article.coverImage}" class="w-full h-full object-cover opacity-80 mix-blend-screen scale-105 transform hover:scale-100 transition-transform duration-1000" alt="Cover Image" />
        <div class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        
        <div class="absolute bottom-margin-mobile start-margin-mobile flex gap-2">
           ${article.tags
             .map((tagObj: any) => {
               const tagText =
                 typeof tagObj === "string"
                   ? tagObj
                   : tagObj[lang] || tagObj.en;
               return `
             <span class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-mono-sm">
                ${tagObj.en === "Infrastructure" || tagObj === "Infrastructure" ? '<span class="w-1.5 h-1.5 rounded-full bg-primary me-2 animate-pulse"></span>' : ""}
                ${tagText}
             </span>
             `;
             })
             .join("")}
        </div>
      </div>

      <!-- Article Header -->
      <div class="pt-stack-lg pb-stack-lg border-b border-outline-variant/10">
        <h1 class="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-stack-sm leading-tight text-glow">
            ${article.title[lang] || article.title.en}
        </h1>
        
        <div class="flex items-center gap-4 mt-stack-md pt-stack-sm">
            <div class="w-12 h-12 rounded-full bg-surface-container overflow-hidden border border-outline-variant/30 flex-shrink-0">
                <img src="${article.author?.avatar}" class="w-full h-full object-cover" />
            </div>
            <div>
                <p class="text-label-md text-on-surface font-semibold">${article.author?.name?.[lang] || article.author?.name?.en || article.author?.name || "Unknown"}</p>
                <p class="text-body-md text-[14px] text-on-surface-variant">${article.author?.role ? (typeof article.author.role === "string" ? article.author.role : article.author.role[lang] || article.author.role.en) : ""} • ${new Date(article.date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
            <div class="ms-auto flex items-center gap-2">
              <div class="text-on-surface-variant text-mono-sm flex items-center gap-1 bg-surface-container px-3 py-1.5 rounded-md border border-outline-variant/20">
                  <span class="material-symbols-outlined text-[16px]">schedule</span>
                  ${article.readTime} ${t("readTime")}
              </div>
              <button class="share-btn text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 bg-surface-container px-3 py-1.5 rounded-md border border-outline-variant/20 hover:border-primary/50" aria-label="Share">
                <span class="material-symbols-outlined text-[16px]">share</span>
              </button>
            </div>
        </div>
      </div>

      <!-- Article Layout -->
      <div class="flex flex-col md:flex-row gap-8 pt-stack-lg">
        <!-- Main Content -->
        <div class="flex-grow max-w-none space-y-6 ${(article.content[lang] || article.content.en).filter((b: any) => b.type === "heading" || (b.type === "paragraph" && b.title)).length > 0 ? "md:w-2/3" : "w-full"}">
          ${(article.content[lang] || article.content.en)
            .map((block: any, index: number) => {
              if (block.type === "heading") {
                const id = `heading-${index}`;
                return `<h2 id="${id}" class="text-headline-sm font-bold text-on-surface mt-12 mb-4 scroll-mt-[120px]">${block.text}</h2>`;
              } else if (block.type === "paragraph") {
                const titleHtml = block.title
                  ? `<h3 id="para-${index}" class="text-title-lg font-semibold text-on-surface mt-8 mb-3 scroll-mt-[120px]">${block.title}</h3>`
                  : "";
                return `${titleHtml}<p class="text-body-lg text-on-surface-variant leading-relaxed">${block.text}</p>`;
              } else if (block.type === "quote") {
                return `<div class="glass-surface p-stack-md rounded-xl border-s-4 border-s-secondary relative overflow-hidden my-12"><p class="text-headline-md text-[20px] text-on-surface italic relative z-10">${block.text}</p></div>`;
              }
              return "";
            })
            .join("")}
        </div>
        
        ${
          (article.content[lang] || article.content.en).filter(
            (b: any) =>
              b.type === "heading" || (b.type === "paragraph" && b.title),
          ).length > 0
            ? `
        <!-- Sidebar (TOC) -->
        <aside class="md:w-1/3 flex-shrink-0 order-first md:order-last mb-8 md:mb-0">
          <div class="sticky top-[100px] bg-surface-container-low rounded-xl p-6 border border-outline-variant/20 shadow-sm">
             <h3 class="text-title-md font-bold mb-4 text-on-surface">${t("tableOfContents")}</h3>
             <ul class="space-y-3">
               ${(article.content[lang] || article.content.en)
                 .map((block: any, index: number) => {
                   if (block.type === "heading") {
                     return `<li><a href="javascript:void(0)" data-target="heading-${index}" class="toc-link text-body-md text-on-surface-variant hover:text-primary transition-colors block border-s-2 border-transparent hover:border-primary ps-3">${block.text}</a></li>`;
                   } else if (block.type === "paragraph" && block.title) {
                     return `<li><a href="javascript:void(0)" data-target="para-${index}" class="toc-link text-body-md text-on-surface-variant hover:text-primary transition-colors block border-s-2 border-transparent hover:border-primary ps-3 ml-4">${block.title}</a></li>`;
                   }
                   return "";
                 })
                 .join("")}
             </ul>
          </div>
        </aside>
        `
            : ""
        }
      </div>

      <!-- Footer Tags -->
      <div class="mt-stack-lg pt-stack-md border-t border-outline-variant/10">
        <div class="flex flex-wrap gap-2">
            ${article.tags
              .map((tagObj: any) => {
                const tagText =
                  typeof tagObj === "string"
                    ? tagObj
                    : tagObj[lang] || tagObj.en;
                return `<span class="px-3 py-1 rounded-md bg-surface-container text-on-surface-variant text-mono-sm border border-outline-variant/10 cursor-pointer hover:text-primary transition-colors">${tagText}</span>`;
              })
              .join("")}
        </div>
      </div>
      
      ${relatedHtml}
    </article>
  `);

  const shareBtn = element.querySelector(".share-btn");

  const showToast = () => {
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg shadow-lg text-label-md z-50 transition-opacity duration-300 opacity-0";
    toast.textContent = t("copiedToClipboard");
    document.body.appendChild(toast);

    // Trigger reflow to apply transition
    toast.offsetHeight;
    toast.classList.remove("opacity-0");

    setTimeout(() => {
      toast.classList.add("opacity-0");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2000);
  };

  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const url = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({
            title: article.title[lang] || article.title.en,
            text: article.summary[lang] || article.summary.en,
            url: url,
          });
        } catch (err) {
          // If user cancels or it fails, fallback to clipboard
          if ((err as Error).name !== "AbortError") {
            await navigator.clipboard.writeText(url);
            showToast();
          }
        }
      } else {
        await navigator.clipboard.writeText(url);
        showToast();
      }
    });
  }

  const tocLinks = element.querySelectorAll(".toc-link");
  tocLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = (e.currentTarget as HTMLElement).dataset.target;
      if (targetId) {
        const targetElement = element.querySelector(`#${targetId}`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  return element;
}
