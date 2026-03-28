export default function Footer() {
  return (
    <footer className="border-t border-themed py-5 bg-themed-card/80 backdrop-blur-sm mt-8">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-themed-secondary">
          <p>© 2024 primeLine GmbH - Server Configurator</p>
          <p className="text-xs">All prices are net prices in EUR</p>
        </div>
      </div>
    </footer>
  );
}
