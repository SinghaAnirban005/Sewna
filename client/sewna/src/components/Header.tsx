export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 animate-fade-in">
      <div className="mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-accent"
              style={{ color: '#00b67f' }}
            >
              <path
                d="M16 4L4 10V22L16 28L28 22V10L16 4Z"
                fill="currentColor"
                className="opacity-20"
              />
              <path
                d="M16 4L4 10V22L16 28L28 22V10L16 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="16" cy="16" r="4" fill="currentColor" />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-accent" style={{ color: '#00b67f' }}>SEWNA</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#about"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Pricing
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};
