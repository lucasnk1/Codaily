export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
        <span className="font-mono text-lg font-semibold tracking-tight text-text-primary">
          <span className="text-accent">{"</>"}</span> Codaily
        </span>
      </div>
    </header>
  );
}
