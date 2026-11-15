export default function CuratorPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="font-light text-[var(--foreground)] leading-tight mb-6 sm:mb-8 font-serif text-3xl sm:text-4xl">
          Curator
        </h1>
        <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed max-w-xl mx-auto px-4">
          Public curator pages are not live yet. When they are, each curator will be linked at{' '}
          <span className="font-mono text-[var(--foreground)]">curator.name.yourdomain.com</span>
          , where <span className="font-mono text-[var(--foreground)]">name</span> is the curator&apos;s
          name (for example, <span className="font-mono text-[var(--foreground)]">curator.john.yourdomain.com</span>).
        </p>
        <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed max-w-xl mx-auto px-4 mt-6">
          Once that website is linked, delete this page. Point the Curator button in the Vaults menu
          at the website, so it no longer opens this page.
        </p>
      </div>
    </div>
  );
}
