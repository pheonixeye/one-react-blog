import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-margin-mobile md:px-margin-desktop">
      <div className="text-center max-w-md">
        <h1 className="text-[120px] md:text-[160px] font-bold text-primary/20 leading-none mb-4 select-none">
          404
        </h1>
        <p className="text-headline-md text-on-surface mb-3">
          الصفحة غير موجودة
        </p>
        <p className="text-body-lg text-on-surface-variant mb-2">
          Page not found
        </p>
        <p className="text-body-md text-on-surface-variant mb-8">
          قد تكون الصفحة قد انتقلت أو تم حذفها. اختر اللغة للانتقال إلى الصفحة الرئيسية.
          <br />
          The page may have moved or been deleted. Choose a language to go to the homepage.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/ar/"
            className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-lg hover:brightness-110 transition-all"
          >
            العربية
          </Link>
          <Link
            href="/en/"
            className="bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-label-lg hover:brightness-110 transition-all"
          >
            English
          </Link>
        </div>
      </div>
    </div>
  );
}
