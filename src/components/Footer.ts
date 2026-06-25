import { htmlToElement } from "../utils";
import { t } from "../i18n";

export function renderFooter() {
  const footerElement = htmlToElement(`
    <footer class="bg-surface-container-lowest w-full py-stack-lg border-t border-outline-variant/10 mt-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div class="flex flex-col gap-stack-sm justify-between">
          <div>
            <span class="text-headline-md font-bold text-on-surface">${t("brand")}</span>
            <p class="text-body-md text-on-surface-variant max-w-sm mt-4">
              ${t("descHome")}
            </p>
          </div>
          <span class="text-mono-sm text-outline mt-8">© 2026 ${t("brand")}. ${t("footerRights")}</span>
        </div>
        
        <div class="flex flex-col gap-4 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
          <span class="text-title-lg text-on-surface font-bold mb-2">${t("requestQuote")}</span>
          <form class="flex flex-col gap-4">
            <input type="text" placeholder="${t("namePlaceholder")}" class="bg-surface border border-outline-variant/50 rounded-lg px-4 py-3 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface w-full" required />
            <input type="email" placeholder="${t("emailPlaceholder")}" class="bg-surface border border-outline-variant/50 rounded-lg px-4 py-3 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface w-full" required />
            <textarea placeholder="${t("messagePlaceholder")}" rows="3" class="bg-surface border border-outline-variant/50 rounded-lg px-4 py-3 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface w-full resize-none" required></textarea>
            <button type="submit" class="bg-primary text-on-primary py-3 px-6 rounded-lg font-label-lg uppercase tracking-wider hover:bg-primary-fixed transition-colors mt-2 self-start md:self-auto w-full md:w-auto">
              ${t("submitForm")}
            </button>
          </form>
        </div>
      </div>
    </footer>
  `);

  const form = footerElement.querySelector('form');
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const nameInput = target.querySelector('input[type="text"]') as HTMLInputElement | null;
    const emailInput = target.querySelector('input[type="email"]') as HTMLInputElement | null;
    const messageInput = target.querySelector('textarea') as HTMLTextAreaElement | null;

    const data = {
      name: nameInput?.value,
      email: emailInput?.value,
      message: messageInput?.value,
    };
    
    try {
      const { pb } = await import("../lib/pocketbase");
      await pb.collection('quote_requests').create(data);
      alert("Quote request submitted successfully!");
      target.reset();
    } catch (error) {
      console.error("PocketBase error:", error);
      alert("Failed to submit request. Please try again.");
    }
  });

  return footerElement;
}
