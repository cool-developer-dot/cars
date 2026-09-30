export default function PlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <div className="hero flex flex-col flex-1 font-sans">
      <main className="flex flex-1 w-full items-center justify-center px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white drop-shadow-md">
          {title}
        </h1>
      </main>
    </div>
  );
}
