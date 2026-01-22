export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-white/70 dark:bg-black/50">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
        <p>© {year} Radio Agakiza</p>
        <div className="flex gap-4">
          <a href="#" aria-label="Facebook" className="hover:underline">Fb</a>
          <a href="#" aria-label="YouTube" className="hover:underline">YT</a>
          <a href="#" aria-label="Twitter" className="hover:underline">X</a>
        </div>
      </div>
    </footer>
  );
}
