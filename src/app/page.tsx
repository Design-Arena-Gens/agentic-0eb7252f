'use client';

/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Check, Copy, Download, ImageIcon, LayoutDashboard, Sparkles, Upload } from 'lucide-react';
import clsx from 'clsx';

type Template = {
  id: string;
  name: string;
  description: string;
  backgroundClass: string;
  accentColor: string;
  textClass: string;
  badgeClass: string;
  overlayClass: string;
  subtleTextClass: string;
  surfaceClass: string;
  imageOverlayClass: string;
  focusPanelClass: string;
};

const TEMPLATES: Template[] = [
  {
    id: 'sunset-glow',
    name: 'Coucher de soleil',
    description: 'Dégradé vibrant pour un effet haut de gamme',
    backgroundClass:
      'bg-gradient-to-br from-orange-500 via-rose-500 to-violet-600',
    accentColor: '#FDE68A',
    textClass: 'text-white',
    badgeClass: 'bg-white/85 text-rose-600',
    overlayClass: 'bg-black/20',
    subtleTextClass: 'text-white/75',
    surfaceClass: 'bg-white/10 backdrop-blur-sm',
    imageOverlayClass: 'bg-black/15',
    focusPanelClass: 'bg-black/35 backdrop-blur',
  },
  {
    id: 'fresh-mint',
    name: 'Menthe fraîche',
    description: 'Palette douce et minimaliste pour produits modernes',
    backgroundClass: 'bg-gradient-to-br from-emerald-200 via-white to-sky-200',
    accentColor: '#0F766E',
    textClass: 'text-slate-900',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    overlayClass: 'bg-white/40',
    subtleTextClass: 'text-slate-600',
    surfaceClass: 'bg-white/70 backdrop-blur',
    imageOverlayClass: 'bg-slate-900/5',
    focusPanelClass: 'bg-white/80 backdrop-blur text-slate-900',
  },
  {
    id: 'noir-chic',
    name: 'Noir & Or',
    description: 'Look premium avec contraste affirmé',
    backgroundClass: 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800',
    accentColor: '#F59E0B',
    textClass: 'text-zinc-50',
    badgeClass: 'bg-amber-100/90 text-amber-700',
    overlayClass: 'bg-white/5',
    subtleTextClass: 'text-zinc-300/80',
    surfaceClass: 'bg-white/5 backdrop-blur',
    imageOverlayClass: 'bg-zinc-950/20',
    focusPanelClass: 'bg-black/40 backdrop-blur',
  },
];

const LAYOUTS = [
  {
    id: 'split' as const,
    name: 'Visuel + texte',
    description: 'Produit en évidence avec texte sur le côté',
  },
  {
    id: 'focus' as const,
    name: 'Focus produit',
    description: 'Produit au centre, texte en superposition',
  },
  {
    id: 'story' as const,
    name: 'Narratif',
    description: 'Texte principal en grand, visuel secondaire',
  },
];

const FORMAT_SIZE = 1080;

export default function Home() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    TEMPLATES[0].id,
  );
  const [layout, setLayout] = useState<(typeof LAYOUTS)[number]['id']>('split');
  const [headline, setHeadline] = useState('Nouveau parfum d’été');
  const [subheadline, setSubheadline] = useState(
    'Fraîcheur tropicale pour illuminer vos journées.',
  );
  const [price, setPrice] = useState('49,90 €');
  const [cta, setCta] = useState('Commander maintenant');
  const [badge, setBadge] = useState('Édition limitée');
  const [hashtags, setHashtags] = useState('#nouveauté #madeinfrance #bonplan');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const designRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const template = useMemo(
    () => TEMPLATES.find((item) => item.id === selectedTemplateId)!,
    [selectedTemplateId],
  );

  const generatedCaption = useMemo(() => {
    const paragraphs = [
      `✨ ${headline}`,
      subheadline,
      price ? `💰 ${price}` : null,
      cta ? `👉 ${cta}` : null,
      hashtags,
    ].filter(Boolean);

    return paragraphs.join('\n\n');
  }, [headline, subheadline, price, cta, hashtags]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    previewUrlRef.current = objectUrl;
    setImageSrc(objectUrl);
  };

  const handleResetImage = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setImageSrc(null);
  };

  const handleDownload = async () => {
    if (!designRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(designRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        width: FORMAT_SIZE,
        height: FORMAT_SIZE,
      });

      const link = document.createElement('a');
      link.download = 'facebook-post.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Impossible de générer le visuel', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(generatedCaption);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Copie impossible', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 lg:px-10">
          <div>
            <div className="flex items-center gap-2 text-slate-700">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">
                Studio Social
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
              Transformez votre visuel produit en post Facebook percutant
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-base">
              Téléchargez votre produit, personnalisez le texte et exportez un
              visuel carré optimisé pour Facebook en quelques secondes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500 bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          >
            <Upload className="h-4 w-4" />
            Importer un visuel
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 pt-10 lg:grid-cols-[1.2fr_0.9fr] lg:px-10">
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <LayoutDashboard className="h-5 w-5 text-emerald-500" />
                Aperçu du post (1080 × 1080)
              </h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600 disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  {isDownloading ? 'Génération…' : 'Télécharger'}
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <div
                ref={designRef}
                className={clsx(
                  'relative aspect-square w-full max-w-[540px] overflow-hidden rounded-[36px] border border-slate-200 shadow-lg transition-all',
                  template.backgroundClass,
                )}
              >
                <div className={clsx('absolute inset-0', template.overlayClass)} />
                <div className={clsx('relative z-10 flex h-full flex-col p-8', template.textClass)}>
                  <div className="flex items-center justify-between">
                    {badge ? (
                      <span
                        className={clsx(
                          'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
                          template.badgeClass,
                        )}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {badge}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span
                      className={clsx(
                        'text-xs uppercase tracking-[0.4em]',
                        template.subtleTextClass,
                      )}
                    >
                      Facebook
                    </span>
                  </div>

                  <div className="mt-8 flex flex-1 flex-col">
                    {layout === 'split' && (
                      <div className="grid h-full gap-6" style={{ gridTemplateColumns: '1.1fr 0.9fr' }}>
                        <div className="relative overflow-hidden rounded-3xl">
                          <div
                            className={clsx(
                              'absolute inset-0 backdrop-blur-[1px]',
                              template.imageOverlayClass,
                            )}
                          />
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt="Produit"
                              className="relative inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <div
                              className={clsx(
                                'relative flex h-full flex-col items-center justify-center gap-3 text-center text-sm font-medium',
                                template.surfaceClass,
                                template.subtleTextClass,
                              )}
                            >
                              <ImageIcon className="h-10 w-10" />
                              <span>Ajoutez votre visuel produit</span>
                            </div>
                          )}
                        </div>
                        <div
                          className={clsx(
                            'flex flex-col justify-between gap-4 rounded-3xl p-5 text-left',
                            template.surfaceClass,
                          )}
                        >
                          <div>
                            <h3 className="text-3xl font-semibold leading-tight">
                              {headline}
                            </h3>
                            <p
                              className={clsx(
                                'mt-4 text-sm leading-relaxed',
                                template.subtleTextClass,
                              )}
                            >
                              {subheadline}
                            </p>
                          </div>
                          <div>
                            {price ? (
                              <p className="text-2xl font-bold">
                                {price}
                              </p>
                            ) : null}
                            {cta ? (
                              <span
                                className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-900"
                                style={{ backgroundColor: template.accentColor }}
                              >
                                {cta}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )}

                    {layout === 'focus' && (
                      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-3xl">
                        {imageSrc ? (
                          <>
                            <img
                              src={imageSrc}
                              alt="Produit"
                              className="absolute inset-0 h-full w-full object-cover opacity-70"
                            />
                            <div
                              className={clsx(
                                'absolute inset-0 backdrop-blur-sm',
                                template.overlayClass,
                              )}
                            />
                          </>
                        ) : (
                          <div
                            className={clsx(
                              'absolute inset-0 flex items-center justify-center',
                              template.imageOverlayClass,
                              template.subtleTextClass,
                            )}
                          >
                            <ImageIcon className="h-12 w-12" />
                          </div>
                        )}
                        <div
                          className={clsx(
                            'relative z-10 flex w-full flex-col items-center gap-4 rounded-3xl p-6 text-center',
                            template.focusPanelClass,
                          )}
                        >
                          <h3 className="text-4xl font-semibold leading-tight">
                            {headline}
                          </h3>
                          <p
                            className={clsx(
                              'max-w-md text-base',
                              template.subtleTextClass,
                            )}
                          >
                            {subheadline}
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
                            {price ? (
                              <span className="rounded-full bg-white/90 px-5 py-2 text-slate-900">
                                {price}
                              </span>
                            ) : null}
                            {cta ? (
                              <span
                                className="rounded-full px-5 py-2 text-slate-900"
                                style={{ backgroundColor: template.accentColor }}
                              >
                                {cta}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )}

                    {layout === 'story' && (
                      <div className="grid h-full gap-5" style={{ gridTemplateColumns: '0.8fr 1.2fr' }}>
                        <div
                          className={clsx(
                            'flex flex-col justify-between rounded-3xl p-5 text-left',
                            template.surfaceClass,
                          )}
                        >
                          <h3 className="text-4xl font-semibold leading-tight">
                            {headline}
                          </h3>
                          <div
                            className={clsx('space-y-3 text-sm', template.subtleTextClass)}
                          >
                            <p>{subheadline}</p>
                            {price ? (
                              <p className="text-xl font-semibold">
                                {price}
                              </p>
                            ) : null}
                            {cta ? (
                              <span
                                className="inline-flex items-center gap-2 text-sm font-semibold"
                                style={{ color: template.accentColor }}
                              >
                                {cta}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt="Produit"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                          <div
                            className={clsx(
                              'flex h-full flex-col items-center justify-center gap-3',
                              template.subtleTextClass,
                            )}
                          >
                            <ImageIcon className="h-10 w-10" />
                            <span>Votre visuel s’affichera ici</span>
                          </div>
                        )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className={clsx(
                      'mt-8 flex items-center justify-between text-xs',
                      template.subtleTextClass,
                    )}
                  >
                    <span>© Votre marque</span>
                    <span>Format Facebook 1:1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Rédaction du texte
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Une légende est composée automatiquement à partir de vos champs.
              Ajustez les hashtags si besoin.
            </p>
            <div className="mt-5 space-y-4 rounded-2xl bg-slate-50 p-4">
              <pre className="whitespace-pre-wrap text-sm text-slate-700">
                {generatedCaption}
              </pre>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className={clsx(
                    'inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold transition',
                    copied
                      ? 'border-emerald-500 text-emerald-600'
                      : 'text-slate-600 hover:border-emerald-400 hover:text-emerald-600',
                  )}
                >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copié
                        </>
                  ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copier la légende
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Contenu du post
            </h2>
            <div className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-slate-600">
                Titre
                <input
                  type="text"
                  value={headline}
                  onChange={(event) => setHeadline(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  placeholder="Titre du post"
                />
              </label>
              <label className="block text-sm font-medium text-slate-600">
                Description
                <textarea
                  value={subheadline}
                  onChange={(event) => setSubheadline(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  rows={3}
                  placeholder="Mettre en avant les bénéfices du produit"
                />
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-600">
                  Prix
                  <input
                    type="text"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    placeholder="Ex. 49,90 €"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Badge
                  <input
                    type="text"
                    value={badge}
                    onChange={(event) => setBadge(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    placeholder="Ex. Édition limitée"
                  />
                </label>
              </div>
              <label className="block text-sm font-medium text-slate-600">
                Appel à l’action
                <input
                  type="text"
                  value={cta}
                  onChange={(event) => setCta(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  placeholder="Ex. Commander maintenant"
                />
              </label>
              <label className="block text-sm font-medium text-slate-600">
                Hashtags
                <input
                  type="text"
                  value={hashtags}
                  onChange={(event) => setHashtags(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  placeholder="#promotion #marque"
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Style graphique
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Thème
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-3">
                  {TEMPLATES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedTemplateId(item.id)}
                      className={clsx(
                        'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition',
                        selectedTemplateId === item.id
                          ? 'border-emerald-400 bg-emerald-50'
                          : 'border-slate-200 hover:border-emerald-300',
                      )}
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.description}
                        </p>
                      </div>
                      {selectedTemplateId === item.id ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-slate-300" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Disposition
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-3">
                  {LAYOUTS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setLayout(item.id)}
                      className={clsx(
                        'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition',
                        layout === item.id
                          ? 'border-emerald-400 bg-emerald-50'
                          : 'border-slate-200 hover:border-emerald-300',
                      )}
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.description}
                        </p>
                      </div>
                      {layout === item.id ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-slate-300" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Gestion du visuel
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600"
              >
                <Upload className="h-4 w-4" />
                Importer
              </button>
              <button
                type="button"
                onClick={handleResetImage}
                disabled={!imageSrc}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-400 disabled:opacity-40"
              >
                Réinitialiser
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Conseillé&nbsp;: visuel carré ou détouré (PNG transparent) pour un
              rendu optimal sur Facebook.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
