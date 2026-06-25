import { htmlToElement } from "../utils";
import { t, setLang, getLang } from "../i18n";

export function renderNav() {
  const currentPath = window.location.hash.slice(1).split("/")[0] || "";

  const navContainer = htmlToElement(`
    <header>
      <nav class="bg-surface/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant/10 shadow-sm transition-all duration-300">
        <div class="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 max-w-container-max mx-auto w-full">
          <div class="flex items-center gap-4">
            <a href="#/" class="text-headline-md font-bold text-primary hover:text-primary-fixed transition-colors active:scale-95 duration-200">
              ${t("brand")}
            </a>
          </div>
          <div class="flex items-center gap-stack-md">
            <button id="lang-toggle" class="text-on-surface-variant hover:text-primary transition-colors font-mono-sm border border-outline-variant/30 px-3 py-1 rounded-full">
              ${getLang() === "ar" ? "EN" : "عربي"}
            </button>
            <button class="book-demo-btn hidden md:inline-flex items-center justify-center bg-gradient-to-r from-inverse-primary to-secondary text-background text-label-md font-medium px-4 py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md">
                ${t("bookDemo")}
            </button>
            <button id="hamburger-btn" class="md:hidden text-primary active:scale-95 transition-transform z-50">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">menu</span>
            </button>
          </div>
        </div>
      </nav>
      
      <!-- Mobile Drawer -->
      <div id="mobile-drawer" class="fixed inset-0 bg-background z-40 transform translate-x-full transition-transform duration-300 md:hidden pt-24 px-6 flex flex-col gap-6 overflow-y-auto">
        <div id="mobile-drawer-content" class="flex flex-col gap-6">
          <button class="book-demo-btn inline-flex items-center justify-center bg-gradient-to-r from-inverse-primary to-secondary text-background text-label-md font-medium px-4 py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md">
              ${t("bookDemo")}
          </button>
          <!-- Filters container for mobile -->
          <div id="mobile-filters-container"></div>
        </div>
      </div>

      <!-- Demo Modal -->
      <div id="demo-modal" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] hidden flex-col items-center justify-center p-4">
        <div class="bg-surface-container-low w-full max-w-md rounded-2xl border border-outline-variant/20 shadow-xl overflow-hidden relative">
          <button id="close-modal-btn" class="absolute top-4 end-4 text-on-surface-variant hover:text-primary transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
          <div class="p-6 md:p-8">
            <h2 class="text-headline-md font-bold text-on-surface mb-2">${t("bookDemo")}</h2>
            <p class="text-body-md text-on-surface-variant mb-6">${t("messagePlaceholder")}</p>
            <form id="demo-form" class="flex flex-col gap-4">
              <input type="text" placeholder="${t("namePlaceholder")}" class="bg-surface border border-outline-variant/50 rounded-lg px-4 py-3 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface w-full" required />
              <input type="email" placeholder="${t("emailPlaceholder")}" class="bg-surface border border-outline-variant/50 rounded-lg px-4 py-3 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface w-full" required />
              <input type="text" placeholder="${t("medicalSpecialityPlaceholder")}" class="bg-surface border border-outline-variant/50 rounded-lg px-4 py-3 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface w-full" required />
              <div class="flex flex-col gap-1">
                <label class="text-label-sm text-on-surface-variant ms-1">${t("timeForDemoPlaceholder")}</label>
                <input type="date" class="bg-surface border border-outline-variant/50 rounded-lg px-4 py-3 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface w-full" required />
              </div>
              <button type="submit" class="bg-primary text-on-primary py-3 px-6 rounded-lg font-label-lg uppercase tracking-wider hover:bg-primary-fixed transition-colors mt-2 w-full shadow-md">
                ${t("submitForm")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  `);

  navContainer.querySelector("#lang-toggle")?.addEventListener("click", () => {
    setLang(getLang() === "ar" ? "en" : "ar");
  });

  navContainer
    .querySelector("#hamburger-btn")
    ?.addEventListener("click", () => {
      const drawer = navContainer.querySelector("#mobile-drawer");
      const icon = navContainer.querySelector(
        "#hamburger-btn .material-symbols-outlined",
      );
      const isClosed = drawer?.classList.contains("translate-x-full");

      if (isClosed) {
        drawer?.classList.remove("translate-x-full");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
        if (icon) icon.textContent = "close";
      } else {
        drawer?.classList.add("translate-x-full");
        document.body.style.overflow = "";
        if (icon) icon.textContent = "menu";
      }
    });

  const modal = navContainer.querySelector("#demo-modal");
  const closeBtn = navContainer.querySelector("#close-modal-btn");
  const demoBtns = navContainer.querySelectorAll(".book-demo-btn");
  const form = navContainer.querySelector("#demo-form");

  demoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modal?.classList.remove("hidden");
      modal?.classList.add("flex");
    });
  });

  closeBtn?.addEventListener("click", () => {
    modal?.classList.add("hidden");
    modal?.classList.remove("flex");
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal?.classList.add("hidden");
      modal?.classList.remove("flex");
    }
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const nameInput = target.querySelector('input[type="text"]:nth-of-type(1)') as HTMLInputElement | null;
    const emailInput = target.querySelector('input[type="email"]') as HTMLInputElement | null;
    const specialityInput = target.querySelector('input[type="text"]:nth-of-type(2)') as HTMLInputElement | null;
    const dateInput = target.querySelector('input[type="date"]') as HTMLInputElement | null;

    const data = {
      name: nameInput?.value,
      email: emailInput?.value,
      speciality: specialityInput?.value,
      date: dateInput?.value,
    };
    
    try {
      const { pb } = await import("../lib/pocketbase");
      await pb.collection('demo_requests').create(data);
      modal?.classList.add("hidden");
      modal?.classList.remove("flex");
      alert("Request submitted!");
      target.reset();
    } catch (error) {
      console.error("PocketBase error:", error);
      alert("Failed to submit request. Please try again.");
    }
  });

  return navContainer;
}
