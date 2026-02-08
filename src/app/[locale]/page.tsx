import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-ivory text-charcoal">
      <h1 className="text-5xl font-serif font-bold mb-4 tracking-tight">
        {t('title')}
      </h1>
      <p className="max-w-2xl text-xl text-center font-sans tracking-wide leading-relaxed opacity-80">
        {t('description')}
      </p>
    </div>
  );
}
