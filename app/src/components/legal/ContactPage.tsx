export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="font-light text-[var(--foreground)] leading-tight mb-6 sm:mb-8 font-serif text-3xl sm:text-4xl">Contact</h1>
        <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed max-w-xl mx-auto px-4">
          Add your email below for anyone to contact if needed.
        </p>
        <p className="mt-6 text-lg">
          <a
            href="mailto:you@yourdomain.com"
            className="font-mono text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
          >
            you@yourdomain.com
          </a>
        </p>
      </div>
    </div>
  );
}
